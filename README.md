# Embed Tools - Monorepo for Embeddable Web Applications

A monorepo containing embeddable web applications built with React 19, Vite, TypeScript, and Tailwind CSS v4.0.0, designed for deployment on GitHub Pages. This project uses pnpm workspaces to manage multiple apps with shared UI components and configurations.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation
```bash
cd embed-tools
pnpm install
```

### Development
```bash
# Start development server for all apps
pnpm dev

# Start specific app
pnpm --filter bazi-calculator dev
```

### Building
```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter bazi-calculator build
```

### Preview
```bash
# Preview all apps
pnpm preview

# Preview specific app
pnpm --filter bazi-calculator preview
```

## 🚀 Deployment to GitHub Pages

### 1. Automatic Deployment (Recommended)
- This repository uses a GitHub Actions workflow (`.github/workflows/deploy.yml`) to automatically deploy all apps to GitHub Pages whenever you push to the `master` branch.
- The workflow builds all apps and publishes the `dist/` directory to the `gh-pages` branch.
- **To deploy:** Just push your changes to GitHub and the deployment will happen automatically.

**To check deployment:**
- Go to your repo on GitHub → Actions tab → See if the "Deploy to GitHub Pages" workflow ran and succeeded.
- Your apps will be available at:
  - `https://nilead.github.io/embed-tools/bazi-calculator/`

### 2. Manual Deployment (Optional)
If you want to deploy manually, you can use the script:

```bash
pnpm deploy
```

This will:
- Build all apps
- Deploy the contents of `dist/` to the `gh-pages` branch using the `gh-pages` package

### 3. GitHub Pages Settings
- Make sure GitHub Pages is enabled in your repo settings:
  - Go to **Settings → Pages**
  - Set source to `gh-pages` branch, root folder

## 📱 Available Apps

### 1. Bazi Calculator
A comprehensive Chinese astrology tool for calculating and analyzing Ba Zi (Four Pillars of Destiny) charts.

**Features:**
- Interactive birth date and time input with timezone support
- Complete Ba Zi chart calculation with detailed analysis
- Day Master strength analysis and favorable elements
- Luck pillars and life period analysis
- Eight Mansions (Feng Shui) direction recommendations
- Five Elements analysis and industry recommendations
- Symbolic stars interpretation
- Annual analysis for current year
- Responsive design with shared UI components
- Vietnamese language support with comprehensive translations

**URL:** `https://nilead.github.io/embed-tools/bazi-calculator/`

## 🛠️ Project Structure

```
embed-tools/
├── apps/                           # Individual applications
│   ├── bazi-calculator/            # Bazi Calculator app
│   │   ├── src/
│   │   │   ├── App.jsx            # Main app component
│   │   │   ├── components/        # App-specific components
│   │   │   │   ├── DatePicker.jsx
│   │   │   │   ├── TimePicker.jsx
│   │   │   │   ├── Results.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   └── [other components]
│   │   │   └── data/              # App data and configuration
│   │   │       ├── constants.js
│   │   │       └── explanations.js
│   │   ├── index.html             # HTML template
│   │   ├── package.json           # App-specific dependencies
│   │   ├── README.md              # App-specific documentation
│   │   └── vite.config.js         # App-specific Vite config
│   ├── _template/                  # Template for new apps
│   └── lib/                        # Shared utilities
├── packages/                       # Shared packages
│   ├── components/                 # Shared UI components (shadcn/ui)
│   │   ├── src/
│   │   │   ├── components/        # Reusable UI components
│   │   │   ├── lib/               # Utility functions
│   │   │   └── globals.css        # Global styles (CRITICAL for CSS source definition)
│   │   ├── components.json        # shadcn/ui configuration
│   │   ├── package.json           # Component library dependencies
│   │   ├── tailwind.config.js     # Shared Tailwind theme
│   │   └── tsconfig.json          # Component library TypeScript config
│   └── tsconfig/                  # Shared TypeScript configurations
│       ├── base.json              # Base TypeScript config
│       └── react-app.json         # React app TypeScript config
├── dist/                          # Production builds
│   └── bazi-calculator/           # Built Bazi Calculator app
├── scripts/
│   └── create-app.js              # App generator script
├── pnpm-workspace.yaml            # pnpm workspace configuration
├── package.json                   # Root package.json (monorepo manager)
├── tsconfig.json                  # Root TypeScript config
├── vite.config.js                 # Root Vite configuration
├── README.md                      # This file
└── TAILWIND.md                    # Tailwind CSS v4 setup guide
```

## 🔧 Configuration

