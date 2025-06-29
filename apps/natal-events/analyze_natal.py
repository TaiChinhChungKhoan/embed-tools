"""
This script is used to analyze the natal chart of a given instrument.
It uses the swisseph library to calculate the natal chart and the transits of the planets.
It also calculates the mercury retrograde days of the planets.
It also calculates the aspect windows of the planets.

Installation guide:
You need to first install python 3.10 or higher.
Then install all the dependencies by running the following command:

pip install swisseph pandas

Data file:
You can to create a data file in the `data` folder.
The data file is a CSV or Excel file with the following columns:
instrument, birth_date, birth_time, birth_location, lat, lon, utc_offset

This will allow you to run the script without having to provide all the parameters.

Usage:
python analyze_natal.py --instrument VNIndex --birth-date 2000/07/28 --birth-time 09:00 --birth-location "Ho Chi Minh City" --lat 10.7769N --lon 106.7009E --utc-offset +07:00 --start-date 2025/01/01 --end-date 2025/12/31 --orb-days 2 --min-score 4.0 --top-n 3 --transit-planets Sun Moon --filter Ascendant Midheaven Sun Moon Mercury Jupiter Neptune

For more details, you can run the help command:
python analyze_natal.py --help
"""

import swisseph as swe
import datetime
import argparse
import re
import sys
import pandas as pd
import os
import urllib.request
from collections import defaultdict
import logging

# Logging setup
logger = logging.getLogger(__name__)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(message)s"))
logger.addHandler(handler)
logger.setLevel(logging.WARNING)  # Default to WARNING level (minimal output)

# Ephemeris file setup
EPHE_DIR = os.path.join(os.getcwd(), "data", "ephe")
REQUIRED_FILES = [
    "sepl_00.se1",
    "sepl_06.se1",
    "sepl_12.se1",
    "sepl_18.se1",
    "sepl_24.se1",
]
EPHE_URLS = {
    fname: f"https://raw.githubusercontent.com/aloistr/swisseph/master/ephe/{fname}"
    for fname in REQUIRED_FILES
}

# Aspect definitions with orbs and polarities based on astrological methodology
ASPECTS = [
    {"angle": 0, "name": "Conjunction (0°)",    "orb": 10, "interpretation": "New cycle, release of energy. Good.", "polarity":  0.8},
    # {"angle": 60, "name": "Sextile (60°)",      "orb":  6, "interpretation": "Opportunity, support. Fair.", "polarity":  0.5},
    {"angle": 90, "name": "Square (90°)",       "orb":  6, "interpretation": "Tension, challenge, friction. Bad.", "polarity": -1.0},
    {"angle":120, "name": "Trine (120°)",       "orb":  6, "interpretation": "Harmony, natural flow. Good. Great.", "polarity":  1.0},
    {"angle":180, "name": "Opposition (180°)",  "orb": 10, "interpretation": "Culmination, confrontation. Bad.", "polarity": -1.0},
]

# Planet identifiers for swisseph
PLANETS = {
    "Sun":     swe.SUN,
    "Moon":    swe.MOON,
    "Mercury": swe.MERCURY,
    "Venus":   swe.VENUS,
    "Mars":    swe.MARS,
    "Jupiter": swe.JUPITER,
    "Neptune": swe.NEPTUNE,
}

SIGN_RULERS_TRADITIONAL = {
    "Aries": "Mars",   "Taurus": "Venus", "Gemini": "Mercury",  "Cancer": "Moon",
    "Leo":   "Sun",    "Virgo": "Mercury", "Libra":  "Venus",    "Scorpio":"Pluto",
    "Sagittarius":"Jupiter", "Capricorn":"Saturn", "Aquarius":"Uranus", "Pisces":"Neptune",
}

# Orb and weight adjustments
PLANET_ORB_ADJUSTMENTS = {
    "Moon":   0.8, "Sun": 2.2, "Venus":2.2, "Mars":1.5, "Mercury":1.5,
    "Jupiter":1.7, "Neptune":1.7,
}
PLANET_WEIGHTS = {
    "Sun":2.0, "Moon":0.4, "Venus":0.5, "Mars":1.2,
    "Mercury":0.5, "Jupiter":1.0, "Neptune":0.8,
}

