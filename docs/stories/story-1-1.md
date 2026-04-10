---
id: story-1-1
epic: 1
name: "Deploiement Vercel & PWA"
status: done
commit: 2167d58
---

# Story 1.1: Deploiement Vercel & PWA

## User Story

As a **utilisateur**,
I want **acceder a l'app depuis une URL et l'installer sur mon ecran d'accueil**,
So that **j'ai un acces rapide comme une app native**.

## Acceptance Criteria

Given l'app est buildee avec Vite
When un push est fait sur main
Then Vercel deploie automatiquement, manifest.json present (192, 512 icons, display standalone), SW enregistre, vercel.json redirige vers index.html

## Tasks

- [x] vercel.json SPA rewrites
- [x] manifest.json avec icons
- [x] SW registration dans main.tsx
- [x] Meta tags PWA dans index.html

## Dev Notes

**Architecture patterns:** Vite SPA deployed on Vercel with PWA support via manifest and service worker
**Source files:** vercel.json, public/manifest.json, public/sw.js, src/main.tsx, index.html
**Testing:** Verify PWA install prompt on mobile, check Lighthouse PWA score

## Dev Agent Record

**Model:** Claude
**Status:** done
**Implementation notes:** SPA rewrites configured in vercel.json, manifest.json with 192 and 512 icons and display standalone, service worker registered in main.tsx, PWA meta tags added to index.html.
**Gaps:** None
