# 🍕 Pizza Dough Calculator

A professional-grade pizza dough calculator built as a Progressive Web App (PWA). Calculate perfect pizza dough recipes using baker's percentages with advanced features for pre-ferments, timing, and process management.

## ✨ Features

### Core Calculator
- **Baker's Percentages** - Flour as 100% base with precise calculations
- **Pre-ferment Support** - Biga and Poolish with proper hydration calculations
- **Recipe Management** - Save/load recipes with localStorage
- **Real-time Updates** - Instant weight calculations as you adjust percentages

### Professional Timing & Process
- **Fermentation Timeline** - Autolyse, bulk ferment, ball & rest, final proof
- **Smart Recommendations** - Temperature-based fermentation advice
- **Process Instructions** - Step-by-step mixing and timing guidance
- **Timing Presets** - Same day, cold ferment, and long ferment options

### Modern UI/UX
- **Mobile-First Design** - Optimized for phones and tablets
- **Collapsible Sections** - Clean interface with smart summaries
- **Results at Top** - Most important information immediately visible
- **PWA Ready** - Install on device, works offline

## 🚀 Live Demo

Visit the live app: [Pizza Dough Calculator](https://zdrom.github.io/doughCalc/)

## 🛠️ Development

### Prerequisites
- Node.js 20+
- npm

### Setup
```bash
git clone https://github.com/zdrom/doughCalc.git
cd doughCalc
npm install
npm run dev
```

### Build
```bash
npm run build
npm run preview
```

## 📱 PWA Features

- **Offline Support** - Works without internet after first visit
- **Install Prompt** - Add to home screen on mobile devices
- **Service Worker** - Automatic updates and caching
- **Responsive Design** - Perfect on any screen size

## 🎯 Baker's Percentage System

Uses professional baker's percentages where:
- Flour = 100% (base)
- Water = 60% (60g water per 100g flour)
- Salt = 2.5% (2.5g salt per 100g flour)
- And so on...

### Pre-ferment Calculations
- **Poolish**: Equal parts flour and water (100% hydration)
- **Biga**: Lower hydration starter (~50% hydration)
- Automatic calculation of remaining flour/water for final dough

## 🔧 Technology Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Vite PWA Plugin** for PWA features
- **GitHub Pages** for hosting
- **GitHub Actions** for CI/CD

## 📄 License

MIT License - feel free to use for any purpose.

## 🤖 Development

Built with assistance from [Claude Code](https://claude.ai/code)

*Last updated: 2025-08-04*