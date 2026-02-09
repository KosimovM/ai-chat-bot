# Spec and build

## Agent Instructions

Ask the user questions when anything is unclear or needs their input. This includes:

- Ambiguous or incomplete requirements
- Technical decisions that affect architecture or user experience
- Trade-offs that require business context

Do not make assumptions on important decisions — get clarification first.

---

## Workflow Steps

### [x] Step: Technical Specification

Assess the task's difficulty, as underestimating it leads to poor outcomes.

- easy: Straightforward implementation, trivial bug fix or feature
- medium: Moderate complexity, some edge cases or caveats to consider
- hard: Complex logic, many caveats, architectural considerations, or high-risk changes

Create a technical specification for the task that is appropriate for the complexity level:

- Review the existing codebase architecture and identify reusable components.
- Define the implementation approach based on established patterns in the project.
- Identify all source code files that will be created or modified.
- Define any necessary data model, API, or interface changes.
- Describe verification steps using the project's test and lint commands.

Save the output to `d:\ideas\ai-chat-bot\.zencoder\chats\50293895-d3d1-4c63-b76e-be83c1946a03/spec.md`

---

## Implementation Plan

### Phase 1: UI Base & Core Components
- [ ] Update `globals.css` with base SaaS styles and Tailwind 4 config.
- [ ] Refactor `src/components/Button.tsx` (primary, secondary, ghost variants).
- [ ] Refactor `src/components/Input.tsx` (label, error states, focus styles).
- [ ] Refactor `src/components/ui/` components (Card, Alert, Loader, etc.).

### Phase 2: Layout & Navigation
- [ ] Refactor `src/components/Sidebar.tsx` and `src/components/Topbar.tsx`.
- [ ] Update dashboard layouts in `src/app/dashboard/layout.tsx` and `src/app/(dashboard)/layout.tsx`.

### Phase 3: Auth Pages
- [ ] Update Login page (`src/app/(auth)/login/page.tsx`).
- [ ] Update Register page (`src/app/(auth)/register/page.tsx`).

### Phase 4: Dashboard Home & Chats
- [ ] Update Dashboard Home page (`src/app/dashboard/page.tsx`).
- [ ] Update Chat page (`src/app/dashboard/chats/page.tsx`).
- [ ] Update `src/components/ChatMessage.tsx`.

### Phase 5: Chat Widget
- [ ] Update `src/components/ChatWidget.tsx` to match the new SaaS style.

### Phase 6: Final Polish & Verification
- [ ] Ensure responsiveness across mobile, tablet, and desktop.
- [ ] Verify loading states and error handling.
- [ ] Run `npm run lint`.
- [ ] (Optional) Verify Dark Mode support.

---

### [ ] Step: Completion Report

After completion, write a report to `d:\ideas\ai-chat-bot\.zencoder\chats\50293895-d3d1-4c63-b76e-be83c1946a03/report.md` describing:
- What was implemented
- How the solution was tested
- The biggest issues or challenges encountered
