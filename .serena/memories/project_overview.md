# File Viewer Project Overview

## Purpose
This is a file viewer web application that allows users to browse and view different types of files including images, videos, audio files, and documents. It provides a modern, responsive interface for file system navigation and media consumption.

## Tech Stack
- **Framework**: React 19 with React Router v7
- **Language**: TypeScript 5.8 with strict type checking
- **Styling**: TailwindCSS 4 with dark mode support
- **Build Tool**: Vite 6 with HMR (Hot Module Replacement)
- **Package Manager**: pnpm 9.2.0
- **Server**: Node.js with SSR (Server-Side Rendering)
- **Additional Libraries**: 
  - unzipper (for ZIP file handling)
  - dotenv (environment variables)
  - isbot (bot detection)

## Key Features
- File system browsing with directory navigation
- Image, video, and audio file viewing
- Media modal with navigation controls
- Infinite scrolling for large directories
- ZIP file extraction capability
- Dark/light mode support
- Server-side rendering
- Responsive design

## Architecture
- **File-based routing**: Routes defined in `app/routes.ts`
- **Type-safe routes**: Auto-generated types in `+types/` directories  
- **Component structure**: Organized in `app/components/` with dedicated icon components
- **Services**: Business logic in `app/services/`
- **Hooks**: Custom React hooks in `app/hooks/`
- **API routes**: Server-side endpoints in `app/routes/api.*`