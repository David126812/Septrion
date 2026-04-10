---
stepsCompleted:
  - "step-01-validate-prerequisites"
  - "step-02-design-epics"
  - "step-03-create-stories"
  - "step-04-final-validation"
status: 'complete'
completedAt: '2026-04-09'
inputDocuments:
  - "prd.md"
  - "architecture.md"
---

# Septrion - Epic Breakdown

## Overview

Ce document décompose les exigences du PRD et de l'Architecture en epics et stories implémentables pour le MVP Septrion.

## Requirements Inventory

### Functional Requirements

**Authentification (4)**
- FR1 : Le nouvel utilisateur peut créer un compte avec son email et un mot de passe
- FR2 : Le système peut lier le numéro WhatsApp (collecté à l'onboarding) au profil pour le matching des messages entrants
- FR3 : Un utilisateur authentifié peut se connecter avec son email + mot de passe
- FR4 : Un utilisateur authentifié peut rester connecté entre les sessions (persistance de session)

**Onboarding (6)**
- FR5 : Le nouvel utilisateur peut suivre un stepper séquentiel après inscription avant d'accéder au dashboard
- FR6 : L'utilisateur peut voir une explication visuelle du fonctionnement de Septrion
- FR7 : L'utilisateur peut recevoir les instructions d'installation PWA sur son écran d'accueil
- FR8 : L'utilisateur peut saisir son prénom, le nom de sa copropriété et le nombre de lots (sélecteur +/−)
- FR9 : L'utilisateur peut ajouter le contact Septrion WhatsApp à son téléphone
- FR10 : L'utilisateur peut envoyer son premier document via WhatsApp et voir le signalement apparaître en temps réel dans l'app

**Ingestion de Documents (8)**
- FR11 : Un utilisateur peut forwarder un document à l'agent WhatsApp Septrion (PDF, image, texte)
- FR12 : Un utilisateur peut créer un signalement depuis l'app via le bouton "+" — saisie manuelle des champs (titre, description, urgence, localisation)
- FR13 : Un utilisateur peut attacher un fichier (PDF, image) à un signalement créé depuis l'app — le fichier est stocké sans analyse IA
- FR14 : Un utilisateur peut déclencher l'auto-complétion IA sur un fichier attaché — les champs du formulaire se pré-remplissent (titre, urgence, localisation, résumé). L'utilisateur peut modifier avant soumission.
- FR15 : Le système peut limiter la taille des fichiers uploadés à 10MB
- FR16 : Le système peut analyser automatiquement chaque document et produire un titre, un niveau d'urgence, une localisation (si détectable), un résumé et une prochaine action recommandée
- FR17 : Le système peut traiter des documents de types variés : PDF, images/photos, texte brut WhatsApp
- FR18 : Le système peut créer automatiquement un signalement structuré dans l'inbox à partir de l'analyse IA

**Triage des Signalements (5)**
- FR19 : Un membre CS peut consulter la liste des signalements en attente de qualification
- FR20 : Un membre CS peut qualifier un signalement en créant un nouveau dossier
- FR21 : Un membre CS peut qualifier un signalement en le rattachant à un dossier existant
- FR22 : Un membre CS peut rejeter un signalement non pertinent
- FR23 : La page signalements peut se mettre à jour en temps réel quand un nouveau signalement arrive

**Gestion des Dossiers (6)**
- FR24 : Un membre CS peut consulter la liste de tous les dossiers
- FR25 : Un membre CS peut consulter le détail d'un dossier : résumé IA, niveau d'urgence, prochaine action
- FR26 : Un membre CS peut consulter la chronologie des événements d'un dossier
- FR27 : Un membre CS peut consulter les documents attachés à un dossier
- FR28 : Un membre CS peut voir le statut d'un dossier (en cours, bloqué, terminé)
- FR29 : Un membre CS peut changer le statut d'un dossier (en cours ↔ bloqué ↔ terminé)
- FR29b : Le système peut régénérer automatiquement le résumé IA d'un dossier quand un nouveau signalement y est rattaché — le résumé intègre l'ensemble des documents et événements du dossier

**Notifications & Communication (3)**
- FR30 : Le système peut envoyer automatiquement une notification WhatsApp + email au testeur quand un nouveau signalement arrive
- FR31 : Le système peut envoyer automatiquement une notification WhatsApp + email au testeur quand le digest est envoyé
- FR32 : Un membre CS peut initier un "partage" depuis un dossier — UI cosmétique avec choix "résidents" ou "CS uniquement", placeholders pré-remplis. Le testeur reçoit lui-même la notification (loop solo).

**Dashboard & Digest (4)**
- FR33 : Un membre CS peut consulter un dashboard avec remontée automatique des informations clés depuis les dossiers
- FR34 : Un administrateur peut déclencher manuellement l'envoi d'un digest au testeur
- FR35 : Le digest peut contenir un résumé IA des dossiers actifs, bloqués et des signalements en attente
- FR36 : Le digest peut être envoyé par WhatsApp + email

**Analytics (3)**
- FR37 : Le système peut identifier chaque utilisateur authentifié dans l'outil d'analytics
- FR38 : Le système peut traquer automatiquement les pages visitées et les interactions utilisateur
- FR39 : Le système peut enregistrer les events custom : signalement qualifié, dossier consulté, notification envoyée, document uploadé, digest cliqué

**Administration (2)**
- FR40 : Un administrateur peut ingérer des documents dummy via WhatsApp pour pré-charger des dossiers seed
- FR41 : Un administrateur peut qualifier et créer des dossiers à partir des signalements seed

**Conformité (3)**
- FR42 : L'utilisateur peut consulter la politique de confidentialité depuis l'app
- FR43 : L'utilisateur peut voir une mention visible que les résumés sont générés par IA
- FR44 : L'utilisateur peut donner son consentement explicite (opt-in) pour recevoir des notifications par WhatsApp et email lors de l'onboarding

**Assistant IA (4)**
- FR45 : Un membre CS peut poser une question à l'assistant IA par texte depuis l'app
- FR46 : Un membre CS peut poser une question à l'assistant IA par la voix depuis l'app
- FR47 : L'assistant IA peut rechercher dans les dossiers de la copropriété et fournir une réponse contextualisée (résumé, statut, dernière action, responsable)
- FR48 : L'assistant IA peut proposer des actions suite à une question (consulter le dossier, créer un signalement)

### NonFunctional Requirements

- NFR1 : Les documents uploadés et stockés ne sont pas accessibles publiquement sans lien direct
- NFR2 : Les communications entre l'app et le backend utilisent HTTPS
- NFR3 : Les appels à l'API d'analyse IA transmettent les documents via connexion chiffrée
- NFR4 : Les données personnelles sont traitées conformément au RGPD
- NFR5 : Aucun document n'est conservé côté fournisseur IA après analyse (API stateless)
- NFR6 : Le webhook WhatsApp doit traiter chaque message entrant sans perte
- NFR7 : Si l'analyse IA échoue, le signalement est créé avec un statut d'erreur plutôt que perdu
- NFR8 : Les notifications WhatsApp et email doivent être envoyées dans un délai raisonnable (minutes)
- NFR9 : Navigation fluide entre les pages, chargement sans attente perceptible
- NFR10 : L'analyse IA est asynchrone — le signalement apparaît quand il est prêt (temps réel)

### Additional Requirements (Architecture)

- AR1 : Supabase Auth avec email + mot de passe. Le numéro WhatsApp est collecté à l'onboarding (step profil). Matching sender_phone → profiles.whatsapp_phone → copro_id
- AR2 : Nouvelle table `coproprietes` (id, name, lots_count)
- AR3 : Nouvelle table `profiles` (id FK auth.users, first_name, copro_id FK, whatsapp_phone, email, notification_consent)
- AR4 : Ajout `copro_id` + `location` sur les tables existantes (dossiers, signalements, published_updates)
- AR5 : RLS par copropriété sur toutes les tables métier
- AR6 : 4 Edge Functions : whatsapp-webhook (adapter), analyze-document (créer), send-notification (créer), send-digest (créer)
- AR7 : Fonction partagée `analyzeMessage()` dans `_shared/` — pipeline IA utilisé par webhook et upload
- AR8 : Helpers partagés `sendWhatsApp.ts` et `sendEmail.ts` (Resend) dans `_shared/`
- AR9 : Hébergement Vercel avec config SPA rewrites
- AR10 : PWA manifest + Service Worker pour installabilité (sans push)
- AR11 : PostHog init dans main.tsx, identification après auth
- AR12 : Table `pending_dossiers` ignorée pour le MVP

### UX Design Requirements

Pas de document UX — les spécifications UX seront définies ultérieurement.

### FR Coverage Map

- FR1 → Epic 1 (Story 1.2) — Inscription email + mdp
- FR2 → Epic 1 (Story 1.2) + Epic 2 (Story 2.2) — Liaison WhatsApp (numéro collecté à l'onboarding)
- FR3 → Epic 1 (Story 1.3) — Connexion email + mdp
- FR4 → Epic 1 (Story 1.3) — Persistance session
- FR5 → Epic 2 (Story 2.1) — Stepper 5 étapes
- FR6 → Epic 2 (Story 2.1) — Explication visuelle
- FR7 → Epic 2 (Story 2.2) — Inscription + profil fusionnés
- FR8 → Epic 2 (Story 2.3) — Instructions PWA
- FR9 → Epic 2 (Story 2.4) — WhatsApp
- FR10 → Epic 2 (Story 2.5) — Premier document
- FR11 → Epic 3 (Story 3.1) — Forward WhatsApp
- FR12 → Epic 3 (Story 3.2) — Création manuelle in-app
- FR13 → Epic 3 (Story 3.3) — Pièce jointe sans IA
- FR14 → Epic 3 (Story 3.4) — Auto-complétion IA
- FR15 → Epic 3 (Story 3.3) — Limite 10MB
- FR16 → Epic 3 (Story 3.1) — Analyse IA
- FR17 → Epic 3 (Story 3.1) — Types variés
- FR18 → Epic 3 (Story 3.1) — Création signalement auto
- FR19 → Epic 4 (Story 4.1) — Liste signalements
- FR20 → Epic 4 (Story 4.2) — Qualifier → créer dossier
- FR21 → Epic 4 (Story 4.3) — Qualifier → rattacher
- FR22 → Epic 4 (Story 4.2) — Rejeter signalement
- FR23 → Epic 3 (Story 3.5) — Realtime signalements
- FR24 → Epic 4 (Story 4.4) — Liste dossiers
- FR25 → Epic 4 (Story 4.5) — Détail dossier
- FR26 → Epic 4 (Story 4.5) — Chronologie
- FR27 → Epic 4 (Story 4.5) — Documents attachés
- FR28 → Epic 4 (Story 4.6) — Statut dossier
- FR29 → Epic 4 (Story 4.6) — Transitions statut
- FR29b → Epic 4 (Story 4.7) — Résumé IA dynamique
- FR30 → Epic 5 (Story 5.1) — Notification nouveau signalement
- FR31 → Epic 5 (Story 5.2) — Notification digest
- FR32 → Epic 5 (Story 5.3) — Partage cosmétique
- FR33 → Epic 6 (Story 6.1) — Dashboard
- FR34 → Epic 6 (Story 6.2) — Déclenchement digest
- FR35 → Epic 6 (Story 6.2) — Résumé IA digest
- FR36 → Epic 6 (Story 6.2) — Envoi digest WhatsApp + email
- FR37 → Epic 7 (Story 7.1) — Identification analytics
- FR38 → Epic 7 (Story 7.1) — Autocapture
- FR39 → Epic 7 (Story 7.2) — Events custom
- FR40 → Epic 8 (Story 8.1) — Seed pré-chargé en base
- FR41 → Epic 8 (Story 8.1) — Dossiers seed prêts au lancement
- FR42 → Epic 1 (Story 1.5) — Politique de confidentialité
- FR43 → Epic 6 (Story 6.1) — Mention IA visible
- FR44 → Epic 2 (Story 2.2) — Opt-in notifications
- FR45 → Epic 9 (Story 9.2) — Chat texte
- FR46 → Epic 9 (Story 9.4) — Agent vocal (Whisper)
- FR47 → Epic 9 (Story 9.1) — Edge Function assistant-query (RAG)
- FR48 → Epic 9 (Story 9.3) — Actions contextuelles
- FR49 → Epic 9 (Story 9.3) — Suggestions et chips
- FR50 → Epic 2 (Story 2.2) / Epic X (Story X.2) — Nombre de lots (Settings)
- FR44 → Epic 2 (Story 2.2) — Opt-in notifications

### Structural Requirements (UX Spec / Architecture — non couverts par FRs)

- SR1 → Epic X (Story X.1) — Bottom Navigation globale (5 onglets, persistante)
- SR2 → Epic X (Story X.2) — Page Settings (profil, lots, notifications, privacy, déconnexion)
- SR3 → Epic X (Story X.3) — Auth guard conditionnel onboarding (redirect si non complété)
- SR4 → Epic X (Story X.4) — Migration 001 tables core (dossiers, signalements, published_updates)

## Epic List

### Epic 1: Infrastructure & Authentification
L'utilisateur peut accéder à l'app, créer un compte et se connecter.
**FRs couvertes:** FR1, FR2, FR3, FR4, FR42

### Epic 2: Onboarding & Configuration
L'utilisateur nouveau configure son profil, connecte WhatsApp, et envoie son premier document.
**FRs couvertes:** FR5, FR6, FR7, FR8, FR9, FR10, FR44

### Epic 3: Ingestion & Analyse IA
Les documents envoyés par WhatsApp ou depuis l'app sont analysés par l'IA et apparaissent comme signalements structurés.
**FRs couvertes:** FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR23

### Epic 4: Triage & Gestion des Dossiers
L'utilisateur peut qualifier les signalements et gérer le cycle de vie complet des dossiers.
**FRs couvertes:** FR19, FR20, FR21, FR22, FR24, FR25, FR26, FR27, FR28, FR29, FR29b

### Epic 5: Notifications & Communication
L'utilisateur reçoit des notifications automatiques et peut partager l'info depuis un dossier.
**FRs couvertes:** FR30, FR31, FR32

### Epic 6: Dashboard & Digest
L'utilisateur a une vue d'ensemble de ses dossiers et reçoit un résumé IA.
**FRs couvertes:** FR33, FR34, FR35, FR36, FR43

### Epic 7: Analytics
Le système trace l'activité des testeurs pour mesurer l'engagement.
**FRs couvertes:** FR37, FR38, FR39

### Epic 8: Seed & Administration
L'administrateur peut pré-charger des dossiers dummy pour que les testeurs démarrent avec un dashboard peuplé.
**FRs couvertes:** FR40, FR41

### Epic 9: Assistant IA (Chat & Vocal)
L'utilisateur peut interroger l'assistant IA pour retrouver rapidement une information sur ses dossiers, par texte ou par voix.
**FRs couvertes:** FR45, FR46, FR47, FR48, FR49

### Epic X: Composants Structurants
Composants transversaux identifiés par le UX spec et l'architecture mais non couverts par les epics initiaux. Requis pour une app fonctionnelle.
**SRs couvertes:** SR1, SR2, SR3, SR4 — **FR50** (Settings/lots)

## Epic 1: Infrastructure & Authentification

L'utilisateur peut accéder à l'app, créer un compte et se connecter.

### Story 1.1: Déploiement Vercel & PWA

As a **utilisateur**,
I want **accéder à l'app depuis une URL et l'installer sur mon écran d'accueil**,
So that **j'ai un accès rapide comme une app native**.

**Acceptance Criteria:**

**Given** l'app est buildée avec Vite
**When** un push est fait sur la branche main
**Then** Vercel déploie automatiquement et l'app est accessible via l'URL
**And** le `manifest.json` est présent avec nom, icônes (192, 512), `display: standalone`
**And** le Service Worker est enregistré pour l'installabilité
**And** le `vercel.json` redirige toutes les routes vers `index.html` (SPA)

### Story 1.2: Inscription par email + mot de passe

As a **nouvel utilisateur**,
I want **créer un compte avec mon email et un mot de passe**,
So that **je peux accéder à Septrion de manière sécurisée**.

**Acceptance Criteria:**

**Given** l'utilisateur est sur la page `/auth`
**When** il saisit son email et un mot de passe et clique "S'inscrire"
**Then** un compte est créé dans Supabase Auth (email + password)
**And** les tables `coproprietes` et `profiles` sont créées si elles n'existent pas (migration)
**And** un profil est créé dans `profiles` avec l'email (le numéro WhatsApp sera collecté à l'onboarding)
**And** l'utilisateur est redirigé vers l'onboarding
**And** en cas d'erreur (email déjà utilisé, mdp trop court), un message explicite s'affiche

### Story 1.3: Connexion & persistance de session

As a **utilisateur existant**,
I want **me connecter avec mon email + mot de passe et rester connecté**,
So that **je n'ai pas à me reconnecter à chaque visite**.

**Acceptance Criteria:**

**Given** l'utilisateur a un compte existant
**When** il saisit ses identifiants sur `/auth` et clique "Se connecter"
**Then** la session Supabase Auth est créée (JWT)
**And** l'utilisateur est redirigé vers `/dashboard` (ou `/onboarding` si pas complété)
**And** à la prochaine visite, la session est restaurée automatiquement sans re-login
**And** un `AuthGuard` protège toutes les routes sauf `/auth` — redirection si non connecté

### Story 1.4: RLS par copropriété

As a **membre CS**,
I want **ne voir que les données de ma copropriété**,
So that **les données sont isolées entre copropriétés**.

**Acceptance Criteria:**

**Given** les tables `dossiers`, `signalements`, `published_updates` ont un champ `copro_id`
**When** l'utilisateur authentifié fait une requête Supabase
**Then** le RLS filtre automatiquement par `copro_id` via `auth.uid() → profiles.copro_id`
**And** un utilisateur ne peut pas voir ni modifier les données d'une autre copropriété

### Story 1.5: Politique de confidentialité

As a **utilisateur**,
I want **consulter la politique de confidentialité**,
So that **je sais comment mes données sont traitées**.

**Acceptance Criteria:**

**Given** l'utilisateur est connecté
**When** il accède à la politique de confidentialité (lien en footer ou Settings)
**Then** une page affiche les informations RGPD (données collectées, finalités, durée, droits, sous-traitants)

## Epic 2: Onboarding & Configuration

L'utilisateur nouveau configure son profil, connecte WhatsApp, et envoie son premier document.

### Story 2.1: Stepper & explication visuelle

As a **nouvel utilisateur**,
I want **comprendre le fonctionnement de Septrion avant de commencer**,
So that **je sais à quoi m'attendre**.

**Acceptance Criteria:**

**Given** l'utilisateur vient de s'inscrire et arrive sur `/onboarding`
**When** la page se charge
**Then** un stepper affiche la progression (étape 1/5)
**And** l'écran d'explication visuelle montre le flow : document → WhatsApp/app → dossier structuré
**And** un bouton "Suivant" permet de passer à l'étape 2

### Story 2.2: Inscription + profil fusionnés & opt-in

As a **nouvel utilisateur**,
I want **créer mon compte et renseigner mon profil en une seule étape**,
So that **je suis opérationnel rapidement**.

**Acceptance Criteria:**

**Given** l'utilisateur est à l'étape 2 du stepper
**When** il remplit le formulaire fusionné
**Then** les champs affichés sont : prénom, numéro WhatsApp (format international, +33), nom de copropriété, checkbox opt-in notifications
**And** le formulaire collecte le profil (le compte email+mdp a déjà été créé sur `/auth`)
**And** une entrée `coproprietes` est créée si elle n'existe pas
**And** le `profiles` est mis à jour avec `first_name`, `copro_id`, `whatsapp_phone`, `notification_consent`
**And** PostHog identifie l'utilisateur : `posthog.identify(user.id)` + `posthog.group('copro', copro_name)`
**And** en cas d'erreur, un message explicite s'affiche

### Story 2.3: Instructions d'installation PWA

As a **nouvel utilisateur**,
I want **savoir comment installer l'app sur mon écran d'accueil**,
So that **j'ai un accès rapide à Septrion**.

**Acceptance Criteria:**

**Given** l'utilisateur est à l'étape 3 du stepper
**When** la page se charge
**Then** les instructions iOS (Partager → Sur l'écran d'accueil) et Android (Menu → Installer) sont affichées
**And** un bouton "C'est fait" permet de passer à l'étape suivante

### Story 2.4: Explication WhatsApp

As a **nouvel utilisateur**,
I want **comprendre comment envoyer des documents à Septrion via WhatsApp**,
So that **je sais utiliser le canal principal d'ingestion**.

**Acceptance Criteria:**

**Given** l'utilisateur est à l'étape 4 du stepper
**When** la page se charge
**Then** un contenu explicatif (texte, image ou vidéo) montre comment ajouter le contact Septrion et lui forwarder un document
**And** le numéro WhatsApp Septrion est affiché avec un bouton "Copier le numéro"
**And** un bouton "Suivant" permet de passer à l'étape suivante

### Story 2.5: Premier document ou exploration

As a **nouvel utilisateur**,
I want **créer mon premier signalement ou explorer l'app directement**,
So that **je commence à utiliser Septrion immédiatement**.

**Acceptance Criteria:**

**Given** l'utilisateur est à l'étape 5 du stepper
**When** la page se charge
**Then** trois options sont présentées :
1. **"Uploader un document"** — ouvre le sélecteur de fichier, le document est ingéré via le pipeline IA (Edge Function `analyze-document`), le signalement apparaît dans l'inbox
2. **"Utiliser un document exemple"** — un document dummy est uploadé via le même pipeline in-app (pas de WhatsApp), le signalement apparaît dans l'inbox
3. **"Explorer d'abord"** — redirige vers le dashboard avec les dossiers seed
**And** dans les 3 cas, le flag `onboarding_completed` est enregistré dans le profil
**And** l'utilisateur est redirigé vers la page signalements (options 1 et 2) ou le dashboard (option 3)

## Epic 3: Ingestion & Analyse IA

Les documents envoyés par WhatsApp ou depuis l'app sont analysés par l'IA et apparaissent comme signalements structurés.

### Story 3.1: Pipeline IA partagé

As a **développeur**,
I want **une fonction d'analyse IA réutilisable**,
So that **le webhook WhatsApp et l'upload app utilisent le même pipeline**.

**Acceptance Criteria:**

**Given** un document (PDF, image ou texte) est stocké dans Supabase Storage
**When** `analyzeMessage()` est appelée avec l'URL du document
**Then** l'IA analyse le contenu et retourne un JSON structuré : `name`, `urgency`, `location` (nullable), `nextStep`, `summary`
**And** la fonction traite les PDF, images/photos et texte brut
**And** si l'IA ne détecte pas de localisation, `location` retourne `null`
**And** si l'analyse échoue (timeout, document corrompu), la fonction retourne un objet d'erreur (pas d'exception silencieuse)
**And** la fonction est dans `supabase/functions/_shared/analyzeMessage.ts`

### Story 3.2: Webhook WhatsApp → signalement

As a **membre CS**,
I want **forwarder un document par WhatsApp et le retrouver dans l'app**,
So that **l'info entre sans effort dans Septrion**.

**Acceptance Criteria:**

**Given** un utilisateur enregistré a envoyé un message WhatsApp au numéro Septrion
**When** le webhook reçoit le message
**Then** le `sender_phone` est matché avec `profiles.whatsapp_phone` pour identifier le `copro_id`
**And** le fichier est uploadé dans Supabase Storage
**And** `analyzeMessage()` est appelée (Story 3.1)
**And** un signalement est inséré dans `signalements` avec `copro_id`, `name`, `urgency`, `location`, `summary`, `next_step`, `document_url`, `raw_analysis`, `status: 'nouveau'`
**And** si le `sender_phone` ne correspond à aucun profil, le message est ignoré avec un log d'erreur
**And** la limite de 10MB est appliquée — si dépassée, un signalement d'erreur est créé

### Story 3.3: Création manuelle in-app

As a **membre CS**,
I want **créer un signalement manuellement depuis l'app**,
So that **je peux signaler un problème même sans document**.

**Acceptance Criteria:**

**Given** l'utilisateur est connecté et clique sur le bouton "+"
**When** la page "Signaler un incident" s'affiche
**Then** un formulaire est présenté avec : titre, description, localisation (liste de choix)
**And** l'utilisateur peut soumettre le formulaire sans fichier
**And** un signalement est inséré dans `signalements` avec `copro_id`, les champs saisis, `urgency: 'normal'` par défaut, `status: 'nouveau'`

### Story 3.4: Upload fichier comme pièce jointe (sans IA)

As a **membre CS**,
I want **attacher un fichier à mon signalement sans déclencher l'IA**,
So that **le document est conservé comme pièce justificative**.

**Acceptance Criteria:**

**Given** l'utilisateur est sur la page "Signaler un incident"
**When** il sélectionne un fichier (PDF, image) via le bouton d'upload
**Then** le fichier est uploadé dans Supabase Storage
**And** le `document_url` est attaché au signalement
**And** la taille est limitée à 10MB — si dépassée, un message d'erreur s'affiche
**And** l'IA n'est PAS déclenchée — les champs restent vides ou manuellement remplis

### Story 3.5: Auto-complétion IA sur fichier attaché

As a **membre CS**,
I want **demander à l'IA d'analyser mon fichier pour pré-remplir le formulaire**,
So that **je n'ai pas à tout saisir moi-même**.

**Acceptance Criteria:**

**Given** l'utilisateur a attaché un fichier sur la page "Signaler un incident"
**When** il clique sur "Analyser avec l'IA"
**Then** l'Edge Function `analyze-document` est appelée avec le fichier
**And** `analyzeMessage()` retourne le JSON structuré
**And** les champs du formulaire se pré-remplissent : titre, localisation, description/résumé
**And** l'utilisateur peut modifier tous les champs pré-remplis avant soumission
**And** un indicateur de chargement est visible pendant l'analyse
**And** si l'analyse échoue, un toast d'erreur s'affiche et les champs restent modifiables manuellement

### Story 3.6: Mise à jour temps réel des signalements

As a **membre CS**,
I want **voir les nouveaux signalements apparaître en temps réel**,
So that **je suis au courant immédiatement quand un document arrive**.

**Acceptance Criteria:**

**Given** l'utilisateur est sur la page signalements
**When** un nouveau signalement est inséré dans la table `signalements` pour son `copro_id`
**Then** le signalement apparaît automatiquement dans la liste sans rafraîchir la page
**And** la souscription Supabase Realtime est active avec cleanup au démontage du composant

## Epic 4: Triage & Gestion des Dossiers

L'utilisateur peut qualifier les signalements et gérer le cycle de vie complet des dossiers.

### Story 4.1: Inbox signalements

As a **membre CS**,
I want **consulter la liste des signalements en attente**,
So that **je vois ce qui est arrivé et ce que je dois traiter**.

**Acceptance Criteria:**

**Given** l'utilisateur est connecté
**When** il accède à la page signalements
**Then** la liste des signalements avec `status: 'nouveau'` pour son `copro_id` est affichée
**And** chaque signalement affiche : titre, urgence, localisation (si disponible), date, résumé
**And** les signalements sont triés par date (plus récent en haut)

### Story 4.2: Qualifier un signalement → créer un dossier

As a **membre CS**,
I want **transformer un signalement en nouveau dossier**,
So that **le sujet est formellement suivi**.

**Acceptance Criteria:**

**Given** l'utilisateur consulte un signalement avec `status: 'nouveau'`
**When** il clique "Créer un dossier"
**Then** un nouveau dossier est créé dans `dossiers` avec `copro_id`, `name`, `urgency`, `status: 'en_cours'`, le résumé IA comme description, la `next_step` recommandée
**And** le signalement est mis à jour avec `status: 'qualifie'` et `dossier_id` = nouveau dossier
**And** le document du signalement est rattaché au dossier
**And** un premier événement est ajouté à la timeline du dossier
**And** l'utilisateur peut aussi cliquer "Rejeter" — le signalement passe en `status: 'rejete'`

### Story 4.3: Qualifier un signalement → rattacher à un dossier existant

As a **membre CS**,
I want **rattacher un signalement à un dossier qui existe déjà**,
So that **l'information s'accumule au bon endroit**.

**Acceptance Criteria:**

**Given** l'utilisateur consulte un signalement avec `status: 'nouveau'`
**When** il clique "Rattacher à un dossier"
**Then** la liste des dossiers existants de sa copro s'affiche
**And** il sélectionne le dossier cible
**And** le signalement passe en `status: 'qualifie'` avec `dossier_id` = dossier sélectionné
**And** le document du signalement est rattaché au dossier
**And** un nouvel événement est ajouté à la timeline du dossier
**And** le résumé IA du dossier est régénéré automatiquement (appel `regenerateDossierSummary()`)

### Story 4.4: Liste des dossiers

As a **membre CS**,
I want **consulter la liste de tous mes dossiers**,
So that **j'ai une vue d'ensemble des sujets de la copro**.

**Acceptance Criteria:**

**Given** l'utilisateur est connecté
**When** il accède à la page dossiers
**Then** la liste des dossiers pour son `copro_id` est affichée
**And** chaque dossier affiche : titre, statut (badge coloré en_cours/bloqué/terminé), urgence, dernière mise à jour
**And** les dossiers sont triés par `updated_at` (plus récent en haut)

### Story 4.5: Détail d'un dossier

As a **membre CS**,
I want **consulter le détail complet d'un dossier**,
So that **je retrouve toute l'information au même endroit**.

**Acceptance Criteria:**

**Given** l'utilisateur clique sur un dossier dans la liste
**When** la page de détail se charge
**Then** le résumé IA du dossier est affiché (encart principal)
**And** le niveau d'urgence et la prochaine action recommandée sont visibles
**And** la chronologie des événements est affichée (timeline)
**And** les documents attachés sont listés avec possibilité de les consulter
**And** le statut actuel du dossier est affiché

### Story 4.6: Transitions de statut

As a **membre CS**,
I want **changer le statut d'un dossier**,
So that **le suivi reflète la réalité du terrain**.

**Acceptance Criteria:**

**Given** l'utilisateur est sur le détail d'un dossier
**When** il clique sur le bouton de changement de statut
**Then** les transitions possibles sont proposées : en cours → bloqué, en cours → terminé, bloqué → en cours, terminé → en cours
**And** le statut est mis à jour dans la base
**And** un événement de changement de statut est ajouté à la timeline
**And** le dossier terminé reste consultable mais est visuellement distingué
**And** le dossier bloqué apparaît en évidence sur le dashboard

### Story 4.7: Résumé IA dynamique

As a **membre CS**,
I want **que le résumé du dossier se mette à jour automatiquement quand j'ajoute des documents**,
So that **le résumé reflète toujours l'état complet du dossier**.

**Acceptance Criteria:**

**Given** un signalement est rattaché à un dossier existant (Story 4.3)
**When** le rattachement est confirmé
**Then** `regenerateDossierSummary()` est appelée avec le contexte complet du dossier (tous les signalements, documents, timeline)
**And** le résumé IA et la prochaine action sont régénérés par l'IA
**And** le nouveau résumé remplace l'ancien dans le dossier
**And** un indicateur de chargement est visible pendant la régénération
**And** si la régénération échoue, l'ancien résumé est conservé et un toast d'erreur s'affiche

## Epic 5: Notifications & Communication

L'utilisateur reçoit des notifications automatiques et peut partager l'info depuis un dossier.

### Story 5.1: Helpers d'envoi WhatsApp + email

As a **développeur**,
I want **des helpers réutilisables pour envoyer des notifications**,
So that **toutes les Edge Functions utilisent le même canal de notification**.

**Acceptance Criteria:**

**Given** une Edge Function doit envoyer une notification
**When** elle appelle `sendWhatsApp(phone, templateData)` ou `sendEmail(email, subject, body)`
**Then** `sendWhatsApp.ts` envoie un message via WhatsApp Business API avec le template pré-approuvé Meta
**And** `sendEmail.ts` envoie un email via l'API Resend
**And** les deux helpers sont dans `supabase/functions/_shared/`
**And** en cas d'échec d'un canal, l'autre canal est quand même tenté (pas de fail total)
**And** les envois sont loggés pour le debugging

### Story 5.2: Notification automatique — nouveau signalement

As a **membre CS**,
I want **être notifié quand un nouveau signalement arrive**,
So that **je suis au courant immédiatement**.

**Acceptance Criteria:**

**Given** un nouveau signalement est créé (via WhatsApp ou upload app)
**When** l'insertion dans `signalements` est confirmée
**Then** l'Edge Function `send-notification` est appelée
**And** le testeur reçoit un WhatsApp avec le titre du signalement, l'urgence et un lien vers l'app
**And** le testeur reçoit un email avec les mêmes informations
**And** seul le testeur est notifié (loop solo MVP)
**And** si le testeur n'a pas donné son consentement (`notification_consent: false`), aucune notification n'est envoyée

### Story 5.3: Partage cosmétique depuis un dossier

As a **membre CS**,
I want **partager l'info d'un dossier aux résidents ou au CS**,
So that **je communique facilement sur l'avancement d'un sujet**.

**Acceptance Criteria:**

**Given** l'utilisateur est sur le détail d'un dossier
**When** il clique sur "Partager"
**Then** une UI de partage s'affiche avec deux options : "Aux résidents" ou "Au CS uniquement"
**And** un message pré-rempli avec des placeholders exemples est proposé (titre du dossier, résumé, statut)
**And** l'utilisateur peut modifier le message avant d'envoyer
**When** il clique "Envoyer"
**Then** le testeur reçoit lui-même la notification WhatsApp + email (loop solo)
**And** un écran de confirmation s'affiche ("Message envoyé")

## Epic 6: Dashboard & Digest

L'utilisateur a une vue d'ensemble de ses dossiers et reçoit un résumé IA.

### Story 6.1: Dashboard avec remontée automatique

As a **membre CS**,
I want **voir un tableau de bord avec les informations clés de ma copro**,
So that **je sais où en sont les choses en un coup d'oeil**.

**Acceptance Criteria:**

**Given** l'utilisateur est connecté et arrive sur `/dashboard`
**When** la page se charge
**Then** le header affiche le nom de la copropriété et le prénom de l'utilisateur (depuis `profiles`)
**And** les quick actions (Signaler un incident, Dossiers, Signalements) sont fonctionnels avec le badge de count signalements `nouveau`
**And** la carte "Parler à l'assistant" est fonctionnelle et redirige vers la page assistant IA
**And** la section "Activité récente" remonte les derniers événements depuis les dossiers du `copro_id`
**And** la section "Prochains événements" affiche des données dummy clairement identifiées (badge "Exemple") — le bouton "Créer un événement" est visible avec badge "Prochainement"
**And** une mention visible indique que les résumés sont générés par IA

### Story 6.2: Digest — résumé IA via Supabase

As a **administrateur**,
I want **déclencher l'envoi d'un digest au testeur**,
So that **le testeur reçoit un point de situation de sa copro**.

**Acceptance Criteria:**

**Given** l'administrateur appelle l'Edge Function `send-digest` (via Supabase dashboard ou curl)
**When** la fonction est exécutée avec un `copro_id`
**Then** elle requête les dossiers actifs, bloqués et les signalements en attente pour le `copro_id`
**And** le contexte est envoyé à l'IA qui génère un résumé en 3-5 lignes
**And** le digest est envoyé au testeur par WhatsApp + email
**And** si la génération IA ou l'envoi échoue, une erreur est retournée dans les logs

## Epic 7: Analytics

Le système trace l'activité des testeurs pour mesurer l'engagement.

### Story 7.1: Initialisation PostHog & identification

As a **product owner**,
I want **identifier chaque testeur dans l'outil d'analytics**,
So that **je peux mesurer l'engagement individuel et par copro**.

**Acceptance Criteria:**

**Given** l'app se charge dans `main.tsx`
**When** PostHog est initialisé
**Then** `posthog.init()` est appelé avec la clé API et le host EU
**And** après authentification, `posthog.identify(user.id)` est appelé
**And** `posthog.group('copro', copro_name)` associe l'utilisateur à sa copro
**And** l'autocapture est activé — chaque clic sur bouton, changement de route est tracké automatiquement

### Story 7.2: Events custom

As a **product owner**,
I want **traquer les actions clés des testeurs**,
So that **je peux mesurer les métriques de succès du MVP**.

**Acceptance Criteria:**

**Given** l'analytics est initialisé (Story 7.1)
**When** un testeur effectue une action clé
**Then** un event custom PostHog est enregistré :
- `signalement_qualified` — quand un signalement est transformé en dossier
- `dossier_viewed` — quand un dossier est consulté
- `notification_sent` — quand une notification WhatsApp/email est envoyée
- `document_uploaded` — quand un fichier est ajouté depuis l'app
- `digest_clicked` — quand le testeur ouvre l'app depuis une notification de digest

## Epic 8: Seed & Administration

L'administrateur peut pré-charger des dossiers dummy pour que les testeurs démarrent avec un dashboard peuplé.

### Story 8.1: Pré-chargement de dossiers seed

As a **administrateur**,
I want **que des dossiers dummy soient présents au lancement de l'app**,
So that **le testeur démarre avec un dashboard peuplé et vit le moment retrieval**.

**Acceptance Criteria:**

**Given** l'app est déployée pour une nouvelle copro test
**When** le testeur se connecte après l'onboarding
**Then** des dossiers seed sont déjà présents dans la base pour son `copro_id` (PV d'AG type, devis fictif, échange syndic simulé)
**And** les dossiers seed ont des signalements, timelines et documents attachés réalistes
**And** les dossiers seed sont clairement identifiables comme contenu de démonstration (badge "Exemple")
**And** les seed sont insérés via un script SQL ou une migration, pas via WhatsApp

## Epic 9: Assistant IA (Chat & Vocal)

L'utilisateur peut interroger l'assistant IA pour retrouver rapidement une information sur ses dossiers, par texte ou par voix.

### Story 9.1: Edge Function assistant-query (prompt RAG)

As a **développeur**,
I want **une Edge Function qui répond aux questions en contexte**,
So that **l'assistant IA a accès aux dossiers de la copro pour répondre**.

**Acceptance Criteria:**

**Given** une question utilisateur est envoyée à l'Edge Function `assistant-query` avec un `copro_id`
**When** la fonction est exécutée
**Then** elle charge tous les dossiers et signalements du `copro_id` (titres, résumés, statuts, urgences, timelines, dernières actions)
**And** elle construit un prompt RAG avec le contexte + la question
**And** elle appelle Claude Sonnet et retourne un JSON : `{ response, matched_dossiers: [{id, name, status}], suggested_actions: [{type, label, target}] }`
**And** si aucun dossier ne correspond, `matched_dossiers` est vide et la réponse le mentionne
**And** la fonction est dans `supabase/functions/assistant-query/`

### Story 9.2: Interface chat texte

As a **membre CS**,
I want **poser une question par texte à l'assistant IA**,
So that **je retrouve l'info sur un dossier sans chercher manuellement**.

**Acceptance Criteria:**

**Given** l'utilisateur est sur la page `/assistant`
**When** il tape une question dans le champ de saisie et envoie
**Then** le message apparaît dans une bulle user (droite, fond primary)
**And** un typing indicator s'affiche (3 dots animés bounce staggeré) pendant l'appel à `assistant-query`
**And** la réponse de l'assistant apparaît avec animation (fade-in slide-in-from-left)
**And** le délai du typing est proportionnel à la longueur de la réponse : `Math.min(1800, Math.max(700, text.length * 6))` ms
**And** l'utilisateur peut poser des questions de suivi dans le même fil
**And** l'historique est en mémoire React (stateless, pas de persistance)

### Story 9.3: Suggestions, chips & actions contextuelles

As a **membre CS**,
I want **voir des suggestions de questions et des actions après chaque réponse**,
So that **je sais quoi demander et je passe à l'action en un tap**.

**Acceptance Criteria:**

**Given** l'assistant vient de répondre
**When** la réponse contient des dossiers identifiés (`matched_dossiers`)
**Then** des boutons d'action s'affichent sous la réponse (pleine largeur, icône + label + description + chevron) : "Consulter le dossier", "Créer un signalement"
**And** au tap sur "Consulter le dossier", l'utilisateur est redirigé vers `/dossiers/:id`
**And** si aucun dossier ne correspond, l'assistant propose "Créer un signalement"
**Given** c'est le premier lancement de l'assistant
**When** la page se charge
**Then** un message de bienvenue s'affiche + des chips de suggestions : "Où en est l'ascenseur ?", "Quels dossiers sont bloqués ?", "Résume la situation"
**And** le tap sur un chip envoie la question comme si l'utilisateur l'avait tapée

### Story 9.4: Agent vocal (Whisper)

As a **membre CS**,
I want **poser une question par la voix**,
So that **je peux utiliser l'assistant en mains libres**.

**Acceptance Criteria:**

**Given** l'utilisateur est sur la page `/assistant` en état idle (pas de conversation)
**When** il appuie sur le bouton micro central (w-24 h-24)
**Then** le bouton passe en mode enregistrement : scale-110, bg-primary, shadow glow bleu, icône micro pulsante
**And** le texte affiche "Je vous écoute…"
**When** l'enregistrement se termine (release ou timeout)
**Then** l'audio est envoyé à l'API Whisper pour transcription
**And** le texte transcrit est traité comme un message texte (même pipeline que Story 9.2)
**And** en état de conversation (après la première question), le micro est dans la barre de saisie sticky en bas

### Story 9.5: Animations et transitions (ref jhgu)

As a **membre CS**,
I want **une expérience fluide et engageante avec l'assistant**,
So that **l'interaction se sent naturelle et pas robotique**.

**Acceptance Criteria:**

**Given** l'assistant répond à une question
**When** la réponse arrive
**Then** les bulles agent apparaissent avec `animate-in fade-in slide-in-from-left-2 duration-300`
**And** le typing indicator utilise 3 dots avec `animate-bounce` et delays staggerés (0ms, 150ms, 300ms)
**And** les chips/actions apparaissent uniquement sur le dernier message agent
**And** en état idle : grand bouton micro central avec sous-texte explicatif
**And** les success screens (après action) utilisent un overlay plein écran avec check vert + titre + CTA
**And** les transitions entre états (idle → conversation → actions) sont fluides sans flash

## Epic X: Composants Structurants

Composants transversaux identifiés par le UX spec et l'architecture mais non couverts par les epics initiaux.

### Story X.1: Bottom Navigation globale

As a **utilisateur**,
I want **naviguer entre les sections principales de l'app**,
So that **j'accède à tout en un tap depuis n'importe quelle page**.

**Acceptance Criteria:**

**Given** l'utilisateur est connecté et a complété l'onboarding
**When** il est sur n'importe quelle page protégée
**Then** une bottom navigation persistante affiche 5 onglets : Dashboard (icône maison), Dossiers (icône dossier), "+" central (bouton primaire → `/signaler-incident`), Signalements (icône inbox + badge count), Assistant IA (icône micro/chat)
**And** l'onglet actif est highlighté
**And** le badge count des signalements "nouveau" se met à jour en temps réel
**And** la bottom nav n'apparaît PAS sur `/auth` et `/onboarding`
**And** les touch targets font minimum 44px

### Story X.2: Page Settings

As a **utilisateur**,
I want **modifier mes préférences et consulter mon profil**,
So that **je contrôle mes notifications et mes infos**.

**Acceptance Criteria:**

**Given** l'utilisateur est connecté
**When** il accède à `/settings`
**Then** son profil s'affiche en lecture seule (prénom, copropriété)
**And** il peut modifier le nombre de lots (sélecteur +/−, update `profiles`)
**And** il peut toggler les notifications (update `notification_consent`)
**And** un lien vers la politique de confidentialité est visible
**And** une mention IA est affichée
**And** un bouton "Déconnexion" appelle `supabase.auth.signOut()` et redirige vers `/auth`

### Story X.3: Auth guard conditionnel onboarding

As a **système**,
I want **rediriger vers l'onboarding si non complété**,
So that **les nouveaux utilisateurs passent par la configuration avant d'accéder à l'app**.

**Acceptance Criteria:**

**Given** un utilisateur est authentifié
**When** l'AuthGuard vérifie l'accès à une route protégée
**Then** le système query `profiles.onboarding_completed`
**And** si `false` ou `null` → redirect `/onboarding`
**And** si `true` → render children (accès normal)
**And** la colonne `onboarding_completed` (boolean, default false) existe dans `profiles` via migration

### Story X.4: Migration 001 — tables core

As a **développeur**,
I want **créer les tables core dans les migrations SQL**,
So that **le schéma DB est complet, versionné et déployable**.

**Acceptance Criteria:**

**Given** une instance Supabase vierge
**When** les migrations sont exécutées en ordre
**Then** les tables `dossiers`, `signalements`, `published_updates` sont créées avec le schéma complet défini dans l'architecture
**And** RLS est activé sur les 3 tables
**And** les migrations suivantes (004 copro_id, 006 RLS policies) s'appliquent correctement
