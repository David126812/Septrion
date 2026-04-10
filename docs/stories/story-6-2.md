---
id: story-6-2
epic: 6
name: "Digest — resume IA via Supabase"
status: done
commit: a5a3107
---

# Story 6.2: Digest -- resume IA via Supabase

## User Story
As a **administrateur**, I want **declencher l'envoi d'un digest**, So that **le testeur recoit un point de situation**.

## Acceptance Criteria
- Given un admin appelle send-digest avec copro_id
- When la fonction est executee
- Then les dossiers actifs/bloques et signalements en attente sont queries
- And l'IA genere un resume de 3 a 5 lignes
- And le digest est envoye par WhatsApp et email
- And les erreurs sont loggees en cas d'echec

## Tasks
- [x] send-digest/index.ts
- [x] Query dossiers actifs/bloques + signalements en attente
- [x] Generation resume via Claude (IA)
- [x] Envoi WhatsApp + email
- [x] Error logging

## Dev Notes
**Architecture patterns:** Edge Function invoquee manuellement par un admin avec copro_id en parametre. Query dossiers et signalements, generation resume IA via Claude API, envoi multi-canal WhatsApp + email via helpers _shared, logging erreurs.
**Source files:** supabase/functions/send-digest/index.ts
**Testing:** Verifier la query des dossiers et signalements, la generation du resume IA, l'envoi WhatsApp et email, et le logging en cas d'erreur.

## Dev Agent Record
**Model:** Claude
**Status:** done
**Implementation notes:** send-digest/index.ts implementee. Query les dossiers actifs/bloques et signalements en attente pour le copro_id donne, genere un resume 3-5 lignes via Claude API, envoie par WhatsApp et email via les helpers _shared, et logge les erreurs.
**Gaps:** Aucun.
