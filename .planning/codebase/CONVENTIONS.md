**Analysis Date:** 2026-08-07

## Conventions Overview
The codebase currently relies on standard React patterns and Tailwind conventions.

### Code Style
- **Components**: Functional components using React Hooks
- **Styling**: Tailwind CSS utility classes, often merged using `cn()` utility (combining `clsx` and `tailwind-merge`)
- **State**: Global state managed via React Context (`CRMContext.tsx`)
- **TypeScript**: Interfaces and types defined in `src/types/index.ts`

### Error Handling
- Currently, error handling is minimal as operations are primarily synchronous `localStorage` updates
- Will need robust error handling and HTTP status code mapping when backend is integrated

*Last refreshed codebase analysis: 2026-08-07*
<!-- refreshed: 2026-08-07 -->
