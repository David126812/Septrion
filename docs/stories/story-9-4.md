---
id: story-9-4
epic: 9
name: "Agent vocal"
status: done
commit: "a5a3107"
---

# Story 9.4: Agent vocal

## User Story
As a **membre CS**, I want **poser une question par la voix**, So that **je peux utiliser l'assistant en mains libres**.

## Acceptance Criteria
- Given sur /assistant idle
- When appuie micro central (w-24 h-24)
- Then mode enregistrement:
  - scale-110
  - bg-primary
  - shadow glow
  - icone pulsante
  - "Je vous ecoute..."
- And quand termine: audio transcrit, traite comme message texte
- And en conversation: micro dans barre saisie sticky bas

## Tasks
- [x] Bouton micro central (idle state)
- [x] Mode enregistrement avec animations
- [x] Web Speech API fr-FR (note: au lieu de Whisper)
- [x] Transcription -> pipeline texte
- [x] Micro dans barre saisie (conversation state)

## Dev Notes
**Architecture patterns:** Utilise Web Speech API (SpeechRecognition) avec locale fr-FR au lieu de Whisper API. Le bouton micro change d'etat entre idle (central, grand) et conversation (dans la barre de saisie). La transcription est injectee dans le pipeline texte standard.
**Source files:** src/pages/AssistantIA.tsx
**Testing:** Tester sur Chrome (meilleur support Web Speech API). Verifier la transcription fr-FR et le pipeline de bout en bout.

## Dev Agent Record
**Model:** Claude
**Status:** done
**Implementation notes:** Agent vocal implementee avec Web Speech API fr-FR. Bouton micro central en idle, integre dans la barre de saisie en conversation. Animations d'enregistrement (scale, glow, pulse) presentes.
**Gaps:** Utilise Web Speech API au lieu de Whisper API — ecart mineur, fonctionnel mais moins precis. Compatibilite limitee a certains navigateurs.
