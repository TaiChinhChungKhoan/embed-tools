# vnindex analysis

This is an embeddable web application built with React, Vite, and Tailwind CSS v4.0.0.

## Development

```bash
# Start development server
pnpm --filter vnindex-analysis dev

# Build for production
pnpm --filter vnindex-analysis build

# Preview build
pnpm --filter vnindex-analysis preview
```

## Embedding

Your app will be available at:
`https://nilead.github.io/embed-tools/vnindex-analysis/`

### Iframe Embed
```html
<iframe 
  src="https://nilead.github.io/embed-tools/vnindex-analysis/"
  width="100%" 
  height="600px" 
  frameborder="0"
  title="vnindex analysis">
</iframe>
```

Data we have:

1. Market Breadth Indicators
Purpose: Overall market sentiment analysis using technical signals
Focus: Aggregate market-wide signals across all stocks
Key Signals:
Cho Mua (Buy): RSI < 40, Close > 1.03 * LLV, Volume > 50K
Cho Ban (Sell): RSI > 60, Close < 0.97 * HHV, Volume > 50K
Ap Luc Ban (Selling Pressure): RSI > 60, Close < 0.97 * HHV, Volume > 50K
Ban (Strong Sell): Close ≤ Low for 8 consecutive days
Mua (Strong Buy): Close ≥ High for 4 consecutive days
Output: Market-wide sentiment indicators with smoothing
Use Case: Market timing and overall sentiment assessment

market_breadth.json Output Structure:
JSON Output Structure:
{
  "metadata": {
    "analysis_date": "ISO datetime string",
    "parameters": {
      "periodR": 14,
      "periodHL": 4,
      "r_up": 60,
      "r_down": 40,
      "volume_threshold": 50000,
      "smooth_period": 5
    },
    "symbols_analyzed": "number of symbols processed",
    "date_range": {
      "start": "ISO date string",
      "end": "ISO date string"
    }
  },
  "vnindex": {
    "dates": ["ISO date strings"],
    "open": [float values],
    "high": [float values],
    "low": [float values],
    "close": [float values],
    "volume": [float values]
  },
  "market_breadth": {
    "dates": ["ISO date strings"],
    "indicators": {
      "cho_mua": {
        "raw": [integer counts],
        "smoothed": [float values]
      },
      "cho_ban": {
        "raw": [integer counts],
        "smoothed": [float values]
      },
      "ban": {
        "raw": [integer counts],
        "smoothed": [float values]
      },
      "mua": {
        "raw": [integer counts],
        "smoothed": [float values]
      }
    }
  },
  "signals": {
    "descriptions": {
      "cho_mua": "Buy Signal: RSI < 40, Close > 1.03 * LLV, Volume > threshold",
      "cho_ban": "Sell Signal: RSI > 60, Close < 0.97 * HHV, Volume > threshold",      
      "ban": "Strong Sell: Close <= Low for 8 consecutive days, Volume > threshold",
      "mua": "Strong Buy: Close >= High for 4 consecutive days, Volume > threshold"
    }
  }
}

2. Individual Stock Signals
Purpose: Stock-specific technical analysis and ranking
Focus: Individual stock signals and relative strength ranking
Key Features:
Relative Strength (RS) ratio vs VNINDEX
Storm Bird signal system (advanced multi-condition)
Industry-based processing
Stock ranking by performance
Output: Individual stock signals, rankings, and industry summaries
Use Case: Stock selection and industry rotation

