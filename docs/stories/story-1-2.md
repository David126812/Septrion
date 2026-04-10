---
id: story-1-2
epic: 1
name: "Inscription par email + mot de passe"
status: todo
---

# Story 1.2: Inscription par email + mot de passe

## User Story

As a **nouvel utilisateur**,
I want **creer un compte avec mon email et un mot de passe**,
So that **je peux acceder a Septrion de maniere securisee**.

## Acceptance Criteria

Given sur /auth
When saisit email + mdp + clic "S'inscrire"
Then compte cree Supabase Auth (email+password), tables coproprietes et profiles creees (migration), profil cree avec email, redirige vers onboarding, erreurs explicites (email deja utilise, mdp trop court)

## Tasks

- [ ] Page Auth.tsx avec formulaire (email + mdp)
- [ ] Supabase Auth signUp (email + password)
- [ ] Profile insert apres signup (id, email)
- [ ] Creer coproprietes si inexistant
- [ ] Messages d'erreur explicites
- [ ] Redirect vers /onboarding apres signup

## Dev Notes

**Decision (2026-04-10):** Auth par email + mot de passe. Le numero WhatsApp est collecte a l'onboarding (Story 2.2).
**Architecture patterns:** Supabase Auth with email-based signup, profile creation on signup
**Source files:** src/pages/Auth.tsx, src/lib/supabase.ts, src/hooks/useAuth.ts
**Testing:** Test signup flow end-to-end, verify profile row created with correct fields
