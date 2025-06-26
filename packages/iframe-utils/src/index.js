/**
 * Iframe Utilities Package
 * Shared utilities for iframe embedding and responsive resizing
 */

import IframeResizer from './iframe-resizer.js';

// Utility functions for iframe communication
export const iframeUtils = {
  /**
   * Send resize message from iframe to parent
   * @param {number} width - Content width
   * @param {number} height - Content height
   */
  sendResizeMessage(width, height) {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'RESIZE',
        width: Math.ceil(width),
        height: Math.ceil(height)
      }, '*');
    }
  },

  /**
   * Check if current window is embedded in an iframe
   * @returns {boolean}
   */
  isEmbedded() {
    return window.self !== window.top;
  },

  /**
   * Get iframe element that contains current window
   * @returns {HTMLIFrameElement|null}
   */
  getParentIframe() {
    if (!this.isEmbedded()) return null;
    
    try {
      const iframes = window.parent.document.querySelectorAll('iframe');
      for (const iframe of iframes) {
        if (iframe.contentWindow === window) {
          return iframe;
        }
      }
    } catch (e) {
      // Cross-origin restriction
      return null;
    }
    
    return null;
  }
};

// Named exports
export { IframeResizer };

// Default export
export default iframeUtils; 