individual_stock_signals.json Output Structure:
{
  "metadata": {
    "analysis_date": "ISO datetime string",
    "parameters": {
      "N": 14,
      "periodHL": 4,
      "periodR": 14,
      "r_up": 60,
      "r_down": 40
    },
    "industries_processed": "number of industries",
    "total_symbols": "number of symbols analyzed",
    "analysis_type": "individual_stock_signals"
  },
  "results": [
    {
      "symbol": "stock symbol",
      "date": "ISO date string",
      "close": "closing price (float)",
      "rs_rank": "relative strength rank (float)",
      "buy_signal": "boolean",
      "sell_signal": "boolean",
      "storm_bird_signal": "signal string (ChoMua/ChoBan/Mua/Ban) or null",
      "volume": "trading volume (float)",
      "volume_prev": "previous day volume (float)"
    }
  ],
  "industry_summary": {
    "symbol": {
      "rs_rank": "relative strength rank (float)",
      "storm_bird_signal": "signal string or null",
      "buy_signal": "boolean",
      "sell_signal": "boolean"
    }
  },
  "signals": {
    "descriptions": {
      "buy_signal": "Close >= High for 4 consecutive days",
      "sell_signal": "Close <= Low for 3 consecutive days OR 3-day high > 1.1 * current close",
      "storm_bird_signals": {
        "ChoMua": "RSI < 40, Close > 1.03 * 3-day low, Volume > 50,000",
        "ChoBan": "RSI > 60, Close < 0.97 * 3-day high, Volume > 50,000",
        "Mua": "Close >= High for 3 days, Volume > 50,000, Volume >= 0.7 * 10-day MA",
        "Ban": "Close <= Low for 3 days OR 3-day high > 1.1 * close, Volume > 50,000"
      }
    }
  }
}

3. Industry Strength Analysis
Purpose: Industry-level momentum and strength assessment
Focus: Industry performance relative to market
Key Features:
Three-tier strength/weakness signals (Early, Medium, Strong)
Industry rankings and momentum scores
Time-series analysis of industry performance
Multi-timeframe analysis (13-day and 49-day moving averages)
Output: Industry rankings, strength scores, and trend analysis
Use Case: Sector rotation and industry allocation

industry_strength_analysis.json Output Structure:
{
  "metadata": {
    "analysis_date": "ISO datetime string",
    "analysis_type": "industry_strength_analysis",
    "latest_date": "ISO datetime string",
    "total_industries": int,
    "total_symbols": int
  },
  "industry_summary": [
    {
      "industry": "string",
      "num_symbols": int,
      "rank": int,
      "total_score": float,
      "strength_counts": {
        "early": int,
        "medium": int,
        "strong": int
      },
      "weakness_counts": {
        "early": int,
        "medium": int,
        "strong": int
      },
      "strength_percentages": {
        "early": float,
        "medium": float,
        "strong": float
      },
      "weakness_percentages": {
        "early": float,
        "medium": float,
        "strong": float
      },
      "average_scores": {
        "strength": float,
        "weakness": float,
        "strength_minus_weakness": float
      }
    }
  ],
  "ticker_data": [
    {
      "symbol": "string",
      "industry": "string",
      "date": "ISO datetime string",
      "rs": float,
      "rs_13": float,
      "rs_49": float,
      "rs_slope": float,
      "rs_slope_up": boolean,
      "signals": {
        "early_strength": boolean,
        "medium_strength": boolean,
        "strong_strength": boolean,
        "early_weakness": boolean,
        "medium_weakness": boolean,
        "strong_weakness": boolean
      },
      "scores": {
        "strength": float,
        "weakness": float,
        "strength_minus_weakness": float
      }
    }
  ],
  "signals": {
    "descriptions": {
      "early_strength": "Short-term trend of RS is upward (RS slope > 0)",
      "medium_strength": "RS slope is up and RS is above its 13-day average",
      "strong_strength": "RS slope is up, RS is above RS13, and RS13 is above RS49 (long-term uptrend)",
      "early_weakness": "Short-term trend of RS is downward (RS slope ≤ 0)",
      "medium_weakness": "RS slope is down and RS is below its 13-day average",
      "strong_weakness": "RS slope is down, RS is below RS13, and RS13 is below RS49 (long-term downtrend)"
    }
  }
}

4. Daily Market Breadth 
Purpose: Simple up/down stock counting for market participation
Focus: Daily market participation and breadth ratios
Key Features:
Simple up/down/unchanged stock counting
Daily breadth ratios (up_count / (up_count + down_count))
Historical analysis from 2018 to present
Moving average smoothing options
Output: Daily breadth data with charts and statistics
Use Case: Market participation analysis and trend identification

