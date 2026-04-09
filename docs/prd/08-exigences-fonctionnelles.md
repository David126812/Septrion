# Exigences Fonctionnelles

**Partie 8/9** | [Sommaire](./00-sommaire-prd.md) | [Document complet](../prd.md)

---

## Onboarding

- **FR1 :** Le nouvel utilisateur peut suivre un flow de 5 écrans séquentiels avant d'accéder au dashboard
- **FR2 :** L'utilisateur peut voir une explication visuelle du fonctionnement de Septrion (écran 1)
- **FR3 :** L'utilisateur peut recevoir les instructions d'installation PWA sur son écran d'accueil (écran 2)
- **FR4 :** L'utilisateur peut saisir son prénom et le nom de sa copropriété (écran 3)
- **FR5 :** L'utilisateur peut ajouter le contact Septrion WhatsApp à son téléphone (écran 4)
- **FR6 :** L'utilisateur peut envoyer son premier document via WhatsApp et voir le signalement apparaître en temps réel dans l'app (écran 5)

## Ingestion de Documents

- **FR7 :** Un utilisateur peut forwarder un document à l'agent WhatsApp Septrion (PDF, image, texte)
- **FR8 :** Un utilisateur peut uploader un document depuis l'app via le bouton "+" (PDF, image)
- **FR9 :** Le système peut limiter la taille des fichiers uploadés à 10MB
- **FR10 :** Le système peut analyser automatiquement chaque document ingéré via l'IA (Claude Sonnet) et produire un titre, un niveau d'urgence, un résumé et une prochaine action recommandée
- **FR11 :** Le système peut traiter des documents de types variés : PDF, images/photos, texte brut WhatsApp
- **FR12 :** Le système peut créer automatiquement un signalement structuré dans l'inbox à partir de l'analyse IA

## Triage des Signalements

- **FR13 :** Un membre CS peut consulter la liste des signalements en attente de qualification
- **FR14 :** Un membre CS peut qualifier un signalement en créant un nouveau dossier
- **FR15 :** Un membre CS peut qualifier un signalement en le rattachant à un dossier existant
- **FR16 :** Un membre CS peut rejeter un signalement non pertinent
- **FR17 :** La page signalements peut se mettre à jour en temps réel quand un nouveau signalement arrive

## Gestion des Dossiers

- **FR18 :** Un membre CS peut consulter la liste de tous les dossiers
- **FR19 :** Un membre CS peut consulter le détail d'un dossier : résumé IA, niveau d'urgence, prochaine action
- **FR20 :** Un membre CS peut consulter la chronologie des événements d'un dossier
- **FR21 :** Un membre CS peut consulter les documents attachés à un dossier
- **FR22 :** Un membre CS peut ajouter une note interne à un dossier
- **FR23 :** Un membre CS peut voir le statut d'un dossier (en cours, bloqué, terminé)

## Notifications & Communication

- **FR24 :** Un membre CS peut envoyer une notification push aux autres membres CS depuis un dossier
- **FR25 :** Le système peut envoyer une notification WhatsApp sortante aux membres CS (fallback push) avec les mêmes infos + lien vers l'app
- **FR26 :** Un membre CS peut recevoir une push notification quand un nouveau signalement arrive
- **FR27 :** Un membre CS peut initier un partage de dossier et voir un écran de confirmation (flux UI uniquement, pas de livraison côté résident pour le MVP)

## Dashboard & Digest

- **FR28 :** Un membre CS peut consulter un dashboard avec les événements récents, les mises à jour et des accès rapides
- **FR29 :** Un administrateur peut déclencher manuellement l'envoi d'un digest aux membres CS
- **FR30 :** Le digest peut contenir un résumé IA des dossiers actifs, bloqués et des signalements en attente
- **FR31 :** Le digest peut être envoyé sous forme de push notification et de notification WhatsApp

## Analytics

- **FR32 :** Le système peut identifier chaque utilisateur dans PostHog via son prénom et sa copropriété
- **FR33 :** Le système peut traquer automatiquement les pages visitées et les interactions (autocapture)
- **FR34 :** Le système peut enregistrer les events custom : signalement qualifié, dossier consulté, notification envoyée, lien partagé, document uploadé, digest cliqué

## Administration (Setup Testeur)

- **FR35 :** Un administrateur peut ingérer des documents dummy via WhatsApp pour pré-charger des dossiers seed
- **FR36 :** Un administrateur peut qualifier et créer des dossiers à partir des signalements seed

## Conformité

- **FR37 :** L'utilisateur peut consulter la politique de confidentialité depuis l'app
- **FR38 :** L'utilisateur peut voir une mention visible que les résumés sont générés par IA
- **FR39 :** L'utilisateur peut donner son consentement explicite opt-in pour les notifications push

---
