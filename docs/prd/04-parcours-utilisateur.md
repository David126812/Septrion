# Parcours Utilisateur

**Partie 4/9** | [Sommaire](./00-sommaire-prd.md) | [Document complet](../prd.md)

---

## Parcours 1 — Louise qualifie un signalement entrant

**Louise**, 32 ans, trésorière du CS d'une copro de 40 lots. Gère la copro le soir après le travail.

Louise reçoit une push notification : "Nouveau signalement — Panne ascenseur Bât C". Un copropriétaire a envoyé un message WhatsApp au numéro Septrion. Elle ouvre l'app, arrive sur la page signalements. Le signalement est déjà structuré : titre, urgence "urgent", résumé factuel, prochaine action recommandée.

Louise n'a rien eu à saisir. Elle qualifie le signalement : crée un nouveau dossier "Ascenseur Bât C", ajoute une note "Appeler OTIS demain matin", et envoie une notification aux autres membres du CS. Temps total : 2 minutes.

## Parcours 2 — Louise forward un document reçu par email

Louise reçoit par email un devis de ravalement de façade du syndic — 8 pages PDF. Elle forward le mail avec la pièce jointe à Septrion via WhatsApp. Ou, si elle est déjà dans l'app, elle utilise le bouton "+" pour uploader le PDF directement.

30 secondes plus tard, un signalement apparaît : titre "Devis ravalement façade — Entreprise Martin", urgence "normal", résumé avec le montant et les postes principaux. Louise n'a pas eu à lire les 8 pages. Elle qualifie, rattache au dossier "Ravalement façade" existant. Le devis rejoint la chronologie du dossier.

## Parcours 3 — David prépare le test pour un nouveau testeur

**David**, fondateur Septrion, responsable du setup.

David prépare le test d'un nouveau testeur. Il ingère des documents dummy (PV d'AG type, devis fictif, échange syndic simulé) via WhatsApp vers Septrion. Les signalements se créent automatiquement. Il les qualifie et crée les dossiers seed.

Quand le testeur ouvrira l'app après l'onboarding, il verra un dashboard déjà peuplé avec des dossiers représentatifs. Si le testeur veut ajouter ses propres vrais documents, il le peut via WhatsApp forward ou upload.

À mi-parcours du test (jour 2-3), David déclenche manuellement le digest pour tester la boucle de rétention.

## Parcours 4 — Louise fait évoluer le statut d'un dossier

Louise consulte le dossier "Fuite parking souterrain". Le plombier est intervenu, la fuite est réparée. Elle change le statut du dossier de "en cours" à "terminé". Le dossier reste consultable mais est visuellement distingué des dossiers actifs.

Autre cas : le syndic ne répond plus depuis 2 semaines sur le dossier "Ravalement façade". Louise le passe en "bloqué" et ajoute une note "Syndic injoignable depuis le 25 mars". Le dossier apparaît en évidence sur le dashboard comme nécessitant une action.

**Transitions possibles :**
- en cours → bloqué (problème identifié)
- en cours → terminé (sujet résolu)
- bloqué → en cours (problème débloqué)
- terminé → en cours (sujet rouvert)

## Parcours post-MVP (noté pour la suite)

- **Retrieval** — Louise retrouve une info en 10 secondes quand un voisin l'interpelle, copie le lien partageable et l'envoie dans le groupe WhatsApp de la copro. Le résident consulte le résumé sans app.
- **Document illisible** — Photo floue analysée par Claude Vision, résumé partiel, Louise complète manuellement. Gestion gracieuse des cas dégradés.

## Synthèse des capacités révélées

| Parcours | Capacités requises |
|----------|-------------------|
| 1 — Signalement entrant | Push notification, inbox signalements, qualification, création/rattachement dossier, notes internes, notification CS |
| 2 — Forward document | Ingestion WhatsApp + upload app, analyse IA (PDF), qualification, chronologie dossier |
| 3 — Setup testeur | Ingestion manuelle, qualification, pré-chargement seed (dummy), déclenchement digest manuel |
| 4 — Transition statut | Changement de statut dossier (en cours/bloqué/terminé), ajout de note contextuelle |

---
