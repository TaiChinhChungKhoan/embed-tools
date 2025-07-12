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

analyze_breadth.json Output Structure:
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

analyze_breadth_4.json Output Structure:
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
  "analysis_date": "2025-01-15T10:30:00",
  "timeframe": "1D",
  "benchmark": "VNINDEX",
  "lookback_period": 21,
  "industries": 15,
  "groups": 5,
  "symbols": 500,
  
  "insights": {
    "market_overview": {
      "title": "Tổng quan thị trường (Macro)",
      "analysis_date": "2025-01-15T10:30:00",
      "timeframe": "1D",
      "benchmark": "VNINDEX",
      "market_indices": {
        "general_market": "VNINDEX",
        "large_cap": "VN30", 
        "mid_cap": "VNMID",
        "small_cap": "VNSML"
      },
      "key_metrics": {
        "total_industries": 15,
        "outperforming_industries": 10,
        "underperforming_industries": 5,
        "industry_sentiment_ratio": 0.67,
        "total_symbols": 500,
        "outperforming_symbols": 320,
        "underperforming_symbols": 180,
        "symbol_sentiment_ratio": 0.64,
        "total_groups": 5,
        "outperforming_groups": 3,
        "underperforming_groups": 2,
        "group_sentiment_ratio": 0.60
      },
      "market_regime": {
        "regime": "Bull Market Vừa",
        "confidence": 75,
        "risk_score": 0.25,
        "breadth": "Strong",
        "momentum": "Leading",
        "volatility": "Low"
      },
      "market_health": {
        "overall_health": "Good",
        "breadth_health": "Strong",
        "momentum_health": "Strong",
        "volatility_health": "Stable",
        "sentiment": "Bullish"
      },
      "strategic_recommendation": {
        "stance": "Tích cực",
        "confidence": 75,
        "rationale": "RRG cho thấy 67% ngành đang trong xu hướng tích cực"
      }
    },
    
    "insights": {
    "title": "Phân tích chuẩn hóa (Standardized Analysis)",
    "industries": {
      "title": "Phân tích industry",
      "summary": {
        "total_count": 15,
        "top_performers_count": 5,
        "bottom_performers_count": 5,
        "improving_momentum_count": 8,
        "degrading_momentum_count": 3,
        "accumulation_count": 4,
        "distribution_count": 2,
        "breakout_count": 3,
        "consolidation_count": 1,
        "stealth_accumulation_count": 2,
        "stealth_distribution_count": 1,
        "institutional_activity_count": 6,
        "high_volatility_count": 3,
        "deteriorating_fundamentals_count": 1,
        "falling_knife_count": 0
      },
      "top_performers": [
        {
          "custom_id": "VN30",
          "name": "VN30 - Large Cap",
          "strength_score": 4.56,
          "description": "Mạnh mẽ, xu hướng tăng"
        }
      ],
      "bottom_performers": [
        {
          "custom_id": "VNSML",
          "name": "VNSmallCap - Small Cap",
          "strength_score": -2.34,
          "description": "Yếu, xu hướng giảm"
        }
      ],
      "improving_momentum": [...],
      "degrading_momentum": [...],
      "accumulation_candidates": [...],
      "distribution_candidates": [...],
      "breakout_candidates": [...],
      "consolidation_candidates": [...],
      "stealth_accumulation": [...],
      "stealth_distribution": [...],
      "institutional_activity": [...],
      "high_volatility": [...],
      "deteriorating_fundamentals": [...],
      "falling_knife": [...],
      "rrg_performers": {
        "leading_quadrant": [...],
        "lagging_quadrant": [...],
        "improving_quadrant": [...],
        "weakening_quadrant": [...]
      }
    },
    "groups": {
      "title": "Phân tích group",
      "summary": {
        "total_count": 5,
        "top_performers_count": 2,
        "bottom_performers_count": 2,
        "improving_momentum_count": 3,
        "degrading_momentum_count": 1,
        "accumulation_count": 1,
        "distribution_count": 0,
        "breakout_count": 1,
        "consolidation_count": 0,
        "stealth_accumulation_count": 0,
        "stealth_distribution_count": 0,
        "institutional_activity_count": 2,
        "high_volatility_count": 1,
        "deteriorating_fundamentals_count": 0,
        "falling_knife_count": 0
      },
      "top_performers": [...],
      "bottom_performers": [...],
      "improving_momentum": [...],
      "degrading_momentum": [...],
      "accumulation_candidates": [...],
      "distribution_candidates": [...],
      "breakout_candidates": [...],
      "consolidation_candidates": [...],
      "stealth_accumulation": [...],
      "stealth_distribution": [...],
      "institutional_activity": [...],
      "high_volatility": [...],
      "deteriorating_fundamentals": [...],
      "falling_knife": [...],
      "rrg_performers": {
        "leading_quadrant": [...],
        "lagging_quadrant": [...],
        "improving_quadrant": [...],
        "weakening_quadrant": [...]
      }
    },
    "tickers": {
      "title": "Phân tích ticker",
      "summary": {
        "total_count": 500,
        "top_performers_count": 50,
        "bottom_performers_count": 50,
        "improving_momentum_count": 200,
        "degrading_momentum_count": 80,
        "accumulation_count": 120,
        "distribution_count": 40,
        "breakout_count": 60,
        "consolidation_count": 20,
        "stealth_accumulation_count": 30,
        "stealth_distribution_count": 10,
        "institutional_activity_count": 100,
        "high_volatility_count": 80,
        "deteriorating_fundamentals_count": 25,
        "falling_knife_count": 15
      },
      "top_performers": [
        {
          "symbol": "VNM",
          "strength_score": 8.45,
          "description": "Mạnh mẽ, xu hướng tăng"
        }
      ],
      "bottom_performers": [
        {
          "symbol": "HPG",
          "strength_score": -5.67,
          "description": "Yếu, xu hướng giảm"
        }
      ],
      "improving_momentum": [...],
      "degrading_momentum": [...],
      "accumulation_candidates": [...],
      "distribution_candidates": [...],
      "breakout_candidates": [...],
      "consolidation_candidates": [...],
      "stealth_accumulation": [...],
      "stealth_distribution": [...],
      "institutional_activity": [...],
      "high_volatility": [...],
      "deteriorating_fundamentals": [...],
      "falling_knife": [...],
      "rrg_performers": {
        "leading_quadrant": [...],
        "lagging_quadrant": [...],
        "improving_quadrant": [...],
        "weakening_quadrant": [...]
      }
    }
  },
  
  "detailed_analysis": {
    "title": "Phân tích chi tiết (Detailed Analysis)",
    "sector_rotation": {
      "rotation_theme": "Growth to Value",
      "rotation_strength": "Moderate",
      "top_rotating_sectors": ["Banking", "Real Estate", "Technology"]
    },
    "market_cap_flow": {
      "title": "Phân tích nhóm vốn hóa thị trường",
      "flow_theme": "Dòng tiền tập trung vào nhóm vốn hóa lớn",
      "outperforming_count": 3,
      "underperforming_count": 2,
      "groups_summary": {
        "strongest_group": {
          "name": "VN30 - Large Cap",
          "strength_score": 4.56,
          "rrg_quadrant": "Leading (Dẫn dắt)",
          "money_flow": "Inflow"
        },
        "weakest_group": {
          "name": "VNSmallCap - Small Cap",
          "strength_score": -2.34,
          "rrg_quadrant": "Lagging (Tụt hậu)",
          "money_flow": "Outflow"
        },
        "outperforming_groups": [...],
        "underperforming_groups": [...]
      },
      "detailed_analysis": {...}
    },
    "momentum_cycles": {
      "current_cycle": "Acceleration",
      "cycle_strength": "Strong",
      "cycle_duration": "Medium-term"
    },
    "institutional_flow": {
      "flow_direction": "Inflow",
      "flow_strength": "Moderate",
      "preferred_segments": ["Large Cap", "Quality Growth"]
    },
    "speed_distribution": {
      "fast_movers": 25,
      "moderate_movers": 45,
      "slow_movers": 30
    },
    "risk_distribution": {
      "low_risk": 60,
      "moderate_risk": 30,
      "high_risk": 10
    },
    "systemic_risks": {
      "overall_risk": "Low",
      "risk_factors": [],
      "risk_score": 0.15
    },
    "breadth_detail": {
      "advance_decline_ratio": 1.8,
      "new_highs": 45,
      "new_lows": 8
    },
    "volatility_regime": {
      "regime": "Low Volatility",
      "volatility_score": 0.25,
      "stability": "High"
    }
  },
  
  "investment_strategies": {
    "title": "Chiến lược đầu tư đề xuất",
    "macro_strategy": {
      "market_phase_analysis": [
        "Thị trường bull mạnh mẽ - ưu tiên vị thế long"
      ],
      "overall_positioning": [
        "Tín hiệu rõ ràng (85% confidence) - có thể tăng tỷ trọng"
      ],
      "risk_management": [
        "Rủi ro thấp - có thể nới lỏng quản lý rủi ro"
      ]
    },
    "sector_strategy": {
      "sector_rotation_signals": [
        "Ưu tiên: Tập trung vào các ngành đang dẫn dắt như Ngân hàng, Bất động sản"
      ],
      "sector_allocation": [
        "Tăng tỷ trọng: 5 ngành có tiềm năng tích lũy"
      ],
      "sector_risk_warnings": [
        "Thận trọng: 1 ngành có dấu hiệu 'dao rơi'"
      ]
    },
    "group_strategy": {
      "group_rotation_signals": [
        "Ưu tiên: Tập trung vào nhóm VN30 - Large Cap"
      ],
      "group_allocation": [
        "Tăng tỷ trọng: 2 nhóm vốn hóa đang vượt trội"
      ],
      "group_risk_warnings": [
        "Không có cảnh báo rủi ro lớn ở cấp độ nhóm"
      ]
    },
    "stock_strategy": {
      "momentum_strategy": [
        "Bứt phá: 8 cổ phiếu có thể bứt phá"
      ],
      "accumulation_strategy": [
        "Cơ hội tích lũy: 12 cổ phiếu có tiềm năng"
      ],
      "risk_avoidance": [
        "Tránh rủi ro: 8 cổ phiếu có dấu hiệu rủi ro cao"
      ],
      "position_sizing": [
        "Duy trì kích thước vị thế chuẩn"
      ]
    }
  },
  
  "industries": [
    {
      "custom_id": "VN30",
      "name": "VN30 - Large Cap",
      "latest_date": "2025-01-15",
      "data_points": 500,
      
      "metrics": {
        "current_rs": 1.0234,
        "current_crs": 0.0456,
        "current_ma13": 1.0189,
        "current_ma49": 1.0123,
        "rs_5d_change": 0.0123,
        "rs_21d_change": 0.0345,
        "rs_49d_change": 0.0567,
        "crs_21d_avg": 0.0234,
        "rs_volatility": 0.0234,
        "crs_volatility": 0.0456,
        "outperforming_days": 320,
        "underperforming_days": 180,
        "total_days": 500,
        "outperforming_periods": 320,
        "underperforming_periods": 180,
        "total_periods": 500
      },
      
      "performance_summary": {
        "rs_trend": "bullish",
        "crs_status": "outperforming",
        "strength_score": 4.56
      },
      
      "speed_analysis": {
        "raw_speed_5d": 0.00246,
        "raw_speed_21d": 0.00164,
        "raw_speed_49d": 0.00116,
        "weighted_speed": 0.00189,
        "consistency_score": 0.0808,
        "short_term_momentum": 0.00082,
        "long_term_momentum": 0.00048,
        "momentum_ratio": 1.5,
        "speed_category": "Vừa phải (Tăng tốc)"
      },
      
      "direction_analysis": {
        "direction": "Improving",
        "direction_quality": {
          "confirmed": true,
          "strength": 1.47,
          "sustainability": 0.64
        },
        "trend_strength": "Strong",
        "momentum_confirmed": true,
        "signal_to_noise_ratio": 1.47
      },
      
      "risk_assessment": {
        "risk_level": "Low",
        "risk_score": 0.23,
        "risk_factors": [
          "Low volatility",
          "Stable momentum"
        ],
        "warnings": [],
        "volume_analysis": {
          "volume_trend": "Increasing",
          "volume_quality": "Good",
          "volume_consistency": 0.78
        }
      }
    }
  ],
  
  "groups": [
    {
      "custom_id": "VN30",
      "name": "VN30 - Large Cap",
      "latest_date": "2025-01-15",
      "data_points": 500,
      
      "metrics": {
        "current_rs": 1.0234,
        "current_crs": 0.0456,
        "current_ma13": 1.0189,
        "current_ma49": 1.0123,
        "rs_5d_change": 0.0123,
        "rs_21d_change": 0.0345,
        "rs_49d_change": 0.0567,
        "crs_21d_avg": 0.0234,
        "rs_volatility": 0.0234,
        "crs_volatility": 0.0456,
        "outperforming_days": 320,
        "underperforming_days": 180,
        "total_days": 500,
        "outperforming_periods": 320,
        "underperforming_periods": 180,
        "total_periods": 500
      },
      
      "performance_summary": {
        "rs_trend": "bullish",
        "crs_status": "outperforming",
        "strength_score": 4.56
      },
      
      "speed_analysis": {
        "raw_speed_5d": 0.00246,
        "raw_speed_21d": 0.00164,
        "raw_speed_49d": 0.00116,
        "weighted_speed": 0.00189,
        "consistency_score": 0.0808,
        "short_term_momentum": 0.00082,
        "long_term_momentum": 0.00048,
        "momentum_ratio": 1.5,
        "speed_category": "Vừa phải (Tăng tốc)"
      },
      
      "direction_analysis": {
        "direction": "Improving",
        "direction_quality": {
          "confirmed": true,
          "strength": 1.47,
          "sustainability": 0.64
        },
        "trend_strength": "Strong",
        "momentum_confirmed": true,
        "signal_to_noise_ratio": 1.47
      },
      
      "risk_assessment": {
        "risk_level": "Low",
        "risk_score": 0.23,
        "risk_factors": [
          "Low volatility",
          "Stable momentum"
        ],
        "warnings": [],
        "volume_analysis": {
          "volume_trend": "Increasing",
          "volume_quality": "Good",
          "volume_consistency": 0.78
        }
      }
    }
  ],
  
  "symbols": [
    {
      "symbol": "VNM",
      "name": "VNM",
      "industries": [
        {
          "custom_id": "VN30",
          "name": "VN30 - Large Cap",
          "is_primary": true,
          "priority": 1
        }
      ],
      "latest_date": "2025-01-15",
      "data_points": 500,
      
      "metrics": {
        "current_rs": 1.0234,
        "current_crs": 0.0456,
        "current_ma13": 1.0189,
        "current_ma49": 1.0123,
        "rs_5d_change": 0.0123,
        "rs_21d_change": 0.0345,
        "rs_49d_change": 0.0567,
        "crs_21d_avg": 0.0234,
        "rs_volatility": 0.0234,
        "crs_volatility": 0.0456,
        "outperforming_days": 320,
        "underperforming_days": 180,
        "total_days": 500,
        "outperforming_periods": 320,
        "underperforming_periods": 180,
        "total_periods": 500
      },
      
      "performance_summary": {
        "rs_trend": "bullish",
        "crs_status": "outperforming",
        "strength_score": 4.56
      },
      
      "speed_analysis": {
        "raw_speed_5d": 0.00246,
        "raw_speed_21d": 0.00164,
        "raw_speed_49d": 0.00116,
        "weighted_speed": 0.00189,
        "consistency_score": 0.0808,
        "short_term_momentum": 0.00082,
        "long_term_momentum": 0.00048,
        "momentum_ratio": 1.5,
        "speed_category": "Vừa phải (Tăng tốc)"
      },
      
      "direction_analysis": {
        "direction": "Improving",
        "direction_quality": {
          "confirmed": true,
          "strength": 1.47,
          "sustainability": 0.64
        },
        "trend_strength": "Strong",
        "momentum_confirmed": true,
        "signal_to_noise_ratio": 1.47
      },
      
      "risk_assessment": {
        "risk_level": "Low",
        "risk_score": 0.23,
        "risk_factors": [
          "Low volatility",
          "Stable momentum"
        ],
        "warnings": [],
        "volume_analysis": {
          "volume_trend": "Increasing",
          "volume_quality": "Good",
          "volume_consistency": 0.78
        }
      }
    }
  ]
}

