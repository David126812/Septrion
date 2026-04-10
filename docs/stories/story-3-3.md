---
id: story-3-3
epic: 3
name: "Creation manuelle in-app"
status: done
commit: 0006491
---

# Story 3.3: Creation manuelle in-app

## User Story

As a **membre CS**,
I want **creer un signalement manuellement depuis l'app**,
So that **je peux signaler un probleme meme sans document**.

## Acceptance Criteria

Given connecte + clic "+"
When formulaire affiche
Then titre, description, localisation. Soumission sans fichier OK. Insert signalement avec copro_id, urgency normal, status nouveau.

## Tasks

- [x] SignalerIncident.tsx formulaire
- [x] Titre + description + localisation
- [x] Insert signalement Supabase
- [x] Toast confirmation

## Dev Notes

**Architecture patterns:** Form page with Supabase insert, toast notifications for user feedback
**Source files:** src/pages/SignalerIncident.tsx
**Testing:** Test form submission without file, verify signalement created with correct copro_id, urgency 'normal', and status 'nouveau'

## Dev Agent Record

**Model:** Claude
**Status:** done
**Implementation notes:** SignalerIncident page with form collecting titre, description, and localisation. Submits to Supabase signalements table with user's copro_id, default urgency 'normal', and status 'nouveau'. File attachment is optional. Toast confirmation on success.
**Gaps:** None
