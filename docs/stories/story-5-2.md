---
id: story-5-2
epic: 5
name: "Notification automatique — nouveau signalement"
status: done
commit: a5a3107
---

# Story 5.2: Notification automatique -- nouveau signalement

## User Story
As a **membre du conseil syndical**, I want **etre notifie quand un nouveau signalement arrive**, So that **je suis au courant immediatement**.

## Acceptance Criteria
- Given un nouveau signalement est cree
- When l'insertion est confirmee en base
- Then send-notification est appelee
- And le testeur recoit un WhatsApp (titre, urgence, lien app) et un email
- And le systeme fonctionne en loop solo (le testeur se notifie lui-meme)
- And si notification_consent est false, pas d'envoi

## Tasks
- [x] send-notification/index.ts
- [x] Query profiles avec consentement notification
- [x] Envoi WhatsApp + email
- [x] Template signalement + digest

## Dev Notes
**Architecture patterns:** Edge Function declenchee apres creation signalement, query des profiles avec notification_consent, envoi multi-canal via helpers _shared. Mode loop solo pour le test.
**Source files:** supabase/functions/send-notification/index.ts
**Testing:** Verifier le declenchement apres insertion, le respect du consent, l'envoi WhatsApp et email, le contenu du message (titre, urgence, lien).

## Dev Agent Record
**Model:** Claude
**Status:** done
**Implementation notes:** send-notification/index.ts implementee. Query les profiles avec notification_consent actif, envoie WhatsApp et email via les helpers _shared avec templates incluant titre, urgence et lien app. Fonctionne en loop solo.
**Gaps:** Aucun.
