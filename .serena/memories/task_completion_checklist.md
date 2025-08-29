# Task Completion Checklist

## Before Completing Any Task

### Type Checking
1. **Generate route types**: `pnpm run typecheck` 
   - This generates route types AND runs TypeScript checking
   - Must be run after any route changes
   
### Code Quality
2. **No linting/formatting commands found** in package.json
   - Project appears to rely on TypeScript checking only
   - Ensure TypeScript strict mode compliance

### Testing
3. **No test commands found** in package.json
   - Manual testing may be required
   - Test in development server: `pnpm run dev`

### Build Verification
4. **Production build**: `pnpm run build`
   - Verify build completes successfully
   - Check for any build warnings or errors

### Development Testing
5. **Local testing**: `pnpm run dev`
   - Verify application starts correctly
   - Test functionality in browser at http://localhost:5173
   - Check both light and dark modes if UI changes were made

## For UI/Component Changes
- Test responsive design on different screen sizes
- Verify accessibility (keyboard navigation, screen readers)
- Test dark mode compatibility
- Check media file handling if relevant

## For Route Changes
- Run `pnpm run typecheck` to regenerate route types
- Test navigation and data loading
- Verify SSR functionality

## Final Checks
- Ensure all TypeScript errors are resolved
- Verify no console errors in browser
- Test core functionality works as expected