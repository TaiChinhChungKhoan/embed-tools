# Monorepo Refactor Guide: Multi-App with Shared shadcn/ui

This guide provides step-by-step instructions to refactor your project into a true monorepo. The goal is to support multiple, independent applications in the `apps` folder that all consume a shared UI library and configurations from the `packages` folder.

---

## ✅ **High-Level Goal**

Transform the project root from being an "app" into being a "manager". Each application in the `apps` folder will be a self-contained, runnable project, sharing code from `packages` to ensure consistency and reduce duplication.

---

## **Step 1: Clean Up the Root Directory**

The root of your project should only contain configuration for the monorepo itself (like `pnpm`, `eslint`, `git`), not for any specific app.

1.  **DELETE** the following from your project's root directory:
    * `vite.config.js` (Each app in `apps` will have its own)

2.  **MOVE** this file:
    * `components.json` -> Move it into **`packages/ui/`**. This is critical. `shadcn/ui` must be managed *inside* the UI package.

3.  **REPURPOSE** the root `tsconfig.json`:
    * This file should only be used to reference the actual shared configs in your `packages/tsconfig` directory. We will set this up in the next step.

---

## **Step 2: Solidify Your Shared `packages`**

This is where you'll create the single source of truth for your UI, configs, and types.

### A. Configure `packages/ui` (The Component Library)

This package will contain all `shadcn/ui` components and your shared Tailwind theme.

1.  **`packages/ui/components.json`** (The file you moved)
    This tells the `shadcn` CLI where to install components.

    ```json
    {
      "$schema": "https://ui.shadcn.com/schema.json",
      "style": "default",
      "rsc": false,
      "tsx": true,
      "tailwind": {
        "config": "tailwind.config.js",
        "css": "src/globals.css",
        "baseColor": "slate",
        "cssVariables": true
      },
      "aliases": {
        "components": "@/components",
        "utils": "@/lib/utils"
      }
    }
    ```

2.  **`packages/ui/tailwind.config.js`**
    This file defines your design system's theme (colors, fonts, etc.). It should **not** have a `content` array.

    ```javascript
    /** @type {import('tailwindcss').Config} */
    module.exports = {
      darkMode: ["class"],
      theme: {
        // All your shared theme customizations for shadcn/ui go here
        container: {
          center: true,
          padding: "2rem",
          screens: { "2xl": "1400px" },
        },
        extend: {
          colors: { /* Your brand colors */ },
        },
      },
      plugins: [require("tailwindcss-animate")],
    }
    ```

### B. Create `packages/tsconfig` (Shared TypeScript Configs)

1.  Create the folder `packages/tsconfig`.
2.  Add a `package.json` inside it:

    ```json
    // packages/tsconfig/package.json
    {
      "name": "@embed-tools/tsconfig",
      "version": "0.0.0",
      "private": true
    }
    ```
3.  Add `base.json` and `react-app.json` inside it:

    ```json
    // packages/tsconfig/base.json
    {
      "$schema": "https://json.schemastore.org/tsconfig",
      "display": "Default",
      "compilerOptions": {
        "target": "ES2022",
        "module": "ESNext",
        "moduleResolution": "bundler",
        "lib": ["es2022", "dom", "dom.iterable"],
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "allowJs": true,
        "resolveJsonModule": true,
        "isolatedModules": true
      },
      "exclude": ["node_modules"]
    }
    ```

    ```json
    // packages/tsconfig/react-app.json
    {
      "$schema": "https://json.schemastore.org/tsconfig",
      "display": "React App",
      "extends": "./base.json",
      "compilerOptions": {
        "jsx": "react-jsx",
        "lib": ["dom", "dom.iterable", "esnext"],
        "module": "esnext"
      }
    }
    ```

---

## **Step 3: Create Your First Application**

Now, let's create `apps/app-one`. Repeat this process for any other apps.

### A. `apps/app-one/package.json`

This file defines the app and its dependencies on your shared packages.

```json
{
  "name": "app-one",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@embed-tools/ui": "workspace:*",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.3.1",
    "tailwindcss": "^3.4.3",
    "typescript": "^5.2.2",
    "vite": "^5.2.0"
  }
}
```

### B. `apps/app-one/tailwind.config.js`

This config imports the shared theme and tells Tailwind where to find the app's files.

```javascript
const sharedConfig = require('@embed-tools/ui/tailwind.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [sharedConfig],
  content: [
    // 1. App-specific files
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    // 2. Path to the shared UI package
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
};
```

### C. `apps/app-one/tsconfig.json`

This extends the shared config from `packages/tsconfig`.

```json
{
  "extends": "@embed-tools/tsconfig/react-app.json",
  "include": ["src"],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### D. App Entry Point (`apps/app-one/src/index.css`)

Ensure your app's main CSS file imports the shared styles from the UI package.

```css
@import '@embed-tools/ui/src/globals.css';
```

-----

## **Step 4: Configure the Monorepo Root**

1.  **`pnpm-workspace.yaml`**: Ensure it's correctly configured.

    ```yaml
    packages:
      - 'apps/*'
      - 'packages/*'
    ```

2.  **Root `package.json`**: Add scripts to easily run your apps from the root.

    ```json
    {
      "name": "embed-tools-monorepo",
      "private": true,
      "scripts": {
        "dev": "pnpm --parallel dev",
        "dev:app-one": "pnpm --filter app-one dev",
        "dev:app-two": "pnpm --filter app-two dev",
        "build": "pnpm --filter \"./apps/*\" build"
      },
      "devDependencies": {
        // Add shared dev dependencies like prettier, eslint here
      }
    }
    ```

-----

## **Step 5: How to Manage `shadcn/ui`**

This is your new workflow for adding components.

1.  **To initialize** (only do this once):

    ```bash
    # Run from the root of your project
    pnpm dlx shadcn-ui@latest init --cwd ./packages/ui
    ```

2.  **To add a new component**:

    ```bash
    # ALWAYS run this command targeting the `packages/ui` directory
    pnpm dlx shadcn-ui@latest add button --cwd ./packages/ui
    ```

    The component will be added to `packages/ui/src/components`. You can then import it in any app: `import { Button } from '@embed-tools/ui';`.

-----

## **Final Recommended Structure**

This is the target structure you should aim for.

```plaintext
/embed-tools
├── /apps
│   ├── /app-one
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   ├── tailwind.config.js
│   │   ├── package.json
│   │   └── /src
│   │       ├── App.tsx
│   │       └── main.tsx
│   └── /app-two
│       └── ... (similar structure)
│
├── /packages
│   ├── /ui
│   │   ├── components.json
│   │   ├── tailwind.config.js
│   │   ├── package.json
│   │   └── /src
│   │       ├── /components
│   │       └── globals.css
│   └── /tsconfig
│       ├── package.json
│       ├── base.json
│       └── react-app.json
│
├── .eslintrc.js
├── package.json
└── pnpm-workspace.yaml
``` 