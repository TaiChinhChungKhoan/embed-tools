import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

// Plugin to copy data files from src/data to public/data
function copyDataFiles() {
  return {
    name: 'copy-data-files',
    buildStart() {
      const srcDataDir = resolve(__dirname, 'src/data');
      const publicDataDir = resolve(__dirname, 'public/data');
      
      // Ensure public/data directory exists
      if (!fs.existsSync(publicDataDir)) {
        fs.mkdirSync(publicDataDir, { recursive: true });
      }
      
      // Copy all JSON files from src/data to public/data
      if (fs.existsSync(srcDataDir)) {
        const files = fs.readdirSync(srcDataDir);
        files.forEach(file => {
          if (file.endsWith('.json')) {
            const srcPath = path.join(srcDataDir, file);
            const destPath = path.join(publicDataDir, file);
            fs.copyFileSync(srcPath, destPath);
            console.log(`📁 Copied: ${file} to public/data/`);
          }
        });
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), copyDataFiles()],
  base: '/embed-tools/vnindex-analysis/',
  build: {
    outDir: '../../dist/vnindex-analysis',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `assets/${facadeModuleId}-[hash].js`;
        },
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@embed-tools/components': resolve(__dirname, '../../packages/components/src'),
      '@embed-tools/iframe-utils': resolve(__dirname, '../../packages/iframe-utils/src'),
    },
  },
  css: {
    devSourcemap: true,
  },
});