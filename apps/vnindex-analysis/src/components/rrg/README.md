# RRG Chart Components

This folder contains the modular components for the Relative Rotation Graph (RRG) chart functionality.

## Structure

### Main Components

- **`RRGChart.jsx`** - Main chart component that orchestrates all sub-components
- **`index.js`** - Barrel export file for easy importing

### Sub-Components

#### Chart Elements
- **`CustomTooltip.jsx`** - Custom tooltip for chart points
- **`CustomDot.jsx`** - Custom dot component for trail points
- **`ZoomControls.jsx`** - Zoom in/out/reset controls
- **`RRGChartLegend.jsx`** - Chart legend and explanation text

#### Controls & Filters
- **`RRGChartControls.jsx`** - Chart controls (trail length, filters, etc.)
- **`IndustryMultiSelect.jsx`** - Multi-select dropdown for industry filtering

#### Information Panels
- **`DetailedInfoPanel.jsx`** - Main container for detailed information display
- **`IndustryInfoPanel.jsx`** - Detailed metrics panel for industries
- **`SymbolInfoPanel.jsx`** - Detailed metrics panel for individual symbols

#### Utilities
- **`utils.js`** - Helper functions and constants

## Usage

### Import the main component
```jsx
import RRGChart from '../components/rrg/RRGChart';
// or
import { RRGChart } from '../components/rrg';
```

### Import individual components
```jsx
import { 
  CustomTooltip, 
  ZoomControls, 
  DetailedInfoPanel 
} from '../components/rrg';
```

## Benefits of This Structure

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be used independently
3. **Maintainability**: Easier to locate and modify specific functionality
4. **Testability**: Individual components can be tested in isolation
5. **Readability**: Smaller, focused files are easier to understand

## Component Responsibilities

- **RRGChart**: Main orchestrator, data processing, chart rendering
- **CustomTooltip/CustomDot**: Chart interaction elements
- **ZoomControls**: Chart navigation
- **RRGChartControls**: User input and filtering
- **DetailedInfoPanel**: Data display coordination
- **IndustryInfoPanel/SymbolInfoPanel**: Specific data presentation
- **RRGChartLegend**: Chart explanation and legend
- **utils**: Shared helper functions 