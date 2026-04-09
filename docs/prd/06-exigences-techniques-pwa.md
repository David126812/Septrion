# Exigences Techniques PWA

**Partie 6/9** | [Sommaire](./00-sommaire-prd.md) | [Document complet](../prd.md)

---

## Architecture

- **SPA React** (Vite + Tailwind + shadcn/ui) — navigation sans rechargement de page
- **PWA installable** — manifest, service worker, icône écran d'accueil
- **Mobile-first** — conçue pour l'usage smartphone, desktop secondaire

## Navigateurs cibles

- Chrome Android (cible principale)
- Safari iOS 16.4+ (push supporté uniquement après installation PWA)
- Desktop : non prioritaire, mais fonctionnel via navigateur

## Temps réel

- Supabase Realtime pour la mise à jour automatique de la page signalements quand un nouveau signalement arrive
- Utilisé aussi pour l'onboarding écran 5 (détection du premier signalement)

## Hors scope MVP

- SEO — les testeurs arrivent par lien direct, pas par recherche
- Accessibilité — fera l'objet d'un examen approfondi post-MVP
- Support desktop dédié
- Offline mode

---
