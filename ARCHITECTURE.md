# Frontend structure

The Angular application separates agent and agency features under `src/app`:

```text
src/app/
  agent/
    pages/
      leads/
      properties/
      open-houses/
      profile/
      setup-agent/
    services/
  agency/
    pages/
      agents/
      settings/
      join-agency/
    models/
    services/
  auth/
  onboarding/
  page-wrapper/
  pages/
    help/
    access-pending/
  shared/
```

Each page owns its component TypeScript, HTML, SCSS, page model, and page service. Use the existing `config/` convention for form definitions, button settings, table headers, and dialog configuration. Nested dialogs live under the owning page's `components/dialogs/<dialog-name>/`, with separate component/template files and dialog models beside the component.

Feature-wide services and models belong in their feature's `services/` or `models/` directory. Authentication, access gating, the application shell, Help, and reusable UI remain common to both workspaces. Agent-specific feedback-question API logic belongs in `agent/services`; reusable question-selection and feedback UI components remain in `shared/components`.

Routes retain their public URLs: `/home`, `/properties`, `/open-houses`, `/settings`, `/agency`, `/agency/settings`, `/agency/help`, and `/join-agency`. Folder organization does not change bookmarked URLs.
