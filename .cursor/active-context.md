> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `.git\COMMIT_EDITMSG` (Domain: **Generic Logic**)

### 🔴 Generic Logic Gotchas
- **Circular dependency: index.ts ↔ leads.ts**: Files index.ts and leads.ts import each other, creating a circular dependency. This can cause initialization order bugs, undefined imports at runtime, and makes refactoring harder. Consider extracting shared types into a separate file.
- **Circular dependency: index.ts ↔ conversations.ts**: Files index.ts and conversations.ts import each other, creating a circular dependency. This can cause initialization order bugs, undefined imports at runtime, and makes refactoring harder. Consider extracting shared types into a separate file.
- **Circular dependency: index.ts ↔ questions.ts**: Files index.ts and questions.ts import each other, creating a circular dependency. This can cause initialization order bugs, undefined imports at runtime, and makes refactoring harder. Consider extracting shared types into a separate file.
- **Circular dependency: index.ts ↔ templates.ts**: Files index.ts and templates.ts import each other, creating a circular dependency. This can cause initialization order bugs, undefined imports at runtime, and makes refactoring harder. Consider extracting shared types into a separate file.
- **Circular dependency: index.ts ↔ scheduled.ts**: Files index.ts and scheduled.ts import each other, creating a circular dependency. This can cause initialization order bugs, undefined imports at runtime, and makes refactoring harder. Consider extracting shared types into a separate file.
- **Circular dependency: index.ts ↔ contacts.ts**: Files index.ts and contacts.ts import each other, creating a circular dependency. This can cause initialization order bugs, undefined imports at runtime, and makes refactoring harder. Consider extracting shared types into a separate file.
- **Circular dependency: index.ts ↔ settings.ts**: Files index.ts and settings.ts import each other, creating a circular dependency. This can cause initialization order bugs, undefined imports at runtime, and makes refactoring harder. Consider extracting shared types into a separate file.
- **Circular dependency: index.ts ↔ webhook.ts**: Files index.ts and webhook.ts import each other, creating a circular dependency. This can cause initialization order bugs, undefined imports at runtime, and makes refactoring harder. Consider extracting shared types into a separate file.

### 📐 Generic Logic Conventions & Fixes
- **[discovery] 2 potentially unused files detected**: These files are not imported by any other file in the codebase and may be dead code:
  • api.ts
  • vite.config.ts

Consider verifying if they are entry points, dynamically required, or can be safely removed.
- **[discovery] 1 potentially unused files detected**: These files are not imported by any other file in the codebase and may be dead code:
  • vite.config.ts

Consider verifying if they are entry points, dynamically required, or can be safely removed.
