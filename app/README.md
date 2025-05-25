# Life Manager App

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.5-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)

A modern, responsive app for the Life Manager application built with React, Vite, and Tailwind CSS.

## 🎨 UI Features

- **Modern Design**: Clean, minimal UI using Tailwind CSS
- **Responsive**: Works on all device sizes
- **Admin Portal Layout**: Sidebar and header layout for easy navigation
- **Component Library**: Custom components for consistent user experience
- **Interactive Dashboard**: Financial overview, categories, and upcoming events
- **Expense Management**: List view with filtering and sorting capabilities

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Navigate to the app directory:
   ```bash
   cd app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 🛠️ Technology Stack

- **React**: UI library
- **Vite**: Build tool and development server
- **Tailwind CSS v3.3.5**: Utility-first CSS framework
- **@tailwindcss/forms**: Form styling plugin for Tailwind CSS
- **Heroicons**: SVG icon library

## 📁 Project Structure

- **src/components**: Reusable UI components
  - **layout**: Layout components (Sidebar, Header)
  - **finance**: Finance-related components (ExpenseEntry, ExpenseList)
- **src/App.jsx**: Main application component and routing

## ⚙️ Configuration Files

- **tailwind.config.cjs**: Tailwind CSS configuration with custom colors and plugins
- **postcss.config.cjs**: PostCSS configuration for Tailwind CSS

## 🔧 Tailwind CSS Setup

This project uses Tailwind CSS v3.3.5 for styling. The configuration includes:

- Custom color palettes for primary and secondary colors
- Integration with the @tailwindcss/forms plugin
- Custom font configuration

```javascript
// tailwind.config.cjs
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { /* color values */ },
        secondary: { /* color values */ }
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')]
}
```

## 📝 Notes

- This project is compatible with Tailwind CSS v3.3.5. Using newer versions (like v4+) may require additional configuration changes.
- The UI has been designed following modern design principles with focus on usability and aesthetics.
