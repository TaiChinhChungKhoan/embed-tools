/**
 * Iframe Resizer Utility
 * Handles automatic resizing of iframes based on content dimensions
 */

class IframeResizer {
  constructor(options = {}) {
    this.options = {
      minHeight: options.minHeight || 400,
      maxHeight: options.maxHeight || 2000,
      minWidth: options.minWidth || 300,
      maxWidth: options.maxWidth || 1200,
      resizeInterval: options.resizeInterval || 100,
      ...options
    };
    
    this.iframes = new Map();
    this.resizeTimeout = null;
  }

  /**
   * Initialize iframe resizing for a specific iframe
   * @param {HTMLIFrameElement} iframe - The iframe element
   * @param {Object} options - Options for this specific iframe
   */
  init(iframe, options = {}) {
    const iframeOptions = { ...this.options, ...options };
    
    // Listen for resize messages from iframe
    const messageHandler = (event) => {
      if (event.source !== iframe.contentWindow) return;
      
      if (event.data && event.data.type === 'RESIZE') {
        this.resizeIframe(iframe, event.data.width, event.data.height, iframeOptions);
      }
    };

    window.addEventListener('message', messageHandler);
    
    // Store iframe data
    this.iframes.set(iframe, {
      messageHandler,
      options: iframeOptions
    });

    // Set initial styles
    iframe.style.overflow = 'hidden';
    iframe.style.border = 'none';
    
    return this;
  }

  /**
   * Resize iframe to fit content
   * @param {HTMLIFrameElement} iframe - The iframe element
   * @param {number} width - Content width
   * @param {number} height - Content height
   * @param {Object} options - Resize options
   */
  resizeIframe(iframe, width, height, options) {
    // Apply constraints
    const constrainedWidth = Math.max(options.minWidth, Math.min(options.maxWidth, width));
    const constrainedHeight = Math.max(options.minHeight, Math.min(options.maxHeight, height));

    // Debounce resize to prevent excessive updates
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      iframe.style.width = `${constrainedWidth}px`;
      iframe.style.height = `${constrainedHeight}px`;
    }, options.resizeInterval);
  }

  /**
   * Remove iframe resizing
   * @param {HTMLIFrameElement} iframe - The iframe element
   */
  destroy(iframe) {
    const iframeData = this.iframes.get(iframe);
    if (iframeData) {
      window.removeEventListener('message', iframeData.messageHandler);
      this.iframes.delete(iframe);
    }
  }

  /**
   * Destroy all iframe resizers
   */
  destroyAll() {
    for (const [iframe] of this.iframes) {
      this.destroy(iframe);
    }
  }
}

// Auto-initialize for iframes with data-iframe-resize attribute
document.addEventListener('DOMContentLoaded', () => {
  const autoIframes = document.querySelectorAll('iframe[data-iframe-resize]');
  if (autoIframes.length > 0) {
    const resizer = new IframeResizer();
    autoIframes.forEach(iframe => {
      const options = JSON.parse(iframe.getAttribute('data-iframe-resize') || '{}');
      resizer.init(iframe, options);
    });
  }
});

export default IframeResizer; 