---
id: story-5-3
epic: 5
name: "Partage cosmetique depuis un dossier"
status: missing
commit: N/A
---

# Story 5.3: Partage cosmetique depuis un dossier

## User Story
As a **membre du conseil syndical**, I want **partager l'info d'un dossier aux residents ou au CS**, So that **je communique facilement sur l'avancement**.

## Acceptance Criteria
- Given je suis sur le detail d'un dossier
- When je clique sur "Partager"
- Then une UI de partage s'affiche avec 2 options: residents et CS
- And un message est pre-rempli avec titre, resume, statut du dossier
- And le message est modifiable
- And quand je clique "Envoyer", le testeur recoit lui-meme WhatsApp + email (loop solo)
- And un ecran de confirmation s'affiche

## Tasks
- [ ] Bouton "Partager" dans DossierDetail.tsx
- [ ] Modal/sheet avec choix residents/CS
- [ ] Message pre-rempli editable
- [ ] Envoi loop solo via send-notification
- [ ] Ecran confirmation

## Dev Notes
**Architecture patterns:** Bouton de partage dans la page detail dossier, modal avec selection du destinataire (residents/CS), message pre-rempli editable, envoi via send-notification en mode loop solo, ecran de confirmation.
**Source files:** src/pages/DossierDetail.tsx (a modifier)
**Testing:** Verifier le bouton partager, la modal avec les 2 options, le message pre-rempli, l'envoi loop solo, et l'ecran de confirmation.

## Dev Agent Record
**Model:** Claude
**Status:** missing
**Implementation notes:** Feature entierement absente. Aucun bouton "Partager" ni modal de partage n'existe dans DossierDetail.tsx.
**Gaps:** Feature entierement absente. Il faut: (1) ajouter un bouton "Partager" dans DossierDetail.tsx, (2) creer une modal/sheet avec choix residents/CS, (3) implementer le message pre-rempli editable, (4) brancher l'envoi via send-notification en loop solo, (5) ajouter un ecran de confirmation.
