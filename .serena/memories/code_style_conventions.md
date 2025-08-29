# Code Style and Conventions

## TypeScript Configuration
- **Strict mode enabled**: All TypeScript strict checks are on
- **Target**: ES2022 with DOM and DOM.Iterable libraries
- **Module resolution**: bundler mode with ESModules
- **JSX**: react-jsx transform
- **Path mapping**: `~/*` maps to `./app/*` for clean imports

## File Organization
- **Components**: Organized in `app/components/` with dedicated subdirectories
- **Icons**: Separate icon components in `app/components/icons/`
- **Services**: Business logic in `app/services/`
- **Types**: Type definitions in `app/types/`
- **Routes**: Route components in `app/routes/`
- **Hooks**: Custom hooks in `app/hooks/`
- **Utilities**: Helper functions in `app/lib/`

## Naming Conventions
- **Components**: PascalCase (e.g., `FileViewerPresenter.tsx`)
- **Files**: PascalCase for components, camelCase for utilities
- **Functions**: camelCase (e.g., `closeMediaModal`)
- **Types/Interfaces**: PascalCase with descriptive names
- **API routes**: kebab-case with dot notation (e.g., `api.file.tsx`)

## React Patterns
- **Function components**: Preferred over class components
- **TypeScript**: Fully typed props and return types
- **Hooks**: Custom hooks for reusable logic
- **Props interfaces**: Defined for all components

## Styling
- **TailwindCSS**: Primary styling framework with utility-first approach
- **Dark mode**: Supported with `dark:` prefixes
- **Responsive**: Mobile-first design with responsive breakpoints
- **Custom theme**: Inter font family defined in CSS theme

## Import Organization
- External libraries first
- Internal app imports using `~/` path mapping
- Relative imports for same-directory files