# Suggested Commands

## Package Management
- `pnpm install` - Install dependencies (use pnpm, not npm)
- `pnpm add <package>` - Add new dependency
- `pnpm add -D <package>` - Add development dependency

## Development
- `pnpm run dev` - Start development server at http://localhost:5173
- `pnpm run typecheck` - Run TypeScript type checking and generate route types
- `pnpm run build` - Build for production
- `pnpm start` - Start production server from built files

## System Commands (Linux)
- `ls` - List directory contents
- `cd <path>` - Change directory
- `grep -r <pattern> <path>` - Search for pattern in files
- `find <path> -name <pattern>` - Find files by name pattern
- `git status` - Check git repository status
- `git add .` - Stage all changes
- `git commit -m "message"` - Commit changes

## Docker Deployment
- `docker build -t file-viewer .` - Build Docker image
- `docker run -p 3000:3000 file-viewer` - Run container

## Important Notes
- Always use `pnpm` instead of `npm` for package management
- Run `pnpm run typecheck` before type checking to generate route types
- Development server runs on port 5173, production on port 3000