### Monorepo Setup
This project uses **pnpm workspaces** for efficient package management:
- **Root level**: Contains monorepo configuration and shared dependencies
- **Apps**: Independent, runnable applications in `apps/`
- **Packages**: Shared code and configurations in `packages/`

### pnpm Workspace Configuration
```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### Shared Packages

#### Components Package (`packages/components`)
Contains all shared UI components built with shadcn/ui:
- Reusable React components
- Shared Tailwind theme
- Utility functions
- **Global styles with CSS source definition** (see important note below)

#### TypeScript Config Package (`packages/tsconfig`)
Provides shared TypeScript configurations:
- `base.json`: Common TypeScript settings
- `react-app.json`: React-specific configuration

### App-Specific Configuration
Each app in `apps/` has its own:
- `package.json` with app-specific dependencies
- `vite.config.js` for build configuration
- `tsconfig.json` that extends shared configurations

## ⚠️ Important: CSS Source Definition Fix

**Critical Issue Resolved**: The apps were initially not working due to missing CSS source definitions. This was fixed by ensuring the `packages/components/src/globals.css` file contains the proper CSS source definition:

```css
@import "tailwindcss";

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

This file must be imported in each app's main entry point to ensure proper styling.

## 🎨 Tailwind CSS v4.0.0 Features

### Shared Theme Configuration
The shared theme is defined in `packages/components/tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### App-Specific Tailwind Config
Each app extends the shared theme:
```javascript
const sharedConfig = require('@embed-tools/components/tailwind.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [sharedConfig],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/components/src/**/*.{js,ts,jsx,tsx}',
  ],
};
```

### New Import Syntax
```css
@import "tailwindcss";
```

## 🚀 Deployment

### GitHub Pages
The apps are automatically deployed to GitHub Pages when pushed to the main branch. The build process creates optimized production builds in the `dist/` directory.

### Local Preview
```bash
# Build and preview locally
pnpm build
pnpm preview
```

## 🔧 Development Workflow

### Creating a New App
```bash
# Use the app generator script
node scripts/create-app.js my-new-app
```

### Adding New Components
1. Add components to `packages/components/src/components/`
2. Export them from `packages/components/src/index.ts`
3. Import in apps using `@embed-tools/components`

### Updating Shared Dependencies
```bash
# Add to root package.json for workspace-wide dependencies
pnpm add -w package-name

# Add to specific app
pnpm --filter app-name add package-name
```

## 📝 Recent Updates

- **Added Bazi Calculator app** - Comprehensive Chinese astrology tool with Ba Zi chart analysis
- **Fixed CSS source definition issue** - Critical fix for proper styling
- **Updated to React 19** - Latest React version with improved performance
- **Improved build process** - Better monorepo build configuration
- **Enhanced UI components** - Shared component library with shadcn/ui integration
- **Added Vietnamese language support** - Complete translations for Bazi Calculator
- **Implemented timezone support** - Accurate calculations across different time zones

## 🎨 Customization

### Styling
- Modify `packages/components/tailwind.config.js` for shared theme changes
- Update `packages/components/src/globals.css` for global styles
- Use CSS custom properties for dynamic theming
- Leverage Tailwind v4.0.0's new component and utility layers

### Branding
- Update meta tags in each app's `index.html`
- Replace favicon and social media images
- Customize color scheme in shared Tailwind config
- Use CSS custom properties for dynamic theming

## 📝 Development Guidelines

### Code Style
- Use ESLint for code quality
- Follow React and TypeScript best practices
- Implement responsive design
- Write accessible HTML
- Use shared components from `packages/components`

### Performance
- Lazy load components when possible
- Optimize images and assets
- Use React.memo for expensive components
- Implement proper error boundaries
- Leverage Tailwind v4.0.0's performance improvements
- Share code through packages to reduce duplication

### Monorepo Best Practices
- Keep shared code in `packages/`
- Use workspace dependencies (`workspace:*`)
- Maintain consistent TypeScript configurations
- Share UI components through the components package
- Use the app generator for new apps

### Tailwind v4.0.0 Best Practices
- Use the new `@import "tailwindcss"` syntax
- Organize styles using `@layer` directives
- Use CSS custom properties for theming
- Take advantage of the new animation utilities
- Use `hoverOnlyWhenSupported` for better mobile experience

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly across all apps
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code examples
- See `REFACTOR_GUIDE.md` for detailed monorepo setup

---

**Built with ❤️ using React, Vite, TypeScript, and Tailwind CSS v4.0.0 in a pnpm monorepo** 