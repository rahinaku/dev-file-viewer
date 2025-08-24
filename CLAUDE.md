# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Router v7 application with TypeScript, built as a file-viewer project. It's a modern full-stack React application with server-side rendering enabled by default.

## Essential Commands

### Development
- `npm run dev` - Start development server with HMR at http://localhost:5173
- `npm run typecheck` - Run TypeScript type checking and generate route types
- `npm run build` - Build for production
- `npm start` - Start production server from built files

### Package Management
This project uses pnpm as the package manager (as specified in package.json). Use `pnpm install` instead of `npm install` for dependency management.

## Architecture

### React Router v7 Structure
- **File-based routing**: Routes are defined in `app/routes.ts` and route components in `app/routes/`
- **Type-safe routes**: Route types are auto-generated in `+types/` directories for each route
- **SSR enabled**: Server-side rendering is enabled by default in `react-router.config.ts`

### Key Files
- `app/root.tsx` - Root layout component with error boundary and HTML structure
- `app/routes.ts` - Route configuration (currently has index route to home.tsx)
- `app/routes/home.tsx` - Home page route component
- `react-router.config.ts` - React Router configuration
- `vite.config.ts` - Vite bundler configuration with TailwindCSS and TypeScript paths

### Styling
- **TailwindCSS v4**: Pre-configured with Vite plugin
- **CSS**: Global styles in `app/app.css`
- **Fonts**: Uses Inter font from Google Fonts (configured in root.tsx)

### Development Stack
- **React 19** with React DOM
- **TypeScript 5.8** with strict type checking
- **Vite 6** for development and building
- **TailwindCSS 4** for styling
- **React Router 7** for routing and SSR

### Project Structure
```
app/
├── root.tsx          # Root layout and error boundary
├── routes.ts         # Route configuration
├── routes/           # Route components
├── welcome/          # Welcome component and assets
└── app.css          # Global styles
```

### Type Generation
Run `npm run typecheck` to generate route types before type checking. This creates `+types/` directories with route-specific TypeScript definitions.