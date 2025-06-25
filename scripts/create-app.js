#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get app name from command line arguments
const appName = process.argv[2];

if (!appName) {
  console.error('❌ Please provide an app name:');
  console.log('Usage: node scripts/create-app.js <app-name>');
  console.log('Example: node scripts/create-app.js my-new-app');
  process.exit(1);
}

// Validate app name (kebab-case)
if (!/^[a-z0-9-]+$/.test(appName)) {
  console.error('❌ App name must be in kebab-case (lowercase, hyphens only)');
  console.log('Example: my-new-app, calculator-tool, data-visualizer');
  process.exit(1);
}

const appsDir = path.join(__dirname, '..', 'apps');
const newAppDir = path.join(appsDir, appName);

// Check if app already exists
if (fs.existsSync(newAppDir)) {
  console.error(`❌ App "${appName}" already exists!`);
  process.exit(1);
}

// Create app directory structure
const dirs = [
  newAppDir,
  path.join(newAppDir, 'src'),
];

dirs.forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
  console.log(`📁 Created directory: ${dir}`);
});

// Template files
const templates = {
  'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${appName.replace(/-/g, ' ')} - Your app description" />
    <meta name="keywords" content="your, keywords, here" />
    <meta name="author" content="Nilead" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://nilead.github.io/embed-tools/${appName}/" />
    <meta property="og:title" content="${appName.replace(/-/g, ' ')}" />
    <meta property="og:description" content="Your app description" />
    <meta property="og:image" content="https://nilead.github.io/embed-tools/${appName}/og-image.png" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://nilead.github.io/embed-tools/${appName}/" />
    <meta property="twitter:title" content="${appName.replace(/-/g, ' ')}" />
    <meta property="twitter:description" content="Your app description" />
    <meta property="twitter:image" content="https://nilead.github.io/embed-tools/${appName}/og-image.png" />

    <!-- Preload fonts for better performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <title>${appName.replace(/-/g, ' ')}</title>
    
    <!-- Embedding styles to prevent conflicts -->
    <style>
      /* Reset styles for embedding */
      .${appName}-embed {
        all: initial;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-sizing: border-box;
      }
      .${appName}-embed * {
        box-sizing: border-box;
      }
    </style>
  </head>
  <body>
    <div id="root" class="${appName}-embed"></div>
    <script type="module" src="./main.jsx"></script>
  </body>
</html>`,

  'main.jsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App.jsx';
import './src/App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);`,

  'src/App.css': `@import '@embed-tools/components/globals.css';`,

  'vite.config.js': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/embed-tools/${appName}/',
  build: {
    outDir: '../../dist/${appName}',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return \`assets/\${facadeModuleId}-[hash].js\`;
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
    },
  },
  css: {
    devSourcemap: true,
  },
});`,

  'package.json': `{
  "name": "${appName}",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build --emptyOutDir",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@embed-tools/components": "workspace:*",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.10",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.6",
    "@vitejs/plugin-react": "^4.6.0",
    "eslint": "^9.29.0",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "tailwindcss": "^4.1.10",
    "vite": "^6.3.5"
  }
}`,

  'src/App.jsx': `import React from 'react';

const App = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            ${appName.replace(/-/g, ' ')}
          </h1>
          <p className="text-lg text-muted-foreground">
            Your app description goes here
          </p>
        </header>
        
        <main>
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4">Welcome to ${appName.replace(/-/g, ' ')}!</h2>
            <p className="text-muted-foreground">
              This is your new embeddable web application. Start building your app by editing the files in the src directory.
            </p>
          </div>
        </main>
        
        <footer className="text-center mt-12 text-muted-foreground">
          <p>Built with React, Vite, and Tailwind CSS v4.0.0</p>
        </footer>
      </div>
    </div>
  );
};

export default App;`,

  'README.md': `# ${appName.replace(/-/g, ' ')}

This is an embeddable web application built with React, Vite, and Tailwind CSS v4.0.0.

## Development

\`\`\`bash
# Start development server
pnpm --filter ${appName} dev

# Build for production
pnpm --filter ${appName} build

# Preview build
pnpm --filter ${appName} preview
\`\`\`

## Embedding

Your app will be available at:
\`https://nilead.github.io/embed-tools/${appName}/\`

### Iframe Embed
\`\`\`html
<iframe 
  src="https://nilead.github.io/embed-tools/${appName}/"
  width="100%" 
  height="600px" 
  frameborder="0"
  title="${appName.replace(/-/g, ' ')}">
</iframe>
\`\`\`

## Features

- ✅ React 19 with modern hooks
- ✅ Vite for fast development and building
- ✅ Tailwind CSS v4.0.0 for styling
- ✅ Shared components from @embed-tools/components
- ✅ Optimized for embedding
- ✅ GitHub Pages deployment ready
- ✅ Responsive design
- ✅ SEO optimized
`
};

// Create template files
Object.entries(templates).forEach(([filename, content]) => {
  const filePath = path.join(newAppDir, filename);
  fs.writeFileSync(filePath, content);
  console.log(`📄 Created file: ${filePath}`);
});

// Function to update main vite.config.js
function updateViteConfig() {
  const mainViteConfigPath = path.join(__dirname, '..', 'vite.config.js');
  if (!fs.existsSync(mainViteConfigPath)) {
    console.warn('⚠️  Main vite.config.js not found, skipping update');
    return;
  }

  let viteConfig = fs.readFileSync(mainViteConfigPath, 'utf8');
  
  // Add new app to rollupOptions input
  const inputRegex = /input:\s*{([^}]+)}/;
  const match = viteConfig.match(inputRegex);
  
  if (match) {
    const existingInputs = match[1];
    const newInput = `        '${appName}': resolve(__dirname, 'apps/${appName}/index.html'),`;
    
    // Check if app is already in the input
    if (!existingInputs.includes(`'${appName}'`)) {
      const updatedInputs = existingInputs + '\n' + newInput;
      viteConfig = viteConfig.replace(inputRegex, `input: {${updatedInputs}}`);
      fs.writeFileSync(mainViteConfigPath, viteConfig);
      console.log(`📝 Updated main vite.config.js with ${appName}`);
    } else {
      console.log(`ℹ️  ${appName} already exists in vite.config.js`);
    }
  } else {
    console.warn('⚠️  Could not find input configuration in vite.config.js');
  }
}

