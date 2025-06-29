# Natal Events Analyzer

A React application for analyzing natal chart transits and planetary events for financial instruments. This app extracts the core logic from the Python `analyze_natal.py` script and provides a modern web interface for natal chart analysis.

## Features

- **Natal Chart Calculation**: Calculate natal chart positions for financial instruments
- **Transit Analysis**: Analyze planetary transits over natal chart points
- **Event Scoring**: Score events based on astrological significance
- **Timeline Visualization**: View events on an interactive timeline
- **Preset Instruments**: Quick access to common financial instruments
- **Custom Analysis**: Configure analysis parameters (orb days, min score, etc.)

## Key Improvements from analyze_natal.py

1. **Modern Web Interface**: Replaced command-line interface with React components
2. **Real-time Analysis**: Instant results without Python script execution
3. **Interactive Timeline**: Visual representation of transit events
4. **Preset Instruments**: Pre-configured data for popular financial instruments
5. **Responsive Design**: Works on desktop and mobile devices
6. **Component Reuse**: Leverages UI components from other apps in the workspace

## Usage

1. **Select Instrument**: Choose from preset instruments or enter custom details
2. **Configure Parameters**: Set analysis date range, orb days, and scoring thresholds
3. **Analyze**: Click "Analyze Natal Chart" to calculate transits
4. **Review Results**: View natal chart, timeline, and upcoming events

## Technical Implementation

### Core Logic (natalCalculator.js)
- Extracted and adapted from `analyze_natal.py`
- Simplified planetary position calculations (simulated for demo)
- Aspect calculation and scoring algorithms
- Transit window computation

### UI Components
- **DatePicker/TimePicker**: Reused from bazi-calculator
- **TimelineChart/TimelineList**: Adapted from astro-events
- **InstrumentSelector**: Custom component for instrument selection
- **EventFinder**: Search and filter functionality

### Key Features
- **Aspect Types**: Conjunction, Square, Trine, Opposition
- **Planetary Weights**: Different significance for different planets
- **Ruling Planet Bonus**: Extra significance for ruling planet aspects
- **Retrograde Detection**: Identifies retrograde periods
- **Score Calculation**: Combines multiple factors for event significance

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Dependencies

- React 19
- Tailwind CSS
- @embed-tools/components (shared UI components)
- @embed-tools/iframe-utils (embedding utilities)

## Future Enhancements

1. **Real Ephemeris**: Integrate actual Swiss Ephemeris calculations
2. **More Planets**: Add outer planets (Uranus, Neptune, Pluto)
3. **Advanced Aspects**: Include minor aspects and harmonics
4. **Export Features**: PDF reports and data export
5. **Historical Analysis**: Back-testing capabilities
6. **Real-time Data**: Integration with financial data APIs 