SIGNIFICANCE_THRESHOLD = 3
RULING_PLANET_BONUS   = 2.5
RETROGRADE_BONUS      = 1.0

def load_config_file(instrument, config_file=None):    
    """
    Load instrument data from a CSV or Excel file.
    Returns a dict with instrument details if found, else None.
    """
    if config_file:
        file_paths = [config_file]
    else:
        file_paths = [
            os.path.join(os.getcwd(), "data", f)
            for f in ["natals.csv", "natals.xlsx", "natals.xls"]
            if os.path.exists(os.path.join(os.getcwd(), "data", f))
        ]
        
    
    if not file_paths:
        return None
    
    for file_path in file_paths:
        try:
            if file_path.endswith(".csv"):
                df = pd.read_csv(file_path)
            else:  # .xlsx or .xls
                df = pd.read_excel(file_path)
            
            # Ensure required columns exist
            required_cols = ["instrument", "birth_date", "birth_time", "birth_location", 
                            "lat", "lon", "utc_offset"]
            if not all(col in df.columns for col in required_cols):
                logger.warning(f"Config file {file_path} missing required columns")
                continue
            
            # Find row matching the instrument            
            row = df[df["instrument"].str.upper() == instrument]
            
            if row.empty:
                logger.warning(f"No data for instrument {instrument} in {file_path}")
                continue
            
            # Convert row to dict
            data = row.iloc[0].to_dict()
            return {
                "instrument": data["instrument"],
                "birth_date": data["birth_date"],
                "birth_time": data["birth_time"],
                "birth_location": data["birth_location"],
                "lat": data["lat"],
                "lon": data["lon"],
                "utc_offset": data["utc_offset"]                
            }
        except Exception as e:
            logger.warning(f"Failed to read {file_path}: {e}")
            continue
    
    return None

