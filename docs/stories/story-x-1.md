---
id: story-x-1
epic: extra
name: "Bottom Navigation globale"
status: missing
commit: "N/A"
---

# Story X.1: Bottom Navigation globale

**Priority: CRITICAL**

## User Story
As a **utilisateur**, I want **naviguer entre les sections principales de l'app**, So that **j'accede a tout en un tap depuis n'importe quelle page**.

## Acceptance Criteria
- Given connecte et pas sur Auth/Onboarding
- When n'importe quelle page
- Then bottom nav persistante avec 5 onglets:
  - Dashboard (icone maison)
  - Dossiers (icone dossier)
  - "+" central (bouton primaire -> /signaler-incident)
  - Signalements (icone inbox + badge count)
  - Assistant IA (icone micro/chat)
- And onglet actif highlighte
- And badge count signalements "nouveau" en temps reel

## Tasks
- [ ] Creer src/components/layout/BottomNav.tsx
- [ ] 5 onglets avec icones Lucide
- [ ] "+" central style primaire
- [ ] Badge count signalements nouveau
- [ ] Highlight onglet actif (useLocation)
- [ ] Integrer dans App.tsx (layout wrapping AuthGuard routes sauf /auth et /onboarding)
- [ ] Touch targets 44px minimum

## Dev Notes
**Architecture patterns:** Composant layout persistant rendu dans App.tsx autour des routes protegees. Utilise useLocation de React Router pour determiner l'onglet actif. Badge count via query Supabase sur signalements avec status='nouveau'. Bouton "+" central avec style differencie (primary, eleve).
**Source files:** src/components/layout/BottomNav.tsx (a creer), src/App.tsx (a modifier)
**Reference:** UX Spec section "Navigation globale"
**Testing:** Verifier la presence sur toutes les pages protegees, l'absence sur /auth et /onboarding, le highlight actif, le badge count, et les touch targets (44px min).

## Dev Agent Record
**Model:** Claude
**Status:** missing
**Implementation notes:** Aucune implementation. Le composant BottomNav n'existe pas. La navigation actuelle depend probablement de liens dans les pages individuelles.
**Gaps:** Composant entierement a creer. Integration layout dans App.tsx necessaire. Badge count temps reel a implementer.
