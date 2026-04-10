---
id: story-9-2
epic: 9
name: "Interface chat texte"
status: done
commit: "a5a3107"
---

# Story 9.2: Interface chat texte

## User Story
As a **membre CS**, I want **poser une question par texte**, So that **je retrouve l'info sans chercher manuellement**.

## Acceptance Criteria
- Given sur /assistant
- When tape question + envoie
- Then bulle user (droite, primary)
- And typing indicator (3 dots bounce stagger)
- And reponse agent (fade-in slide-in-from-left)
- And delai typing proportionnel a la longueur
- And questions de suivi
- And historique en memoire React

## Tasks
- [x] AssistantIA.tsx chat interface
- [x] Bulles user/agent
- [x] Typing indicator 3 dots
- [x] Animation fade-in slide-in
- [x] Delai proportionnel
- [x] Historique memoire

## Dev Notes
**Architecture patterns:** Composant React avec state local pour l'historique des messages. Bulles stylisees differemment selon le role (user a droite en primary, agent a gauche). Animations CSS pour les transitions et le typing indicator.
**Source files:** src/pages/AssistantIA.tsx
**Testing:** Verifier le rendu des bulles, les animations, le typing indicator et la persistance de l'historique dans la session.

## Dev Agent Record
**Model:** Claude
**Status:** done
**Implementation notes:** Interface chat complete avec bulles user/agent, typing indicator anime avec 3 dots en stagger, animations fade-in et slide-in, delai proportionnel a la longueur de la reponse, et historique en memoire React.
**Gaps:** Aucun gap identifie.
