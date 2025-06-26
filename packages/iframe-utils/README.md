# @embed-tools/iframe-utils

Shared utilities for iframe embedding and responsive resizing across all embed-tools applications.

## Installation

```bash
npm install @embed-tools/iframe-utils
```

## Quick Usage

### For Parent Pages

```html
<script src="node_modules/@embed-tools/iframe-utils/dist/iframe-resizer.js"></script>

<iframe 
  src="path/to/your-app/index.html"
  data-iframe-resize='{"minHeight": 400, "maxHeight": 2000}'
  frameborder="0">
</iframe>
```

### For Embedded Apps

```jsx
import { iframeUtils } from '@embed-tools/iframe-utils';

// Check if embedded
const isEmbedded = iframeUtils.isEmbedded();

// Send resize message
iframeUtils.sendResizeMessage(width, height);
```

## API Reference

### IframeResizer Class

```javascript
const resizer = new IframeResizer({
  minHeight: 400,
  maxHeight: 2000,
  minWidth: 300,
  maxWidth: 1200,
  resizeInterval: 100
});

resizer.init(iframe);
resizer.destroy(iframe);
resizer.destroyAll();
```

### iframeUtils Object

- `iframeUtils.isEmbedded()` - Check if current window is in an iframe
- `iframeUtils.sendResizeMessage(width, height)` - Send resize message to parent
- `iframeUtils.getParentIframe()` - Get the parent iframe element

## Build

```bash
npm run build    # Build all formats
npm run dev      # Development mode with watch
npm run clean    # Clean build directory
```

## Distribution Files

- `dist/index.js` - UMD build for browser usage
- `dist/index.esm.js` - ES module build  
- `dist/iframe-resizer.js` - Standalone iframe resizer script

For complete documentation and examples, see the main [README.md](../../README.md) at the root level. 