class FinancialAstrology:
    _ephemeris_checked = False

    def __init__(self, instrument_name, birth_date, birth_time,
                 birth_location, lat, lon, utc_offset="+07:00"):
        self.instrument_name = instrument_name
        self.birth_location  = birth_location        

        # Parse UTC offset
        sign = 1 if utc_offset.startswith("+") else -1
        try:
            h, m = map(int, utc_offset[1:].split(":"))
        except Exception:
            raise ValueError(f"Invalid UTC offset: {utc_offset}. Use '+HH:MM' or '-HH:MM'.")
        self.utc_offset = sign * (h + m/60)
        logger.debug(f"Parsed UTC offset: {self.utc_offset}")

        # Parse coords
        self.lat = self._parse_lat_lon(lat, "lat")
        self.lon = self._parse_lat_lon(lon, "lon")

        # Parse birth datetime
        dt_str = f"{birth_date} {birth_time}"
        try:
            self.birth_datetime = datetime.datetime.strptime(dt_str, "%Y/%m/%d %H:%M")
        except ValueError:
            raise ValueError(f"Invalid birth date/time: {dt_str}. Use 'YYYY/MM/DD HH:MM'.")

        # Compute Julian day
        self.utc_datetime = self.birth_datetime - datetime.timedelta(hours=self.utc_offset)
        self.jd_natal = swe.julday(
            self.utc_datetime.year,
            self.utc_datetime.month,
            self.utc_datetime.day,
            self.utc_datetime.hour + self.utc_datetime.minute/60.0
        )

        # Ensure ephemeris and set path
        self._ensure_ephemeris_ready()
        swe.set_ephe_path(EPHE_DIR)

        # Houses and angles
        self._houses, self._ascmc = swe.houses(self.jd_natal, self.lat, self.lon, b"P")

        # Natal positions & ruling planet
        self.all_natal_points    = self._get_natal_positions()
        self.ruling_planet_name  = self._get_ruling_planet()

    @classmethod
    def _ephemeris_files_exist(cls):
        for fname in REQUIRED_FILES:
            path = os.path.join(EPHE_DIR, fname)
            if not os.path.exists(path) or os.path.getsize(path) == 0:
                return False
        return True

    @classmethod
    def _download_and_extract_ephemeris(cls):
        os.makedirs(EPHE_DIR, exist_ok=True)
        for fname, url in EPHE_URLS.items():
            dest = os.path.join(EPHE_DIR, fname)
            if os.path.exists(dest) and os.path.getsize(dest) > 0:
                continue
            urllib.request.urlretrieve(url, dest)
            if os.path.getsize(dest) == 0:
                raise FileNotFoundError(f"Downloaded file is empty: {fname}")

    @classmethod
    def _ensure_ephemeris_ready(cls):
        if not cls._ephemeris_checked:
            if not cls._ephemeris_files_exist():
                cls._download_and_extract_ephemeris()
            cls._ephemeris_checked = True

    def _parse_lat_lon(self, coord, coord_type):
        coord = coord.strip()
        m = re.match(r"^([+-]?\d+(?:\.\d+)?)([NnSsEeWw])$", coord)
        if not m:
            raise ValueError(f"Invalid {coord_type}: '{coord}'. Use e.g. '10.7769N'.")
        val, d = m.groups()
        val = float(val)
        if d.upper() in ("S", "W"):
            val = -val
        maxv = 90 if coord_type == "lat" else 180
        if abs(val) > maxv:
            raise ValueError(f"{coord_type.title()} out of range: {val}")
        logger.debug(f"Parsed {coord_type}: {val}")
        return val

    def _get_natal_positions(self):
        pos = {}
        for name, pid in PLANETS.items():
            lon, _ = swe.calc_ut(self.jd_natal, pid)
            pos[name] = lon[0]
        pos["Ascendant"]  = self._ascmc[0]
        pos["Midheaven"]  = self._ascmc[1]
        return pos

    def _get_ruling_planet(self):
        sign_rulers = SIGN_RULERS_TRADITIONAL
        asc_sign = self._get_sign(self._ascmc[0])
        mc_sign  = self._get_sign(self._ascmc[1])
        asc_r    = sign_rulers.get(asc_sign, "Mercury")
        mc_r     = sign_rulers.get(mc_sign,  "Mercury")
        logger.debug(f"Ascendant sign: {asc_sign} → {asc_r}")
        logger.debug(f"Midheaven sign: {mc_sign}  → {mc_r}")
        if asc_r != mc_r:
            logger.warning(f"Ascendant ruler ({asc_r}) differs from Midheaven ruler ({mc_r}). Using {asc_r}.")
        return asc_r

    def _get_sign(self, longitude):
        signs = [
            "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
            "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
        ]
        return signs[int(longitude // 30)]


    def find_retrograde_days(self, planet, start_date, end_date):
        """Return every date between start/end where `planet` is retrograde."""
        sd = datetime.datetime.strptime(start_date, "%Y/%m/%d")
        ed = datetime.datetime.strptime(end_date,   "%Y/%m/%d")
        one_day = datetime.timedelta(days=1)
        cur = sd
        rx_days = []
        while cur <= ed:
            jd = swe.julday(cur.year, cur.month, cur.day, 12.0)
            xx, _ = swe.calc_ut(jd, PLANETS[planet], swe.FLG_SPEED)
            speed = xx[3]
            if speed < 0:
                rx_days.append(cur.strftime("%Y/%m/%d"))
            cur += one_day
        return rx_days

    def compute_retro_windows(self, retro_days):
        """
        Collapse a list of retrograde dates into contiguous windows with peaks.
        Returns list of dicts: {start, end, peak}.
        """
        if not retro_days:
            return []
        dates = sorted(set(retro_days), key=lambda d: datetime.datetime.strptime(d, '%Y/%m/%d'))
        windows = []
        block = [dates[0]]
        prev = dates[0]
        for d in dates[1:]:
            curr = datetime.datetime.strptime(d, '%Y/%m/%d')
            prior = datetime.datetime.strptime(prev, '%Y/%m/%d')
            if (curr - prior).days == 1:
                block.append(d)
            else:
                mid = block[len(block)//2]
                windows.append({'start': block[0], 'end': block[-1], 'peak': mid})
                block = [d]
            prev = d
        # final block
        mid = block[len(block)//2]
        windows.append({'start': block[0], 'end': block[-1], 'peak': mid})
        return windows
    
    def compute_aspect_windows(self, daily_events):
        ev_list = []
        for date, evs in daily_events.items():
            for ev in evs:
                transit_planet = ev['Transit Planet']
                natal_point = ev['Natal Point']
                aspect_name = ev['Aspect']
                key = (transit_planet, natal_point, aspect_name)
                ev_list.append({
                    'date': date,
                    'key': key,
                    'label': f"{transit_planet} → {natal_point} {aspect_name}",
                    'orb': ev['Orb Degree'],
                    'score': ev['Significance Score'],
                    'interpretation': ev['Interpretation']  # Include interpretation
                })

        groups = defaultdict(list)
        for ev in ev_list:
            groups[ev['key']].append(ev)

        windows = []
        for key, items in groups.items():
            items = sorted(items, key=lambda x: datetime.datetime.strptime(x['date'], "%Y/%m/%d"))
            block, prev = [items[0]], items[0]['date']

            def emit(b):
                dates = [i['date'] for i in b]
                peak = min(b, key=lambda x: x['orb'])
                return {
                    'Label': peak['label'],
                    'Start': dates[0],
                    'End': dates[-1],
                    'Peak': peak['date'],
                    'PeakOrb': peak['orb'],
                    'Score': peak['score'],
                    'Interpretation': peak['interpretation']  # Include interpretation
                }

            for ent in items[1:]:
                cur = datetime.datetime.strptime(ent['date'], "%Y/%m/%d")
                prv = datetime.datetime.strptime(prev, "%Y/%m/%d")
                if (cur - prv).days == 1:
                    block.append(ent)
                else:
                    windows.append(emit(block))
                    block = [ent]
                prev = ent['date']

            windows.append(emit(block))

        return windows
    
    def calculate_transits(self, start_date, end_date, orb_days=1,
                           transit_planets=None, natal_points_filter=None):
        """
        Calculate significant transit events between start_date and end_date.
        """
        # Parse dates
        try:
            sd = datetime.datetime.strptime(start_date, "%Y/%m/%d")
            ed = datetime.datetime.strptime(end_date,   "%Y/%m/%d")
        except ValueError:
            raise ValueError("Dates must be 'YYYY/MM/DD'")

        if sd > ed:
            raise ValueError("Start date must be on or before end date.")
        if orb_days <= 0:
            raise ValueError("orb_days must be positive.")

        # Defaults
        transit_planets = transit_planets or ["Sun","Moon"]
        transit_planets = [p for p in transit_planets if p in PLANETS]
        natal_points = (
            self.all_natal_points
            if natal_points_filter is None
            else {k:self.all_natal_points[k] for k in natal_points_filter}
        )

        planet_positions = defaultdict(dict)
        day_events      = defaultdict(list)
        total_found     = 0
        current         = sd
        one_day         = datetime.timedelta(days=1)

        while current <= ed:
            jd = swe.julday(current.year, current.month, current.day, 12.0)
            for tp in transit_planets:
                if current not in planet_positions[tp]:
                    # request speed by passing FLG_SPEED
                    xx, retflag = swe.calc_ut(jd, PLANETS[tp], swe.FLG_SPEED)
                    lon   = xx[0]
                    speed = xx[3]
                    planet_positions[tp][current] = (lon, speed < 0)

                tlon, is_retrograde = planet_positions[tp][current]
                for np_name, nlon in natal_points.items():
                    best, md = None, float("inf")
                    angular_separation = abs(swe.difdeg2n(tlon, nlon))
                    for asp in ASPECTS:
                        orb = asp["orb"] * PLANET_ORB_ADJUSTMENTS.get(tp, 1) * orb_days
                        orb_diff = abs(angular_separation - asp["angle"]) # Difference from the aspect's angle
                        if orb_diff <= orb:
                            if orb_diff < md: # Check if this is the tightest aspect so far
                                best, md = asp, orb_diff # Store the aspect and its orb difference

                    if best:
                        total_found += 1
                        exact = 1 - (md/(best["orb"]*PLANET_ORB_ADJUSTMENTS.get(tp,1)*orb_days))
                        is_rul = (np_name == self.ruling_planet_name)
                        tf     = ("Long-Term" if tp=="Sun"
                                  else "Short-Term" if tp=="Moon"
                                  else f"{tp}-Specific")
                        evt = {
                            "Transit Planet": tp,
                            "Aspect": best["name"],
                            "Orb Degree": round(md,2),
                            "Exactness Score": round(exact,2),
                            "Polarity Score": best["polarity"],
                            "Is Ruling Planet Hit": is_rul,
                            "Is Retrograde": is_retrograde,
                            "Timeframe": tf,
                            "Date": current
                        }
                        if tp!="Moon" or exact>0.97 or is_rul or (is_retrograde and tp=="Mercury"):
                            day_events[(current.strftime("%Y/%m/%d"), np_name)].append(evt)
            current += one_day

        logger.debug(f"Raw transit events found: {total_found}")

        # Aggregate, score, and filter
        results = []
        for (dstr, np_name), evts in day_events.items():
            if not evts:
                continue
            num  = len(evts)
            hit  = any(e["Is Ruling Planet Hit"]    for e in evts)
            retro= any(e["Is Retrograde"] and e["Transit Planet"]=="Mercury" for e in evts)
            frames = {e["Timeframe"] for e in evts}
            tf = ("Long-Term" if "Long-Term" in frames
                else "Mixed"     if len(frames)>1
                else frames.pop())

            base_score = sum(
                e["Exactness Score"] * (e["Polarity Score"] + 1.5)
                * (PLANET_WEIGHTS.get(e["Transit Planet"],1.0)
                if not (e["Transit Planet"] in ["Mercury","Venus"] and not e["Is Ruling Planet Hit"])
                else 0.5)
                + (RULING_PLANET_BONUS if e["Is Ruling Planet Hit"] else 0)
                + (RETROGRADE_BONUS if e["Is Retrograde"] and e["Transit Planet"]=="Mercury" else 0)
                for e in evts
            )
            tot_score = base_score * (1 + num*0.7)
            if abs(tot_score) >= SIGNIFICANCE_THRESHOLD:
                # Find the tightest orb of the day's aspects
                min_orb = min(e["Orb Degree"] for e in evts)
                min_orb_event = min(evts, key=lambda x: x["Orb Degree"])  # Get event with smallest orb

                trans_summ = "; ".join(
                    f"{e['Transit Planet']} {e['Aspect']}{' Rx' if e['Is Retrograde'] else ''}"
                    f" (Orb {e['Orb Degree']}°)"
                    for e in sorted(evts, key=lambda x: x["Orb Degree"])
                )
                # Use interpretation of the event with the tightest orb
                interp = next(
                    a["interpretation"] for a in ASPECTS if a["name"] == min_orb_event["Aspect"]
                )
                results.append({
                    "Date": dstr,
                    "Natal Point": np_name,
                    "Number of Transits": num,
                    "Is Ruling Planet Hit": hit,
                    "Mercury Retrograde": retro,
                    "Significance Score": round(tot_score, 2),
                    "Orb Degree": round(min_orb, 2),
                    "Timeframe": tf,
                    "Transits": trans_summ,
                    "Interpretation": interp,
                    "DateObj": datetime.datetime.strptime(dstr, "%Y/%m/%d"),
                    "Transit Planet": min_orb_event["Transit Planet"],
                    "Aspect": min_orb_event["Aspect"]
                })                

        logger.debug(f"Filtered transit events: {len(results)}")
        return sorted(results, key=lambda x: (x["DateObj"], -x["Significance Score"]))

    def prepare_outputs(self, events, retro_days, max_orb=180.0, top_n=2):
        # 1) Filter events
        filtered = [e for e in events if e['Orb Degree'] <= max_orb]
        # 2) Group daily_events
        daily_events = defaultdict(list)
        for e in filtered:
            daily_events[e['Date']].append(e)
        # limit top_n per date
        for date, evs in daily_events.items():
            daily_events[date] = sorted(evs, key=lambda x: -x['Significance Score'])[:top_n]
        # 3) windows
        retro_windows   = self.compute_retro_windows(retro_days)
        aspect_windows  = self.compute_aspect_windows(daily_events)
        return daily_events, aspect_windows, retro_windows
    
    
    def display_natal_chart(self):
        print("-"*40)
        print(f"NATAL CHART: {self.instrument_name}")
        print(f"Born: {self.birth_datetime:%Y-%m-%d %H:%M}"
              f" at {self.lat:.4f},{self.lon:.4f} (UTC{self.utc_offset:+.2f})")
        print(f"Ruling Planet: {self.ruling_planet_name}")        
        print("-"*40)
        for name, deg in self.all_natal_points.items():
            if name in ("Ascendant","Midheaven","Sun","Moon",
                        "Mercury","Mars","Jupiter","Neptune"):
                d = int(deg)
                m = int((deg - d)*60)
                s = int((((deg - d)*60)-m)*60)
                sign = self._get_sign(deg)
                print(f"{name:<12}: {d:02d}°{m:02d}'{s:02d}\" {sign}")
        print("-"*40)

    def display_window_summary(self, retro_windows, aspect_windows):
        """
        Print all windows (retro & aspects) in chronological order,
        grouped by identical start/end spans.
        retro_windows: list of dicts with keys 'start','end','peak'
        aspect_windows: list of dicts with keys 'Label','Start','Peak','End','PeakOrb','Score'
        """
        import datetime
        from collections import defaultdict

        by_span = defaultdict(list)

        # bucket retrograde
        for w in retro_windows:
            by_span[(w['start'], w['end'])].append({
                'type': 'retro',
                'peak': w['peak']
            })

        # bucket aspects
        for w in aspect_windows:
            by_span[(w['Start'], w['End'])].append({
                'type':  'aspect',
                'label': w['Label'],
                'peak':  w['Peak'],
                'orb':   w['PeakOrb'],
                'score': w['Score']
            })

        # sort the spans by start date
        spans = sorted(by_span.keys(),
                    key=lambda se: datetime.datetime.strptime(se[0], "%Y/%m/%d"))

        print(f"\nUNIFIED WINDOW SUMMARY FOR {self.instrument_name.upper()}")
        for start, end in spans:
            print(f"\n{start} – {end}:")
            for entry in by_span[(start, end)]:
                if entry['type'] == 'retro':
                    print(f"  • Mercury Retrograde (peak {entry['peak']})")
                else:
                    print(
                        f"  • {entry['label']}: peak {entry['peak']}"
                        f" @ orb {entry['orb']}° (score {entry['score']})"
                    )

    def display_transits(self, retro_windows, aspect_windows):
        """
        Print a unified, chronological list of:
        • Mercury Retrograde windows
        • Collapsed aspect windows with interpretations
        retro_windows: list of dicts with keys 'start','end','peak'
        aspect_windows: list of dicts with keys 'Label','Start','Peak','End','PeakOrb','Score','Interpretation'
        """
        import datetime

        # 1) build a single mixed list
        items = []
        for w in retro_windows:
            items.append({
                'type':  'retro',
                'start': w['start'],
                'end':   w['end'],
                'peak':  w['peak']
            })
        for w in aspect_windows:
            items.append({
                'type':     'aspect',
                'start':    w['Start'],
                'end':      w['End'],
                'peak':     w['Peak'],
                'label':    w['Label'],
                'peak_orb': w['PeakOrb'],
                'score':    w['Score'],
                'interpretation': w['Interpretation']
            })

        # 2) sort by start date
        items.sort(key=lambda x: datetime.datetime.strptime(x['start'], '%Y/%m/%d'))

        # 3) print
        print(f"\nUNIFIED WINDOW SUMMARY FOR {self.instrument_name.upper()}")
        for it in items:
            if it['type'] == 'retro':
                # This line can also be updated for consistency if you like
                print(f"  • {it['start']} – {it['end']}: Mercury Retrograde (peak {it['peak']})")
            else:
                # The key change is here:
                print(
                    f"  • {it['start']} – {it['end']}: {it['label']}"
                    f" (peak {it['peak']} @ orb {it['peak_orb']}°, score {it['score']}; {it['interpretation']})"
                )

    def summarize_aspect_windows(self, events):
        """
        Collapse aggregated daily events into windows per Natal Point,
        reporting start date, end date, and the peak day (smallest orb).
        
        Expects `events` to be a list of dicts with keys:
        'Date' (YYYY/MM/DD), 'Natal Point', 'Orb Degree',
        'Significance Score' and 'Transits' (the combined string).
        
        Returns a list of dicts with keys:
        'Natal Point', 'Transits', 'Start', 'Peak', 'End', 'PeakOrb', 'Score'
        """
        from collections import defaultdict
        import datetime

        # 1) group by Natal Point
        groups = defaultdict(list)
        for e in events:
            np = e['Natal Point']
            groups[np].append(e)

        # 2) build summary per group
        summary = []
        for np, grp in groups.items():
            # sort by date
            grp_sorted = sorted(grp,
                key=lambda x: datetime.datetime.strptime(x['Date'], '%Y/%m/%d')
            )
            # pick the peak event = smallest orb
            best = min(grp_sorted, key=lambda x: x['Orb Degree'])
            summary.append({
                'Natal Point': np,
                'Transits':    best['Transits'],
                'Start':       grp_sorted[0]['Date'],
                'Peak':        best['Date'],
                'End':         grp_sorted[-1]['Date'],
                'PeakOrb':     best['Orb Degree'],
                'Score':       best['Significance Score']
            })

        return summary

def main():
    parser = argparse.ArgumentParser(
        description="""
Financial Astrology Analysis Tool

This script performs financial astrology analysis by comparing a market's natal chart (based on its inception date)
with transiting planetary positions to predict significant market events. It uses the Swiss Ephemeris library to compute
planetary positions and aspects, focusing on the VNIndex or other financial instruments.

**Purpose and Methodology**:
The script creates a natal chart (the "inner ring") for a financial instrument (e.g., VNIndex, stocks, or cryptocurrencies)
using its "birth" details, such as the first trading day, IPO date, or establishment date. The natal chart includes key points
like the Ascendant, Midheaven, Sun, Moon, and other planets, with a focus on the ruling planet (e.g., Mercury for VNIndex).
The script then calculates transits (the "outer ring") by tracking the positions of the Sun and Moon (and optionally other planets)
over a specified period, identifying significant aspects (angles) formed with natal points. These aspects include:
- Conjunction (0°): Neutral, indicating a new cycle or energy release.
- Square (90°) and Opposition (180°): Challenging aspects, often linked to market turbulence.
- Trine (120°) and Sextile (60°): Harmonious aspects, potentially indicating positive market conditions.
The script merges consecutive days with the same transit type into windows, reporting the start, end, and peak dates (smallest orb)
along with a significance score. Mercury retrograde periods are also identified, as they can significantly impact markets, especially
when the ruling planet is Mercury (e.g., VNIndex).

**Key Concepts**:
- **Natal Chart**: Represents the market's astrological "birth" based on its first trading day or significant date. For VNIndex,
  the default is July 28, 2000, at 9:00 AM in Ho Chi Minh City (10.7769N, 106.7009E).
- **Transit Chart**: Tracks current positions of transiting planets (primarily Sun and Moon) to identify aspects with natal points.
- **Aspects**: Angular relationships (e.g., 0°, 90°, 120°, 180°) between transiting and natal points, with an orb (degree of deviation)
  to account for imprecise timing.
- **Ruling Planet**: The planet governing the Ascendant and/or Midheaven signs (e.g., Mercury for Virgo Ascendant and Gemini Midheaven
  in VNIndex), which has a profound impact on market behavior, especially during retrogrades.
- **Significance Score**: A calculated score measuring an aspect's impact. It's based on the aspect's exactness, its nature (harmonious vs. challenging), the planets involved, and whether the ruling planet is hit.

**Usage Example**:
To analyze VNIndex transits for 2025:
```bash
python analyze_natal.py --instrument VNIndex --birth-date 2000/07/28 --birth-time 09:00 --birth-location "Ho Chi Minh City" --lat 10.7769N --lon 106.7009E --utc-offset +07:00 --start-date 2025/01/01 --end-date 2025/12/31 --orb-days 2 --min-score 4.0 --top-n 3 --transit-planets Sun Moon --filter Ascendant Midheaven Sun Moon Mercury Jupiter Neptune
```

**Output**:
The script outputs:
1. **Natal Chart**: Details of the market's astrological birth, including positions of key points and planets.
2. **Unified Window Summary**: Merged transit windows (e.g., Sun → Neptune Conjunction) and Mercury retrograde periods, with start/end dates,
   peak date (smallest orb), orb degree, and significance score.
""",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("--instrument",     default="VNIndex",      help="Market or instrument name")
    parser.add_argument("--birth-date",     default=None,           help="Birth date (YYYY/MM/DD)")
    parser.add_argument("--birth-time",     default=None,           help="Birth time (HH:MM)")
    parser.add_argument("--birth-location", default=None,           help="Birth location")
    parser.add_argument("--lat",            default=None,           help="Latitude (e.g., 10.7769N)")
    parser.add_argument("--lon",            default=None,           help="Longitude (e.g., 106.7009E)")
    parser.add_argument("--utc-offset",     default=None,           help="UTC offset (e.g., +07:00)")
    parser.add_argument("--start-date",     default="2025/01/01",   help="Start date (YYYY/MM/DD)")
    parser.add_argument("--end-date",       default="2025/12/31",   help="End date (YYYY/MM/DD)")
    parser.add_argument("--orb-days",       type=int,   default=2,   help="Orb window in degrees/days")
    parser.add_argument("--min-score",      type=float, default=4.0, help="Minimum significance score to display")
    parser.add_argument("--top-n",          type=int,   default=3,   help="How many hits per date to show")
    parser.add_argument("--transit-planets", nargs="*", default=["Sun","Moon"],
                        help="Transiting planets (e.g., Sun Moon)")
    parser.add_argument("--filter", nargs="*", default=[
        "Ascendant","Midheaven","Sun","Moon","Mercury","Jupiter","Neptune"
    ], help="Natal points to include")    
    parser.add_argument("--config-file", default=None, help="Path to config file (CSV or Excel)")
    parser.add_argument("--verbose", action="store_true", help="Enable verbose logging")

    args = parser.parse_args()

    # Enable DEBUG logging if --verbose is specified
    if args.verbose:
        logger.setLevel(logging.DEBUG)
        
    try:        
        # Use config file values if available, otherwise fall back to arguments or defaults
        instrument = args.instrument.upper()
        
        # Load config from file if available
        config = load_config_file(instrument, args.config_file)
        
        birth_date = args.birth_date or config.get("birth_date", None) if config else None
        birth_time = args.birth_time or config.get("birth_time", None) if config else None
        birth_location = args.birth_location or config.get("birth_location", None) if config else None
        lat = args.lat or config.get("lat", None) if config else None
        lon = args.lon or config.get("lon", None) if config else None
        utc_offset = args.utc_offset or config.get("utc_offset", None) if config else None        
        
        # Validate that required parameters are provided
        if not all([birth_date, birth_time, birth_location, lat, lon, utc_offset]):
            raise ValueError("Missing required parameters. Provide them via arguments or config file.")

        # Set default start_date (90 days before today) and end_date (90 days after today)
        today = datetime.datetime.now()
        default_start_date = (today - datetime.timedelta(days=90)).strftime("%Y/%m/%d")
        default_end_date = (today + datetime.timedelta(days=90)).strftime("%Y/%m/%d")
        start_date = args.start_date or default_start_date
        end_date = args.end_date or default_end_date
                
        fa = FinancialAstrology(
            instrument_name   = instrument,
            birth_date        = birth_date,
            birth_time        = birth_time,
            birth_location    = birth_location,
            lat               = lat,
            lon               = lon,
            utc_offset        = utc_offset            
        )
        
        print(f"\nANALYSIS FOR {instrument}")
        fa.display_natal_chart()

        # Compute transits
        events = fa.calculate_transits(
            start_date          = start_date,
            end_date            = end_date,
            orb_days            = args.orb_days,
            transit_planets     = args.transit_planets,
            natal_points_filter = args.filter
        )

        # Find Mercury retrograde days
        rx_days = fa.find_retrograde_days(
            "Mercury",
            start_date,
            end_date
        )
        
        daily_events, aspect_windows, retro_windows = fa.prepare_outputs(events, rx_days, max_orb=args.orb_days, top_n=args.top_n)

        # Unified daily output with retrograde + top aspects
        fa.display_transits(retro_windows, aspect_windows)

    except (ValueError, FileNotFoundError) as e:
        logger.error(e)
        sys.exit(1)

if __name__ == "__main__":
    main()
