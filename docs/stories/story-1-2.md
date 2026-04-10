---
id: story-1-2
epic: 1
name: "Inscription par numero + mot de passe"
status: partial
commit: 2167d58
---

# Story 1.2: Inscription par numero + mot de passe

## User Story

As a **nouvel utilisateur**,
I want **creer un compte avec mon numero de telephone et un mot de passe**,
So that **je peux acceder a Septrion de maniere securisee**.

## Acceptance Criteria

Given sur /auth
When saisit numero + mdp + clic "S'inscrire"
Then compte cree Supabase Auth, tables coproprietes et profiles creees, profil cree avec whatsapp_phone, redirige vers onboarding, erreurs explicites

## Tasks

- [x] Page Auth.tsx avec formulaire
- [x] Supabase Auth signUp
- [x] Profile insert apres signup
- [ ] Auth par TELEPHONE (pas email)
- [ ] Insert whatsapp_phone dans profiles
- [ ] Creer coproprietes si inexistant

## Dev Notes

**Architecture patterns:** Supabase Auth with phone-based signup, profile creation on signup trigger
**Source files:** src/pages/Auth.tsx, src/lib/supabase.ts, src/hooks/useAuth.ts
**Testing:** Test signup flow end-to-end, verify profile row created with correct fields

## Dev Agent Record

**Model:** Claude
**Status:** partial
**Implementation notes:** Auth page and Supabase signUp implemented, profile insert done after signup. However, authentication uses email+password instead of phone+password as specified.
**Gaps:** Auth utilise email+mdp au lieu de telephone+mdp. Profile insert minimal (id+email, pas de whatsapp_phone). Coproprietes non cree au signup.
