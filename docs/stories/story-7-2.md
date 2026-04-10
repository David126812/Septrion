---
id: story-7-2
epic: 7
name: "Events custom"
status: missing
commit: "N/A"
---

# Story 7.2: Events custom

## User Story
As a **product owner**, I want **traquer les actions cles des testeurs**, So that **je peux mesurer les metriques de succes du MVP**.

## Acceptance Criteria
- Given analytics initialise
- When action cle executee
- Then events captures:
  - `signalement_qualified` (signalement -> dossier)
  - `dossier_viewed` (consultation dossier)
  - `notification_sent` (WhatsApp/email)
  - `document_uploaded` (upload app)
  - `digest_clicked` (ouverture depuis notif digest)

## Tasks
- [ ] posthog.capture('signalement_qualified') dans Signalements.tsx
- [ ] posthog.capture('dossier_viewed') dans DossierDetail.tsx
- [ ] posthog.capture('document_uploaded') dans SignalerIncident.tsx
- [ ] posthog.capture('notification_sent') dans send-notification (backend, optionnel)
- [ ] posthog.capture('digest_clicked') dans Dashboard si query param

## Dev Notes
**Architecture patterns:** Appels posthog.capture() places aux points d'action dans les composants existants. Events nommes en snake_case avec proprietes contextuelles (dossier_id, copro_id, etc.).
**Source files:** src/pages/Signalements.tsx, src/pages/DossierDetail.tsx, src/pages/SignalerIncident.tsx, src/pages/Dashboard.tsx
**Testing:** Verifier chaque event dans PostHog Live Events apres action correspondante.

## Dev Agent Record
**Model:** Claude
**Status:** missing
**Implementation notes:** Depend de Story 7.1 (initialisation PostHog). Les fichiers cibles existent deja, il faut ajouter les appels capture() aux bons endroits.
**Gaps:** Zero events implementes dans le code actuel.
