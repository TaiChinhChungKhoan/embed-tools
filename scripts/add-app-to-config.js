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
  console.log('Usage: node scripts/add-app-to-config.js <app-name>');
  console.log('Example: node scripts/add-app-to-config.js my-existing-app');
  process.exit(1);
}

const appsDir = path.join(__dirname, '..', 'apps');
const appDir = path.join(appsDir, appName);

// Check if app exists
if (!fs.existsSync(appDir)) {
  console.error(`❌ App "${appName}" does not exist in ${appsDir}!`);
  console.log('Available apps:');
  const existingApps = fs.readdirSync(appsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  existingApps.forEach(app => console.log(`  - ${app}`));
  process.exit(1);
}

// Function to update main vite.config.js
function updateViteConfig() {
  const mainViteConfigPath = path.join(__dirname, '..', 'vite.config.js');
  if (!fs.existsSync(mainViteConfigPath)) {
    console.warn('⚠️  Main vite.config.js not found, skipping update');
    return false;
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
      return true;
    } else {
      console.log(`ℹ️  ${appName} already exists in vite.config.js`);
      return true;
    }
  } else {
    console.warn('⚠️  Could not find input configuration in vite.config.js');
    return false;
  }
}

// Function to update tsconfig.json
function updateTsConfig() {
  const tsConfigPath = path.join(__dirname, '..', 'tsconfig.json');
  if (!fs.existsSync(tsConfigPath)) {
    console.warn('⚠️  tsconfig.json not found, skipping update');
    return false;
  }

  let tsConfig = fs.readFileSync(tsConfigPath, 'utf8');
  let updated = false;
  
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
      updated = true;
    } else {
      console.log(`ℹ️  ${appName} already exists in tsconfig.json paths`);
      updated = true;
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
      updated = true;
    } else {
      console.log(`ℹ️  ${appName} already exists in tsconfig.json include`);
      updated = true;
    }
  } else {
    console.warn('⚠️  Could not find include configuration in tsconfig.json');
  }
  
  return updated;
}

// Update configuration files
console.log(`🔧 Adding ${appName} to configuration files...`);
const viteUpdated = updateViteConfig();
const tsUpdated = updateTsConfig();

if (viteUpdated && tsUpdated) {
  console.log('\n✅ Successfully added app to configuration files!');
  console.log(`\n🚀 You can now run:`);
  console.log(`   pnpm --filter ${appName} dev`);
} else {
  console.log('\n⚠️  Some configuration files could not be updated.');
  console.log('Please check the warnings above and update manually if needed.');
} 