```

### Signal Categories Explained

#### Performance Categories (Absolute)
- **`top_performers`**: Highest absolute strength scores
- **`bottom_performers`**: Lowest absolute strength scores

#### Momentum Categories (Direction-based)
- **`improving_momentum`**: Positive momentum (accelerating, improving direction)
- **`degrading_momentum`**: Negative momentum (decelerating, degrading direction)

#### Pattern Categories (Momentum-based)
- **`accumulation_candidates`**: Low speed + improving direction + positive acceleration
- **`distribution_candidates`**: Low speed + degrading direction + negative acceleration
- **`breakout_candidates`**: Strong positive acceleration + direction change
- **`consolidation_candidates`**: Strong negative acceleration + direction change
- **`stealth_accumulation`**: Very low speed + improving direction + positive acceleration
- **`stealth_distribution`**: Very low speed + degrading direction + positive acceleration
- **`institutional_activity`**: High speed + institutional volume patterns

#### Risk Categories (Risk-based)
- **`high_volatility`**: High volatility warning
- **`deteriorating_fundamentals`**: Fundamental deterioration
- **`falling_knife`**: Dangerous momentum pattern

#### RRG Quadrant Categories (RRG-based)
- **`leading_quadrant`**: Top performers in Leading quadrant (high RS, high momentum)
- **`lagging_quadrant`**: Bottom performers in Lagging quadrant (low RS, low momentum)
- **`improving_quadrant`**: Top performers in Improving quadrant (low RS, high momentum)
- **`weakening_quadrant`**: Top performers in Weakening quadrant (high RS, low momentum)

7. RRG Data Structure (rrg_data.json):
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

8. INTRADAY SIGNAL INTERPRETATION GUIDE:

1. ABNORMAL PRICE SIGNAL:
   - Definition: Price movements significantly deviate from normal intraday patterns
   - Interpretation: 
     * BULLISH: Abnormal price spikes with volume confirmation suggest strong buying
     * BEARISH: Abnormal price drops with volume confirmation suggest strong selling
     * NEUTRAL: Abnormal price movements without clear direction suggest volatility
   - Trading Action: Monitor for continuation or reversal patterns

2. ABNORMAL VOLUME SIGNAL:
   - Definition: Trading volume significantly differs from normal intraday levels
   - Interpretation:
     * BULLISH: High volume with price up suggests strong buying interest
     * BEARISH: High volume with price down suggests strong selling pressure
     * NEUTRAL: High volume with sideways price suggests distribution/accumulation
   - Trading Action: Volume confirms price direction; follow the trend

3. PRICE VELOCITY ABNORMAL SIGNAL:
   - Definition: Rate of price change is significantly faster than normal
   - Interpretation:
     * BULLISH: Rapid price increases suggest momentum buying
     * BEARISH: Rapid price decreases suggest panic selling
   - Trading Action: Monitor for exhaustion or continuation

4. EFFORTGTResult SIGNAL:
   - Definition: High volume with controlled price movement (high effort, low result)
   - Interpretation:
     * BULLISH: Strong buying effort with controlled price suggests accumulation
     * BEARISH: Strong selling effort with controlled price suggests distribution
   - Trading Action: Often precedes significant moves; monitor for breakout

5. RESULTGTEffort SIGNAL:
   - Definition: Low volume with large price movement (low effort, high result)
   - Interpretation:
     * BULLISH: Large price move with low volume suggests weak hands selling to strong hands
     * BEARISH: Large price move with low volume suggests short covering or weak buying
   - Trading Action: May indicate exhaustion; be cautious of continuation

6. ABNORMALERRatio SIGNAL:
   - Definition: Volume-to-excess-return ratio is significantly different from normal
   - Interpretation:
     * HIGH RATIO: High volume relative to price movement suggests strong conviction
     * LOW RATIO: Low volume relative to price movement suggests weak conviction
   - Trading Action: Use as confirmation of trend strength or weakness

COMBINED SIGNAL INTERPRETATION:
- MULTIPLE BULLISH SIGNALS: Strong buy signal, high probability of upward movement
- MULTIPLE BEARISH SIGNALS: Strong sell signal, high probability of downward movement
- MIXED SIGNALS: Market indecision, wait for clearer direction
- NO SIGNALS: Normal market conditions, continue with existing strategy

abnormal_signals_intra.json Output JSON Structure:
{
    "abnormalities": [
        {
            "Symbol": "<ticker>",
            "Date": "YYYY-MM-DDTHH:MM:SS",
            "CompositeScore": 0.85,
            "AbnormalPrice": true,
            "AbnormalVolume": false,
            "PriceVelocityAbnormal": false,
            "EffortGTResult": true,
            "ResultGTEffort": false,
            "AbnormalERRatio": false,
            "Interpretation": {
                "signal_count": 2,
                "signal_types": ["AbnormalPrice", "EffortGTResult"],
                "overall_sentiment": "BULLISH",
                "confidence": "MEDIUM",
                "trading_implications": ["Monitor for breakout direction"],
                "risk_level": "MEDIUM"
            }
        }
    ],
    "summary": {
        "analysis_date": "YYYY-MM-DDTHH:MM:SS",
        "total_abnormalities": 45,
        "market_sentiment": "BULLISH",
        "key_insights": ["Detected 45 abnormal intraday signals"],
        "trading_recommendations": ["Consider increasing equity exposure"]
    }
}


7. Enhanced VSA Market Analysis Script

This script analyzes Vietnamese stock market data using VSA (Volume Spread Analysis)
to detect market patterns and generate comprehensive market overview reports.
Loops through all tradable companies to provide market-wide insights.

VSA SIGNAL INTERPRETATION GUIDE:

1. BULLISH SIGNALS:
   - High volume with price up: Strong buying interest
   - Low volume with price up: Lack of selling pressure
   - Effort > Result patterns: Accumulation phase
   - Spring patterns: Reversal from support

2. BEARISH SIGNALS:
   - High volume with price down: Strong selling pressure
   - Low volume with price down: Lack of buying support
   - Result > Effort patterns: Distribution phase
   - Upthrust patterns: Reversal from resistance

3. NEUTRAL SIGNALS:
   - Mixed volume/price patterns: Market indecision
   - Testing patterns: Consolidation phase
   - No clear directional bias: Wait for confirmation

TIME DECAY FEATURES:
- Analyzes last 10 days of data for comprehensive signal detection
- Applies time decay weighting: recent signals (0-2 days ago) get full weight
- Older signals (3-9 days ago) get progressively reduced weight (15% decay per day)
- Minimum weight of 10% ensures even old signals contribute to analysis
- Multiple signals over time receive bonus points for consistency

vsa_market_analysis.json Output JSON Structure:
{
    "market_overview": {
        "timestamp": "YYYY-MM-DDTHH:MM:SS",
        "timeframe": "1D",
        "total_stocks_analyzed": 500,
        "bullish_stocks": ["VNM", "FPT", ...],
        "bearish_stocks": ["HPG", "VIC", ...],
        "neutral_stocks": ["TCB", "MBB", ...],
        "strong_signals": [["VNM", "High Volume No Progress Up", "bullish"], ...],
        "market_sentiment": "bullish",
        "volume_analysis": {"increasing": 150, "decreasing": 100, "stable": 250},
        "sector_analysis": {...},
        "top_opportunities": [...],
        "market_breadth": {
            "bullish_percentage": 45.2,
            "bearish_percentage": 25.8,
            "neutral_percentage": 29.0,
            "strong_signals_count": 25,
            "average_score": 12.5
        }
    },
    "individual_results": [
        {
            "symbol": "VNM",
            "latest_analysis": {
                "timestamp": "YYYY-MM-DDTHH:MM:SS",
                "summary": "Primary signal: High Volume No Progress Up (bullish) in accumulation",
                "bullish_score": 25.5,
                "volume_significance": 85.0,
                "pattern_reliability": 75.0,
                "bar_type": "normal",
                "volume_level": "high",
                "spread_size": "normal",
                "close_position": "middle",
                "market_state": "accumulation",
                "at_supply_zone": false,
                "at_demand_zone": true,
                "signals": [
                    {
                        "signal_name": "High Volume No Progress Up",
                        "signal_type": "volume_pattern",
                        "bias": "bullish",
                        "strength": "strong",
                        "zone": "demand",
                        "pattern_bars": 3,
                        "description": "High volume with controlled price movement suggests accumulation",
                        "action_suggestion": "Monitor for breakout direction",
                        "confidence": 0.85
                    }
                ]
            },
            "recent_analyses": [
                {
                    "timestamp": "YYYY-MM-DDTHH:MM:SS",
                    "periods_ago": 0,
                    "time_decay_weight": 1.0,
                    "bullish_score": 25.5,
                    "volume_significance": 85.0,
                    "pattern_reliability": 75.0,
                    "summary": "Primary signal: High Volume No Progress Up (bullish) in accumulation",
                    "signals": [
                        {
                            "signal_name": "High Volume No Progress Up",
                            "signal_type": "volume_pattern",
                            "bias": "bullish",
                            "strength": "strong",
                            "zone": "demand",
                            "pattern_bars": 3,
                            "description": "High volume with controlled price movement suggests accumulation",
                            "action_suggestion": "Monitor for breakout direction",
                            "confidence": 0.85
                        }
                    ]
                },
                {
                    "timestamp": "YYYY-MM-DDTHH:MM:SS",
                    "periods_ago": 2,
                    "time_decay_weight": 0.7,
                    "bullish_score": 15.2,
                    "volume_significance": 65.0,
                    "pattern_reliability": 60.0,
                    "summary": "Secondary signal: Low Volume No Progress Down (neutral) in testing",
                    "signals": [
                        {
                            "signal_name": "Low Volume No Progress Down",
                            "signal_type": "volume_pattern",
                            "bias": "neutral",
                            "strength": "medium",
                            "zone": "demand",
                            "pattern_bars": 2,
                            "description": "Low volume with controlled price movement suggests testing",
                            "action_suggestion": "Wait for confirmation",
                            "confidence": 0.65
                        }
                    ]
                }
            ],
            "recent_analyses_count": 3,
            "total_signals_count": 5,
            "volume_trend": "increasing",
            "score": 0.85
        }
    ]
}

JSON FIELD DESCRIPTIONS:

Market Overview:
- timestamp: ISO format timestamp of analysis execution
- total_stocks_analyzed: Total number of stocks processed
- bullish_stocks: Array of stock symbols with bullish bias (>20 bullish score)
- bearish_stocks: Array of stock symbols with bearish bias (<-20 bullish score)
- neutral_stocks: Array of stock symbols with neutral bias (-20 to +20 bullish score)
- strong_signals: Array of [symbol, signal_name, bias] tuples for strong signals
- market_sentiment: Overall market sentiment ("bullish", "bearish", "neutral", "moderately_bullish", "moderately_bearish")
- volume_analysis: Count of stocks by volume trend ("increasing", "decreasing", "stable")
- sector_analysis: Sector-wise breakdown (currently empty, for future use)
- market_breadth: Market breadth statistics including percentages and averages

Individual Results:
- symbol: Stock ticker symbol
- latest_analysis: Most recent VSA analysis with full details
- recent_analyses: Array of all significant analyses from last 10 days with time decay info
- recent_analyses_count: Number of periods with significant signals
- total_signals_count: Total number of signals across all analyses
- volume_trend: Volume trend classification ("increasing", "decreasing", "stable")
- score: Composite score with time decay weighting and signal bonuses

Analysis Details:
- timestamp: ISO format timestamp of the analysis
- summary: Human-readable summary of the analysis
- bullish_score: VSA bullish score (-100 to +100)
- volume_significance: Volume significance percentage (0-100)
- pattern_reliability: Pattern reliability percentage (0-100)
- bar_type: Type of price bar ("normal", "wide", "narrow", etc.)
- volume_level: Volume level classification ("low", "normal", "high")
- spread_size: Price spread size ("narrow", "normal", "wide")
- close_position: Close position within bar ("low", "middle", "high")
- market_state: Market state ("accumulation", "distribution", "markup", "markdown")
- at_supply_zone: Whether price is at supply zone (boolean)
- at_demand_zone: Whether price is at demand zone (boolean)

Signal Details:
- signal_name: Name of the VSA signal pattern
- signal_type: Type of signal ("volume_pattern", "price_pattern", "effort_result")
- bias: Signal bias ("bullish", "bearish", "neutral")
- strength: Signal strength ("weak", "medium", "strong")
- zone: Associated zone ("supply", "demand", "none")
- pattern_bars: Number of bars in the pattern
- description: Human-readable description of the signal
- action_suggestion: Trading action suggestion
- confidence: Signal confidence (0.0-1.0)

8. EMA Breadth Analysis for VN-Index

This script analyzes the breadth of stocks above/below various Exponential Moving Averages (EMAs)
for the VN-Index market. The analysis helps identify market trends and momentum.

market_breadth_5.json Output JSON Structure:
{
  "metadata": {
    "analysis_info": {
      "title": "VN-Index EMA Breadth Analysis",
      "description": "Market breadth analysis using Exponential Moving Averages",
      "version": "2.0",
      "generated_at": "2024-01-01T10:00:00",
      "generated_by": "EMA Breadth Analyzer"
    },
    "date_range": {
      "start_date": "2024-01-01",
      "end_date": "2024-12-31",
      "total_trading_days": 252,
      "analysis_period": "1 year"
    },
    "parameters": {
      "ema_periods": [5, 10, 20, 50, 200],
      "min_volume_threshold": 1000000,
      "volume_lookback_days": 20,
      "data_source": "VN-Index Market Data"
    },
    "data_quality": {
      "total_symbols_available": 500,
      "symbols_with_sufficient_data": 450,
      "data_coverage_percentage": 90.0,
      "analysis_quality": "High"
    }
  },
  "breadth_data": {
    "2024-01-01": {
      "date": "2024-01-01",
      "summary": {
        "total_stocks": 500,
        "stocks_with_data": 450,
        "data_coverage": 90.0
      },
      "ema_5": {
        "above_count": 280,
        "below_count": 170,
        "above_percentage": 62.2,
        "below_percentage": 37.8,
        "strength": "Strong",
        "sentiment": "Bullish"
      },
      "ema_10": {
        "above_count": 265,
        "below_count": 185,
        "above_percentage": 58.9,
        "below_percentage": 41.1,
        "strength": "Moderate",
        "sentiment": "Bullish"
      },
      "ema_20": {
        "above_count": 250,
        "below_count": 200,
        "above_percentage": 55.6,
        "below_percentage": 44.4,
        "strength": "Moderate",
        "sentiment": "Neutral"
      },
      "ema_50": {
        "above_count": 240,
        "below_count": 210,
        "above_percentage": 53.3,
        "below_percentage": 46.7,
        "strength": "Weak",
        "sentiment": "Neutral"
      },
      "ema_200": {
        "above_count": 220,
        "below_count": 230,
        "above_percentage": 48.9,
        "below_percentage": 51.1,
        "strength": "Weak",
        "sentiment": "Bearish"
      },
      "market_regime": {
        "classification": "Transition",
        "confidence": 0.75,
        "description": "Market showing mixed signals across timeframes"
      },
      "breadth_momentum": {
        "ema_20_change_5d": 2.5,
        "ema_50_change_5d": -1.2,
        "ema_200_change_5d": 0.8,
        "overall_momentum": "Mixed"
      }
    }
  },
  "analysis_summary": {
    "current_market_state": {
      "regime": "Bull Market",
      "strength": "Strong",
      "confidence": 0.85,
      "trend_direction": "Upward"
    },
    "key_metrics": {
      "breadth_strength": 65.2,
      "participation_level": 90.0,
      "trend_consistency": "High"
    },
    "risk_assessment": {
      "overall_risk": "Low",
      "risk_factors": ["Low volatility", "Strong breadth"],
      "risk_level": "Green"
    }
  },
  "vietnamese_insights": {
    "report_metadata": { ... },
    "executive_summary": { ... },
    "market_overview": { ... },
    "technical_analysis": { ... },
    "market_structure": { ... },
    "money_flow_analysis": { ... },
    "risk_analysis": { ... },
    "trading_strategy": { ... },
    "market_sentiment": { ... },
    "forecast_outlook": { ... }
  }
}

EMA Periods: 5, 10, 20, 50, 200 days

9. Money Flow Index (MFI) Analysis for Market Indices

This script calculates the Money Flow Index (MFI) for Vietnamese market indices:
- VN30 (Large Cap)
- VN100 (Large-Mid Cap) 
- VNAllShare (All Shares)
- VNMidCap (Mid Cap)
- VNSmall (Small Cap)

The MFI is a volume-weighted RSI that combines price and volume data to identify
overbought and oversold conditions. It ranges from 0 to 100, where:
- Above 80: Overbought (potential sell signal)
- Below 20: Oversold (potential buy signal)
- 20-80: Neutral zone

Output:
- JSON file with comprehensive MFI analysis for each index
- Historical MFI values and signals
- Statistical analysis and insights

JSON Structure:
{
    "analysis_date": "2024-01-15T10:30:00",
    "period": 3,
    "period_unit": "years",
    "mfi_period": 14,
    "overbought_threshold": 80.0,
    "oversold_threshold": 20.0,
    "indices": [
        {
            "symbol": "VN30",
            "name": "VN30 - Large Cap",
            "data_points": 750,
            "latest_date": "2024-01-15",
            "mfi_data": [
                {
                    "date": "2024-01-15",
                    "mfi": 65.23,
                    "signal": "neutral",
                    "price": 1250.50,
                    "volume": 1500000,
                    "typical_price": 1248.75,
                    "raw_money_flow": 1873125000,
                    "positive_money_flow": 1873125000,
                    "negative_money_flow": 0
                }
            ],
            "statistics": {
                "current_mfi": 65.23,
                "mfi_5d_avg": 62.15,
                "mfi_21d_avg": 58.90,
                "mfi_50d_avg": 55.20,
                "mfi_min": 25.10,
                "mfi_max": 85.30,
                "mfi_std": 12.45,
                "MFI_ROC": 3.08,
                "MFI_ROC_5d_avg": 2.15,
                "MFI_Acceleration": 0.45,
                "MFI_Acceleration_5d_avg": 0.32,
                "overbought_days": 45,
                "oversold_days": 23,
                "neutral_days": 682,
                "total_days": 750
            },
            "signals": {
                "current_signal": "neutral",
                "signal_strength": "moderate",
                "signal_confidence": 0.75,
                "trend_direction": "bullish",
                "momentum": "increasing"
            },
            "analysis": {
                "market_condition": "neutral",
                "volume_analysis": "normal",
                "price_momentum": "weak",
                "risk_level": "medium",
                "recommendation": "hold"
            }
        }
    ],
    "market_overview": {
        "overall_sentiment": "bullish",
        "index_performance": {
            "best_performer": "VNSML",
            "worst_performer": "VN30",
            "most_volatile": "VNSML",
            "least_volatile": "VN30"
        },
        "money_flow_distribution": {
            "overbought_indices": 1,
            "oversold_indices": 0,
            "neutral_indices": 4
        },
        "mfi_spread": 8.45,
        "correlation_matrix": {
            "VN30": {"VN30": 1.0, "VN100": 0.95, "VNALL": 0.92, "VNMID": 0.88, "VNSML": 0.82},
            "VN100": {"VN30": 0.95, "VN100": 1.0, "VNALL": 0.98, "VNMID": 0.94, "VNSML": 0.87},
            "VNALL": {"VN30": 0.92, "VN100": 0.98, "VNALL": 1.0, "VNMID": 0.96, "VNSML": 0.89},
            "VNMID": {"VN30": 0.88, "VN100": 0.94, "VNALL": 0.96, "VNMID": 1.0, "VNSML": 0.93},
            "VNSML": {"VN30": 0.82, "VN100": 0.87, "VNALL": 0.89, "VNMID": 0.93, "VNSML": 1.0}
        }
    },
    "vietnamese_insights": {
        "metadata": {
            "analysis_timestamp": "2024-01-15T10:30:00",
            "data_quality": {
                "quality": "Tốt",
                "average_data_points": 750,
                "issues": ["Chất lượng dữ liệu tốt."]
            },
            "analysis_period": "3 năm",
            "mfi_period": "14 ngày"
        },
        "signal_coordination": {
            "overall_signal": {
                "direction": "Tích cực",
                "strength": "Mạnh",
                "confidence": 0.82,
                "consensus_score": 0.75
            },
            "component_signals": [
                {
                    "name": "Mức MFI Hiện tại",
                    "direction": "Tích cực",
                    "strength": "Vừa phải",
                    "value": 62.15,
                    "weight": 0.20,
                    "description": "MFI trung bình của thị trường là 62.2."
                },
                {
                    "name": "Động lượng (ROC)",
                    "direction": "Tích cực",
                    "strength": "Mạnh",
                    "value": 2.85,
                    "weight": 0.20,
                    "description": "Tốc độ thay đổi MFI trung bình (5 ngày): 2.85."
                },
                {
                    "name": "Gia tốc Dòng tiền",
                    "direction": "Tích cực",
                    "strength": "Vừa phải",
                    "value": 0.38,
                    "weight": 0.15,
                    "description": "Gia tốc MFI: 0.38. Cho thấy động lượng đang mạnh lên hay yếu đi."
                },
                {
                    "name": "Cấu trúc Thị trường (Spread)",
                    "direction": "Tích cực",
                    "strength": "Mạnh",
                    "value": 8.45,
                    "weight": 0.25,
                    "description": "Chênh lệch MFI Small-cap vs Large-cap: 8.45. Dương cho thấy tâm lý ưa thích rủi ro (risk-on)."
                },
                {
                    "name": "Mức độ Cực đoan",
                    "direction": "Trung lập",
                    "strength": "Yếu",
                    "value": 0.12,
                    "weight": 0.10,
                    "description": "Điểm cực đoan tổng hợp: 0.12. Dương = quá mua, Âm = quá bán."
                },
                {
                    "name": "Mức độ Tham gia",
                    "direction": "Tích cực",
                    "strength": "Mạnh",
                    "value": 100.0,
                    "weight": 0.10,
                    "description": "Tỷ lệ chỉ số có dữ liệu: 100%."
                }
            ],
            "conflicts_detected": []
        },
        "market_analysis": {
            "trading_recommendation": {
                "action": "Xem xét Mua/Tăng tỷ trọng thận trọng",
                "reasoning": "Tín hiệu tăng vừa phải, cần theo dõi thêm.",
                "confidence": 0.82
            },
            "risk_assessment": {
                "risk_level": "Trung bình",
                "consensus_score": 0.75,
                "recommendation": "Rủi ro trung bình. Giao dịch bình thường nhưng tuân thủ kỷ luật.",
                "risk_factors": ["Rủi ro thị trường ở mức bình thường."]
            },
            "market_outlook": {
                "short_term": {
                    "timeframe": "1-2 tuần",
                    "outlook": "Tích cực, có khả năng tăng điểm trong ngắn hạn.",
                    "confidence": 0.74
                },
                "medium_term": {
                    "timeframe": "1-3 tháng",
                    "outlook": "Triển vọng tích cực khi dòng tiền chấp nhận rủi ro.",
                    "confidence": 0.57
                }
            },
            "market_regime": {
                "regime": "Trung tính",
                "description": "Thị trường ở trạng thái cân bằng, dòng tiền ổn định.",
                "average_mfi": 62.15,
                "supporting_signals": "Tín hiệu phối hợp cho thấy xu hướng chung là tích cực."
            },
            "key_insights": [
                "Tín hiệu tổng thể: **Tích cực (Mạnh)** với độ tin cậy 82%.",
                "Cấu trúc thị trường **ủng hộ xu hướng tăng (Risk-on)**, dòng tiền đang ưu tiên nhóm vốn hóa nhỏ và vừa.",
                "Động lượng đang **mạnh lên**, củng cố cho xu hướng hiện tại."
            ]
        },
        "current_state": {
            "indices_summary": {
                "VN30": 58.90,
                "VN100": 60.15,
                "VNALL": 62.30,
                "VNMID": 64.75,
                "VNSML": 67.35
            },
            "mfi_spread_VNSML_vs_VN30": 8.45,
            "mfi_correlation": {
                "VN30": {"VN30": 1.0, "VN100": 0.95, "VNALL": 0.92, "VNMID": 0.88, "VNSML": 0.82},
                "VN100": {"VN30": 0.95, "VN100": 1.0, "VNALL": 0.98, "VNMID": 0.94, "VNSML": 0.87},
                "VNALL": {"VN30": 0.92, "VN100": 0.98, "VNALL": 1.0, "VNMID": 0.96, "VNSML": 0.89},
                "VNMID": {"VN30": 0.88, "VN100": 0.94, "VNALL": 0.96, "VNMID": 1.0, "VNSML": 0.93},
                "VNSML": {"VN30": 0.82, "VN100": 0.87, "VNALL": 0.89, "VNMID": 0.93, "VNSML": 1.0}
            }
        }
    }
}