// Function to update tsconfig.json
function updateTsConfig() {
  const tsConfigPath = path.join(__dirname, '..', 'tsconfig.json');
  if (!fs.existsSync(tsConfigPath)) {
    console.warn('⚠️  tsconfig.json not found, skipping update');
    return;
  }

  let tsConfig = fs.readFileSync(tsConfigPath, 'utf8');
  
  // Add new app to paths
  const pathsRegex = /"@\/\*":\s*\[([^\]]+)\]/;
  const pathsMatch = tsConfig.match(pathsRegex);
  
  if (pathsMatch) {
    const existingPaths = pathsMatch[1];
    const newPath = `"./apps/${appName}/src/*"`;
    
    // Check if app is already in the paths
    if (!existingPaths.includes(`"./apps/${appName}/src/*"`)) {
      const updatedPaths = existingPaths + `, ${newPath}`;
      tsConfig = tsConfig.replace(pathsRegex, `"@/*": [${updatedPaths}]`);
      fs.writeFileSync(tsConfigPath, tsConfig);
      console.log(`📝 Updated tsconfig.json paths with ${appName}`);
    } else {
      console.log(`ℹ️  ${appName} already exists in tsconfig.json paths`);
    }
  } else {
    console.warn('⚠️  Could not find paths configuration in tsconfig.json');
  }
  
  // Add new app to include array
  const includeRegex = /"include":\s*\[([^\]]+)\]/;
  const includeMatch = tsConfig.match(includeRegex);
  
  if (includeMatch) {
    const existingIncludes = includeMatch[1];
    const newInclude = `"apps/${appName}/src"`;
    
    // Check if app is already in the includes
    if (!existingIncludes.includes(`"apps/${appName}/src"`)) {
      const updatedIncludes = existingIncludes + `, ${newInclude}`;
      tsConfig = tsConfig.replace(includeRegex, `"include": [${updatedIncludes}]`);
      fs.writeFileSync(tsConfigPath, tsConfig);
      console.log(`📝 Updated tsconfig.json include with ${appName}`);
    } else {
      console.log(`ℹ️  ${appName} already exists in tsconfig.json include`);
    }
  } else {
    console.warn('⚠️  Could not find include configuration in tsconfig.json');
  }
}

// Update configuration files
console.log('\n🔧 Updating configuration files...');
updateViteConfig();
updateTsConfig();

// Verify the app was created successfully
if (!fs.existsSync(path.join(newAppDir, 'package.json'))) {
  console.error('❌ Failed to create app files!');
  process.exit(1);
}

console.log('\n🎉 App created successfully!');
console.log(`\n📁 App location: ${newAppDir}`);
console.log('\n🚀 Next steps:');
console.log(`1. Install dependencies:`);
console.log(`   pnpm install`);
console.log(`\n2. Start developing:`);
console.log(`   pnpm --filter ${appName} dev`);
console.log(`\n3. Update the app description and meta tags in index.html`);
console.log(`\n4. Customize the App.jsx component with your app logic`);
console.log(`\n5. The app is automatically included in the main build configuration!`);
console.log(`\n💡 Tip: If you get "No projects matched the filters" error, try:`);
console.log(`   pnpm install`);
console.log(`   pnpm --filter ${appName} dev`); 