market_breadth_4.json Output Structure:
{
  "metadata": {
    "analysis_date": "2025-07-06T12:34:56.789012",
    "analysis_type": "daily_market_breadth",
    "total_trading_days": 1460,
    "date_range": {
      "start": "2018-01-01T00:00:00",
      "end": "2025-07-04T00:00:00"
    }
  },
  "daily_data": [
    {
      "date": "2018-01-02T00:00:00",
      "up_count": 150,
      "down_count": 100,
      "unchanged_count": 50,
      "total_count": 300,
      "ratio": 0.6000,
      "smoothed_ratio": 0.6120,
      "up_smoothed": 145.2,
      "down_smoothed":  98.4,
      "signal": "Neutral"
    },
    {
      "date": "2018-01-03T00:00:00",
      "up_count": 180,
      "down_count":  80,
      "unchanged_count": 40,
      "total_count": 300,
      "ratio": 0.6923,
      "smoothed_ratio": 0.7015,
      "up_smoothed": 160.0,
      "down_smoothed":  90.0,
      "signal": "Bullish"
    },
    {
      "date": "2018-01-04T00:00:00",
      "up_count": 220,
      "down_count":  60,
      "unchanged_count": 20,
      "total_count": 300,
      "ratio": 0.7857,
      "smoothed_ratio": 0.7502,
      "up_smoothed": 200.4,
      "down_smoothed":  75.6,
      "signal": "Bullish"
    }
    /* …more daily entries… */
  ],
  "summary": {
    "total_trading_days": 1460,
    "averages": {
      "up_count": 145.5,
      "down_count": 95.2,
      "unchanged_count": 59.3,
      "total_count": 300.0,
      "ratio": 0.6040
    },
    "extremes": {
      "max_up_count": 280,
      "max_down_count": 250,
      "max_unchanged_count": 120,
      "min_ratio": 0.1500,
      "max_ratio": 0.8500
    },
    "most_bullish_day": {
      "date": "2020-03-24T00:00:00",
      "up_count": 280,
      "down_count": 20,
      "unchanged_count": 0,
      "ratio": 0.9333
    },
    "most_bearish_day": {
      "date": "2020-03-16T00:00:00",
      "up_count": 20,
      "down_count": 250,
      "unchanged_count": 30,
      "ratio": 0.0741
    }
  }
}

5. Abnormal Market Signals
Script to detect abnormal market signals and performance rankings across tradable stocks.

abnormal_signals.json Output JSON structure:
{
  "abnormalities": [
    {
      "Symbol": "<ticker>",
      "Date": "YYYY-MM-DDTHH:MM:SS",    # timestamp of the abnormal bar
      "WideSpread": true|false,
      "NarrowSpread": true|false,
      "HighVolume": true|false,
      "LowVolume": true|false,
      "EffortGTResult": true|false,
      "ResultGTEffort": true|false,
      "AbnormalERRatio": true|false
    },
    ...
  ],
  "industry_abnormalities": [
    {
      "Symbol": "<industry_custom_id>",
      "Name": "<industry_name>",
      "Date": "YYYY-MM-DDTHH:MM:SS",
      "WideSpread": true|false,
      "NarrowSpread": true|false,
      "HighVolume": true|false,
      "LowVolume": true|false,
      "EffortGTResult": true|false,
      "ResultGTEffort": true|false,
      "AbnormalERRatio": true|false
    },
    ...
  ],
  "performance": {
    "top_gainers": [ {"Symbol": ..., "Return": ..., "Improvement": ...}, ... ],
    "top_losers":  [ {"Symbol": ..., "Return": ..., "Improvement": ...}, ... ],
    "top_improving": [ {"Symbol": ..., "Return": ..., "Improvement": ...}, ... ],
    "top_degrading": [ {"Symbol": ..., "Return": ..., "Improvement": ...}, ... ]
  },
  "industry_performance": {
    "top_gainers": [ {"Symbol": ..., "Name": ..., "Return": ..., "Improvement": ...}, ... ],
    "top_losers":  [ {"Symbol": ..., "Name": ..., "Return": ..., "Improvement": ...}, ... ],
    "top_improving": [ {"Symbol": ..., "Name": ..., "Return": ..., "Improvement": ...}, ... ],
    "top_degrading": [ {"Symbol": ..., "Name": ..., "Return": ..., "Improvement": ...}, ... ]
  },
  "immediate": {
    "top_immediate_gainers": [ {"Symbol": ..., "ImmediateReturn": ...}, ... ],
    "top_immediate_losers":  [ {"Symbol": ..., "ImmediateReturn": ...}, ... ]
  },
  "industry_immediate": {
    "top_immediate_gainers": [ {"Symbol": ..., "Name": ..., "ImmediateReturn": ...}, ... ],
    "top_immediate_losers":  [ {"Symbol": ..., "Name": ..., "ImmediateReturn": ...}, ... ]
  }
}

