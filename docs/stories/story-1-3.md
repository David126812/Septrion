---
id: story-1-3
epic: 1
name: "Connexion & persistance de session"
status: todo
---

# Story 1.3: Connexion & persistance de session

## User Story

As a **utilisateur existant**,
I want **me connecter avec mon email + mdp et rester connecte**,
So that **je n'ai pas a me reconnecter a chaque visite**.

## Acceptance Criteria

Given compte existant
When saisit email + mdp + clic "Se connecter"
Then session JWT creee, redirige vers /dashboard (ou /onboarding si pas complete via Story X.3), session restauree automatiquement, AuthGuard protege routes

## Tasks

- [ ] signInWithPassword (email + password)
- [ ] Session persistence via useAuth hook
- [ ] AuthGuard component
- [ ] Redirect vers /dashboard apres login

## Dev Notes

**Architecture patterns:** JWT session via Supabase Auth, useAuth hook for session state, AuthGuard HOC for route protection
**Source files:** src/pages/Auth.tsx, src/hooks/useAuth.ts, src/components/auth/AuthGuard.tsx
**Testing:** Test login persistence across page reloads, verify AuthGuard redirects unauthenticated users
