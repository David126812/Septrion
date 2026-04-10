---
id: story-x-2
epic: extra
name: "Page Settings"
status: missing
commit: "N/A"
---

# Story X.2: Page Settings

**Priority: HIGH**

## User Story
As a **utilisateur**, I want **modifier mes preferences et consulter mon profil**, So that **je controle mes notifications et mes infos**.

## Acceptance Criteria
- Given connecte
- When accede a /settings
- Then profil (prenom, copropriete -- lecture seule)
- And nombre de lots (selecteur +/-, modifiable, update profiles)
- And toggle notifications (update notification_consent)
- And lien politique de confidentialite
- And mention IA
- And bouton deconnexion (supabase.auth.signOut() + redirect /auth)

## Tasks
- [ ] Creer src/pages/Settings.tsx
- [ ] Route /settings dans App.tsx
- [ ] Affichage profil lecture seule
- [ ] Selecteur lots +/-
- [ ] Toggle notifications
- [ ] Lien /privacy
- [ ] Bouton deconnexion
- [ ] Deplacer sign-out du Dashboard vers Settings

## Dev Notes
**Architecture patterns:** Page React avec lecture du profil depuis Supabase (profiles table). Selecteur lots avec update en temps reel. Toggle notifications met a jour notification_consent dans profiles. Deconnexion via supabase.auth.signOut() avec redirection.
**Source files:** src/pages/Settings.tsx (a creer), src/App.tsx (a modifier)
**Reference:** UX Spec section "9. Settings"
**Testing:** Verifier lecture profil, modification lots (persistence), toggle notifications, lien privacy, et deconnexion complete.

## Dev Agent Record
**Model:** Claude
**Status:** missing
**Implementation notes:** Aucune implementation. La page Settings n'existe pas. Le bouton de deconnexion est actuellement dans le Dashboard.
**Gaps:** Page entierement a creer. Route a ajouter. Sign-out a deplacer du Dashboard.