6. Relative Strength (RS) and Cumulative Relative Strength (CRS) Analysis

This script analyzes the relative strength of industries and individual symbols compared to the VNINDEX benchmark.

Key Metrics:
- RS (Relative Strength): Current price ratio between industry/symbol and VNINDEX
- CRS (Cumulative Relative Strength): 21-day cumulative performance comparison
- Moving Averages: 13-day and 49-day moving averages of RS for trend analysis

Output:
- PDF report with charts showing RS, CRS, and volume for each industry and symbol (optional)
- JSON file with numerical results for further analysis

analyze_rs Output JSON structure:
{
  "analysis_date": "ISO timestamp",
  "benchmark": "VNINDEX",
  "lookback_period": 21,
  "industries": [
    {
      "custom_id": "industry_code",
      "name": "industry_name",
      "latest_date": "YYYY-MM-DD",
      "data_points": 450,
      "metrics": {
        "current_rs": 1.0234,           # Current RS value
        "current_crs": 0.0456,          # Current CRS value
        "current_ma13": 1.0189,         # 13-day moving average
        "current_ma49": 1.0123,         # 49-day moving average
        "rs_21d_change": 0.0234,        # 21-day change in RS
        "crs_21d_avg": 0.0345,          # Average CRS over 21 days
        "rs_volatility": 0.0234,        # Standard deviation of RS
        "crs_volatility": 0.0456,       # Standard deviation of CRS
        "outperforming_days": 280,      # Days with positive CRS
        "underperforming_days": 170,    # Days with negative CRS
        "total_days": 450               # Total analyzed days
      },
      "performance_summary": {
        "rs_trend": "bullish|bearish|neutral",
        "crs_status": "outperforming|underperforming",
        "strength_score": 4.56          # CRS as percentage
      }
    }
  ],
  "symbols": [
    {
      "symbol": "VNM",
      "name": "Vietnam Dairy Products JSC",
      "industries": [
        {
          "custom_id": "thuc-pham",
          "name": "Thực phẩm",
          "is_primary": true,
          "priority": 1
        },
        {
          "custom_id": "tradable",
          "name": "Tradable",
          "is_primary": false,
          "priority": 99
        }
      ],
      "latest_date": "YYYY-MM-DD",
      "data_points": 450,
      "metrics": {
        "current_rs": 1.0234,
        "current_crs": 0.0456,
        "current_ma13": 1.0189,
        "current_ma49": 1.0123,
        "rs_21d_change": 0.0234,
        "crs_21d_avg": 0.0345,
        "rs_volatility": 0.0234,
        "crs_volatility": 0.0456,
        "outperforming_days": 280,
        "underperforming_days": 170,
        "total_days": 450
      },
      "performance_summary": {
        "rs_trend": "bullish|bearish|neutral",
        "crs_status": "outperforming|underperforming",
        "strength_score": 4.56
      }
    }
  ]
}

RRG Data Structure (rrg_data.json):
{
  "rrg_date": "ISO timestamp",
  "tail_length": 21,
  "series": [
    {
      "id": "industry_code",
      "name": "Industry Name",
      "type": "industry",
      "tail": [
        {
          "date": "YYYY-MM-DD",
          "x": 102.34,                  # RS-Ratio for RRG X-axis (normalized around 100)
          "y": 104.56                   # RS-Momentum for RRG Y-axis (normalized around 100)
        }
      ]
    },
    {
      "id": "symbol",
      "name": "Symbol Name",
      "type": "symbol",
      "industry": "industry_code",      # Primary industry custom_id for filtering
      "tail": [
        {
          "date": "YYYY-MM-DD",
          "x": 102.34,                  # RS-Ratio for RRG X-axis (normalized around 100)
          "y": 104.56                   # RS-Momentum for RRG Y-axis (normalized around 100)
        }
      ]
    }
  ]
}