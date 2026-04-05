# React to Astro Conversion Plan

## Already Converted ✅
- MainLayout.astro
- Sidebar.astro (UI component)
- Toast.astro (UI component)
- AnimatedModal.astro (UI component)
- StudentPortal.astro (student component)
- ExamSidebar.astro (teacher component)
- TornadoGame.astro (game component)
- SpellTheWordGame.astro (game component)
- Pages: index, about, login, classes, dashboard, settings, faq, terms, privacy, **reports**, **esl-games**, **game-center**
- **StudentCard.astro** - Student card with long-press, animations, custom events
- **LanguageSelector.astro** - 4 languages with localStorage persistence
- **LevelUpOverlay.astro** - Celebration overlay with disco lights
- **BehaviorModal.astro** - Behavior tracking with 3 tabs
- **StickerPicker.astro** - 46 stickers across categories
- **ProfileModal.astro** - Profile editing with avatar picker
- **SingleAddStudentModal.astro** - Add student with 50 avatars
- **PointsHistoryView.astro** - History viewer with stats & filters
- **ClassDashboard.astro** (32KB) - Main classroom dashboard with stats, quick actions, student grid

## Remaining Components to Convert

### High Priority - Core Components
1. ~~**ClassDashboard.jsx**~~ ✅ CONVERTED
2. ~~**LandingPage.jsx**~~ ✅ CONVERTED (index.astro)
3. ~~**ESLGames.jsx**~~ ✅ CONVERTED (esl-games.astro)
4. ~~**GameCenter.jsx**~~ ✅ CONVERTED (game-center.astro)
5. ~~**ReportsPage.jsx**~~ ✅ CONVERTED (reports.astro)
6. **SettingsPage.jsx** (79KB) - Settings page
7. **TeacherWorkspace.jsx** (46KB) - Teacher tools
8. **AssignmentsPage.jsx** (47KB) - Assignments management

### Medium Priority - Modals & Overlays
9. **ProfileModal.jsx** - User profile modal
10. **StudentCard.jsx** - Student card component
11. **BehaviorModal.jsx** - Behavior tracking
12. **AddStudentModal.jsx** - Add student form
13. **BulkAddStudentModal.jsx** - Bulk import students
14. **EditStudentModal.jsx** - Edit student info
15. **AssignmentGradingModal.jsx** - Grade assignments
16. **StickerPicker.jsx** - Sticker selection

### Game Components (Need Alpine.js conversion)
17. **FaceOffGame.jsx** + FaceOffSetup.jsx
18. **MemoryMatchGame.jsx** + MemoryMatchSetup.jsx
19. **MotoRaceGame.jsx** + MotoRaceSetup.jsx
20. **HorseRaceGame.jsx** + HorseRaceSetup.jsx
21. **QuizGame.jsx** + QuizSetup.jsx

### Lesson Planner
22. **LessonPlannerPage.jsx** (51KB)
23. **DailyTemplate.jsx**, **MonthlyTemplate.jsx**, **YearlyTemplate.jsx**

### Utility Components
24. **HelpChatBubble.jsx** - Help system
25. **LanguageSelector.jsx** - i18n toggle
26. **LevelUpOverlay.jsx** - Gamification
27. **PointsHistoryView.jsx** - Points history
28. **Whiteboard.jsx** - Digital whiteboard
29. **KidTimer.jsx** - Classroom timer

## Astro Conversion Guidelines

### 1. Component Structure
```astro
---
// Frontmatter - Props & Logic
interface Props {
  isOpen?: boolean;
  title?: string;
}

const { isOpen = false, title = '' } = Astro.props;
---

<style>
  /* Scoped CSS */
</style>

<!-- Template -->
<div class="component">
  <slot />
</div>

<script>
  // Client-side interactivity with Alpine.js or vanilla JS
</script>
```

### 2. State Management
- Use Alpine.js `x-data` for component state
- Use localStorage for persistence
- Dispatch CustomEvents for parent communication

### 3. Animations
- CSS transitions for simple animations
- Web Animations API for complex sequences
- Avoid heavy animation libraries

### 4. Icons
- Inline SVG icons (no icon library dependencies)
- Reusable icon components as Astro partials

### 5. Forms
- Progressive enhancement
- Form actions for server submissions
- Client-side validation with Alpine.js


## ✅ Converted Components (New)

### UI Components
- **StudentCard.astro** - Student card with score, level, progress bar, avatar, long-press actions
- **LanguageSelector.astro** - Language dropdown with localStorage persistence

### Conversion Pattern Used

Both components follow the Astro best practices:
1. **Frontmatter**: TypeScript interfaces for props, logic at build time
2. **Scoped CSS**: Using `<style>` with CSS variables for dynamic values
3. **Progressive Enhancement**: Vanilla JS in `<script>` tag for interactivity
4. **Custom Events**: Communication via `window.dispatchEvent()` for parent-child communication
5. **localStorage**: Client-side persistence
6. **Accessibility**: ARIA attributes, keyboard support

### Key Differences from React

| React | Astro |
|-------|-------|
| `useState` | Vanilla JS variables + DOM updates |
| `useEffect` | `DOMContentLoaded` + event listeners |
| Props drilling | Custom events or localStorage |
| Inline styles | Scoped CSS with CSS variables |
| JSX | Astro template syntax |
| `onClick={(e) => ...}` | `addEventListener('click', ...)` |

