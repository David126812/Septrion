---
stepsCompleted:
  - "step-01-init"
  - "step-02-discovery"
  - "step-02b-vision"
  - "step-02c-executive-summary"
  - "step-03-success"
  - "step-04-journeys"
  - "step-05-domain"
  - "step-06-innovation"
  - "step-07-project-type"
  - "step-08-scoping"
  - "step-09-functional"
  - "step-10-nonfunctional"
  - "step-11-polish"
  - "step-12-complete"
classification:
  projectType: "web_app (PWA)"
  domain: "proptech / gestion de copropriété"
  complexity: "medium"
  projectContext: "brownfield"
inputDocuments:
  - "product-brief-septrion.md"
  - "product-brief-septrion-distillate.md"
  - "research/00-sommaire-recherche.md"
  - "research/01-analyse-industrie.md"
  - "research/02-paysage-concurrentiel.md"
  - "research/03-cadre-reglementaire.md"
  - "research/04-tendances-techniques.md"
  - "research/05-synthese-strategique.md"
  - "research/06-recommandations.md"
documentCounts:
  briefs: 2
  research: 7
  brainstorming: 0
  projectDocs: 0
workflowType: 'prd'
---

# Product Requirements Document - Septrion

**Author:** David
**Date:** 2026-04-08

## Executive Summary

Les membres bénévoles de conseils syndicaux en copropriétés françaises de +20 lots gèrent des dossiers complexes — travaux, sinistres, contrats, relances syndic — en marge de leur vie professionnelle et personnelle. L'information est dispersée entre WhatsApp, emails, PDF et extranets. Les sujets passent à travers : oublis, confusions, manque de suivi. Quand un copropriétaire demande "on en est où avec l'ascenseur ?", reconstituer la réponse prend 30 minutes. Quand un membre quitte le CS, sa mémoire part avec lui.

Septrion est une PWA mobile-first qui centralise les dossiers de copropriété et décharge la mémoire des bénévoles. Un membre du CS forward un document par WhatsApp ou l'ajoute depuis l'app. L'IA (Claude Sonnet) analyse le contenu, extrait le titre, l'urgence, un résumé et la prochaine action recommandée. Le signalement structuré apparaît dans une inbox de triage. Le membre qualifie, rattache à un dossier existant ou en crée un nouveau. Depuis le dossier, il retrouve tout l'historique et les documents. Le système notifie automatiquement le membre CS par WhatsApp et email quand un nouveau signalement arrive ou quand le digest est envoyé.

Le marché est en inflexion : les obligations réglementaires 2025-2026 (DPE collectif, PPPT, extranet obligatoire, facturation électronique) génèrent un volume massif de documents que le CS doit absorber. Les outils existants ciblent le syndic (Syndic AI, Genius.immo, Bellman) ou proposent au CS une saisie manuelle sans intelligence (Conseil Syndical IO, Domino.immo). Aucun ne combine ingestion automatique, analyse IA et gestion longitudinale de dossiers au service direct du conseil syndical.

### Ce qui rend Septrion spécial

L'info arrive par les canaux que le CS utilise déjà — WhatsApp forward, upload depuis l'app. L'IA fait le travail de structuration et de résumé. Le bénévole valide au lieu de tout construire de zéro. La valeur primaire est la centralisation (tout au même endroit), amplifiée par l'intelligence IA (résumés, classification, prochaines actions).

L'insight fondateur : les bénévoles du CS ne cherchent pas un outil de gestion de plus. Ils veulent un filet de sécurité cognitif — un outil qui retient à leur place pour que les sujets de la copro ne tombent pas dans les trous.

Le moat durable n'est pas l'IA (tout concurrent peut intégrer un LLM) mais la base de connaissance accumulée par copropriété : historique de dossiers, documents, chronologies, résumés enrichis. Plus le CS utilise Septrion, plus le coût de switching augmente et plus l'outil devient pertinent.

## Classification du projet

| Dimension | Valeur |
|-----------|--------|
| **Type** | Web App — PWA (React + Vite + Tailwind + shadcn/ui) |
| **Domaine** | Proptech — gestion de copropriété pour conseils syndicaux |
| **Complexité** | Moyenne — contraintes RGPD, EU AI Act, loi 1965, mais pas au niveau d'un fintech ou medtech |
| **Contexte** | Brownfield — prototype fonctionnel existant (webhook WhatsApp, Supabase, frontend React) |
| **Stack** | Supabase (Postgres + Edge Functions + Storage) · Claude Sonnet API · WhatsApp Business API · PostHog |

## Hypothèses Non Vérifiées

Transparence sur les éléments issus de la recherche domaine qui n'ont pas pu être confirmés par des sources primaires. Ne pas bâtir de décisions produit ou commerciales sur ces hypothèses sans vérification préalable.

| Hypothèse | Statut | Source | Impact si faux |
|---|---|---|---|
| "Référent numérique" obligatoire dans les CS de +50 lots | **NON VÉRIFIÉ** — décret cité (n°2024-127) non trouvé sur Légifrance. Possiblement du contenu généré par IA propagé entre blogs juridiques. | [Village Justice](https://www.village-justice.com/articles/copropriete-2026-virage-numerique-financier-energetique,55957.html) | Perd un persona institutionnel pour le ciblage post-MVP, mais le besoin CS reste réel |
| Budget de délégation CS = 5% du budget prévisionnel | **NON VÉRIFIÉ** — l'art. 21-2 (loi 1965) confirme l'existence d'un budget voté par l'AG, mais le chiffre de 5% n'apparaît dans aucune source primaire | Même article Village Justice | La piste de monétisation via budget de délégation reste valide, seul le montant est incertain — il varie par copro |
| Marché adressable = 65 000-80 000 copropriétés | **ESTIMATION** — fourchette large basée sur croisement de sources (ANIL, Mon Immeuble) | [ANIL 2025](https://www.anil.org/immatriculation-coproprietes/) | Ordre de grandeur fiable, chiffre exact secondaire au stade MVP |

## Critères de Succès

### Succès Utilisateur

Le MVP est testé avec **10 membres CS** de copropriétés réelles sur **5 jours**. Le succès se mesure par des comportements spontanés, pas des réponses à des questionnaires.

| Signal | Seuil de validation (5 jours) | Seuil d'abandon |
|--------|-------------------------------|-----------------|
| Forward spontané de documents | 3+ docs en 5 jours sans sollicitation | 0 doc après jour 2 |
| Retour dans l'app | Le testeur revient au moins 3 jours sur 5 | Ouvre l'app une seule fois |
| Usage du partage/notification | Au moins 1 partage en 5 jours | Jamais utilisé |
| Qualité des résumés IA | Le testeur ne corrige pas plus de 20% des résumés | >50% jugés inutiles ou incorrects |

**Moment "aha" en deux temps :**
1. **Ingestion (jour 1)** — Le testeur forward un document et le retrouve structuré en moins d'une minute. Wow immédiat.
2. **Retrieval (jours 3-5)** — Le testeur ouvre Septrion pour retrouver une info au lieu de fouiller ses emails et WhatsApp. Le pré-chargement de 3-4 dossiers seed à partir de documents dummy est **critique** pour que ce moment arrive en 5 jours. Le testeur peut aussi ajouter ses propres documents s'il le souhaite.

### Succès Business

| Métrique | Cible | Pourquoi c'est le bon indicateur |
|----------|-------|----------------------------------|
| **Rétention J+5** | >40% (4+ testeurs sur 10 encore actifs) | Signal fort que l'outil s'intègre dans les habitudes du bénévole |
| **Debrief qualitatif jour 5** | Majorité des testeurs disent qu'ils continueraient | Validation du problem-solution fit — le signal le plus fiable |
| **Volume de dossiers** | 5+ dossiers par copro test (seed inclus) | Seuil à partir duquel la valeur retrieval se déclenche |

Pas de métriques de revenus au stade MVP — le produit est gratuit. La question de willingness-to-pay sera explorée lors du debrief jour 5.

### Succès Technique

Pas de seuils de performance arbitraires. Le principe directeur est : **bien fait, pas vite fait**. Les critères techniques sont qualitatifs au stade MVP :

- L'analyse IA produit des résultats cohérents et exploitables sur des documents réels (PDF, images, emails forwardés, scans)
- Le flux WhatsApp → signalement fonctionne de bout en bout sans intervention manuelle
- Les notifications WhatsApp et email arrivent de manière fiable aux testeurs
- Les données sont correctement stockées et persistantes dans Supabase
- Le digest hebdo se déclenche manuellement et contient un résumé pertinent

### Résultats Mesurables

**Analytics PostHog** (autocapture + events custom) :
- `signalement_qualified` — signalement transformé en dossier
- `dossier_viewed` — consultation d'un dossier
- `notification_sent` — notification WhatsApp/email envoyée
- `document_uploaded` — fichier ajouté manuellement
- `digest_clicked` — clic depuis la notification du digest
- Rétention J+1, J+3, J+5 par utilisateur authentifié

## Scope Produit

### MVP — Minimum Viable Product

**Principe :** Produit fonctionnel à 100%, pas un brouillon. Les testeurs doivent pouvoir l'utiliser sur la durée sans perte de données.

**Job #1 :** Créer, consulter ou alimenter un dossier via l'interface ou WhatsApp, avec aide IA pour la saisie, l'analyse et le digest.

- **Authentification** : inscription par email + mot de passe. Le numéro WhatsApp est collecté à l'onboarding pour lier le compte à l'app (matching `sender_phone`). Persistance des données garantie.
- **Onboarding** : stepper 5 étapes — explication visuelle → inscription + profil fusionnés (numéro, mdp, email optionnel, prénom, copro, opt-in) → installation PWA → WhatsApp → premier document. Nombre de lots déplacé dans Settings.
- **Ingestion WhatsApp** : agent avec analyse IA → signalement structuré (titre, urgence, localisation si détectée, résumé, prochaine action)
- **Création in-app** : page "Signaler un incident" via bouton "+" — saisie manuelle OU upload fichier avec auto-complétion IA (au choix de l'utilisateur). Upload sans auto-complétion = simple pièce jointe.
- **Inbox triage** : qualifier / rejeter un signalement → créer ou rattacher à un dossier
- **Détail dossier** : résumé IA, chronologie, documents attachés, statut (en cours / bloqué / terminé) avec transitions
- **Dashboard** : remontée automatique d'informations clés depuis les dossiers (dossiers actifs, bloqués, dernières mises à jour). Création manuelle d'événements = bouton visible "Prochainement".
- **Partage (cosmétique immersif)** : UI de partage avec choix "résidents" ou "CS uniquement", placeholders pré-remplis avec exemples. Le testeur "envoie" et reçoit lui-même la notification — démo du flux complet.
- **Notifications automatiques** : WhatsApp + email au testeur uniquement (loop solo). Déclenchées par : nouveau signalement, digest, partage cosmétique. Pas de push PWA.
- **Digest** : déclenché manuellement pendant le test (automatisation cron post-MVP). Résumé IA envoyé par WhatsApp + email.
- **Analytics** : PostHog (pageview, autocapture, identification par utilisateur authentifié)
- **Pré-chargement** : 3-4 dossiers seed par copro test à partir de documents dummy (le testeur peut ajouter ses propres documents)
- **RGPD minimum** : politique de confidentialité, DPA Anthropic + Supabase, mention IA visible

**UI non fonctionnelle ("Prochainement") :**
- Bouton "Communiquer aux résidents" (visible, non fonctionnel au-delà du cosmétique)
- Bouton "Créer un événement" sur le dashboard

### Croissance (Post-MVP)

- Push notifications natives (React Native)
- Notifications multi-utilisateurs (tous les membres CS, pas juste le testeur)
- Notes internes sur les dossiers
- Communication fonctionnelle vers les résidents (WhatsApp Business sortant)
- Page publique de consultation dossier en lecture seule (lien partageable)
- Email comme 2ème canal d'entrée
- Rattachement IA suggeré dans l'inbox de triage
- Digest hebdo automatisé (cron Supabase)
- Architecture multi-LLM (Claude + Mistral pour tâches secondaires)
- Offre commerciale via budget de délégation CS (art. 21-2)

### Vision (Futur)

- Multi-copropriété (un président CS gère plusieurs copros)
- App store (React Native)
- Intégration extranets syndics (API ou scraping)
- Agent IA proactif (relances syndic, préparation AG, benchmark inter-copros)
- Interface résidents dédiée
- Chat interne CS

## Parcours Utilisateur

### Parcours 1 — Louise qualifie un signalement entrant

**Louise**, 32 ans, trésorière du CS d'une copro de 40 lots. Gère la copro le soir après le travail.

Louise reçoit une notification WhatsApp : "Nouveau signalement — Panne ascenseur Bât C". Un copropriétaire a envoyé un message WhatsApp au numéro Septrion. Elle ouvre l'app (authentifiée par numéro + mdp), arrive sur la page signalements. Le signalement est déjà structuré : titre, urgence "urgent", localisation "Ascenseur — Bâtiment C", résumé factuel, prochaine action recommandée.

Louise n'a rien eu à saisir. Elle qualifie le signalement : crée un nouveau dossier "Ascenseur Bât C". Le système lui envoie automatiquement une notification de confirmation (WhatsApp + email). Temps total : 2 minutes.

### Parcours 2 — Louise forward un document reçu par email

Louise reçoit par email un devis de ravalement de façade du syndic — 8 pages PDF. Elle forward le mail avec la pièce jointe à Septrion via WhatsApp. Ou, si elle est déjà dans l'app, elle utilise le bouton "+" pour uploader le PDF directement.

30 secondes plus tard, un signalement apparaît : titre "Devis ravalement façade — Entreprise Martin", urgence "normal", résumé avec le montant et les postes principaux. Louise n'a pas eu à lire les 8 pages. Elle qualifie, rattache au dossier "Ravalement façade" existant. Le devis rejoint la chronologie du dossier.

### Parcours 3 — David prépare le test pour un nouveau testeur

**David**, fondateur Septrion, responsable du setup.

David prépare le test d'un nouveau testeur. Il ingère des documents dummy (PV d'AG type, devis fictif, échange syndic simulé) via WhatsApp vers Septrion. Les signalements se créent automatiquement. Il les qualifie et crée les dossiers seed.

Quand le testeur ouvrira l'app après l'onboarding, il verra un dashboard déjà peuplé avec des dossiers représentatifs. Si le testeur veut ajouter ses propres vrais documents, il le peut via WhatsApp forward ou upload.

À mi-parcours du test (jour 2-3), David déclenche manuellement le digest pour tester la boucle de rétention.

### Parcours 4 — Louise fait évoluer le statut d'un dossier

Louise consulte le dossier "Fuite parking souterrain". Le plombier est intervenu, la fuite est réparée. Elle change le statut du dossier de "en cours" à "terminé". Le dossier reste consultable mais est visuellement distingué des dossiers actifs.

Autre cas : le syndic ne répond plus depuis 2 semaines sur le dossier "Ravalement façade". Louise le passe en "bloqué". Le dossier apparaît en évidence sur le dashboard comme nécessitant une action.

**Transitions possibles :**
- en cours → bloqué (problème identifié)
- en cours → terminé (sujet résolu)
- bloqué → en cours (problème débloqué)
- terminé → en cours (sujet rouvert)

### Parcours 5 — Ibtissem découvre Septrion (onboarding)

**Ibtissem**, 28 ans, nouvelle secrétaire du CS d'une copro de 55 lots. David l'invite à tester Septrion.

Ibtissem ouvre le lien sur son iPhone. L'écran d'accueil lui explique le principe en 3 étapes visuelles : "Vous recevez un document → Vous le forwardez → Il apparaît structuré". Elle tape "Suivant". L'app lui demande d'ajouter Septrion à son écran d'accueil (instructions iOS). Elle le fait.

Écran suivant : inscription. Elle saisit son email, choisit un mot de passe. Écran suivant (onboarding step profil) : elle entre son prénom, son numéro WhatsApp, sélectionne sa copropriété dans la liste, coche l'opt-in notifications.

L'app lui montre comment ajouter le contact WhatsApp Septrion et forwarder un document. Dernier écran : elle peut uploader un document, utiliser un exemple, ou explorer directement. Elle choisit l'exemple — un dossier seed apparaît sur son dashboard. L'onboarding est terminé en moins de 3 minutes.

### Parcours 6 — Louise utilise l'assistant IA

Louise a 12 dossiers dans Septrion. Un copropriétaire l'interpelle dans le hall : "Le ravalement, c'est quoi le dernier devis ?". Louise ouvre l'app, tape sur l'onglet Assistant IA. Trois suggestions apparaissent : "Résumé du dossier ravalement", "Dossiers bloqués", "Derniers signalements".

Elle tape la suggestion "Résumé du dossier ravalement". L'assistant charge le contexte des dossiers de sa copro et répond : "Le dernier devis reçu est celui de l'Entreprise Martin, 45 000€ HT, reçu le 2 avril. Le dossier est en cours, prochaine action : comparaison avec le 2ème devis attendu." Sous la réponse, des boutons contextuels : "Voir le dossier", "Créer un signalement".

Louise peut aussi utiliser la voix : elle appuie sur le micro, dit "Est-ce qu'on a des dossiers bloqués ?", et l'assistant transcrit sa question et répond avec la liste des dossiers bloqués et les raisons de blocage.

### Parcours post-MVP (noté pour la suite)

- **Retrieval** — Louise retrouve une info en 10 secondes quand un voisin l'interpelle, copie le lien partageable et l'envoie dans le groupe WhatsApp de la copro. Le résident consulte le résumé sans app.
- **Document illisible** — Photo floue analysée par Claude Vision, résumé partiel, Louise complète manuellement. Gestion gracieuse des cas dégradés.

### Synthèse des capacités révélées

| Parcours | Capacités requises |
|----------|-------------------|
| 1 — Signalement entrant | Notification WhatsApp/email, inbox signalements, qualification, création/rattachement dossier |
| 2 — Forward document | Ingestion WhatsApp + upload app, analyse IA (PDF), qualification, chronologie dossier |
| 3 — Setup testeur | Ingestion manuelle, qualification, pré-chargement seed (dummy), déclenchement digest manuel |
| 4 — Transition statut | Changement de statut dossier (en cours/bloqué/terminé), ajout de note contextuelle |
| 5 — Onboarding | Stepper 5 étapes, inscription + profil fusionnés, installation PWA, WhatsApp, premier document |
| 6 — Assistant IA | Chat texte, suggestions, actions contextuelles, transcription vocale, contexte dossiers |

## Exigences Domaine

### Conformité & Réglementaire

**RGPD (applicable immédiatement) :**
- Politique de confidentialité accessible dans la PWA (données collectées, finalités, durée, droits)
- DPA signé avec Anthropic (documents analysés = sous-traitance IA au sens RGPD)
- DPA signé avec Supabase (hébergement données)
- Base légale : intérêt légitime du CS dans l'exercice de son mandat (art. 6.1.f RGPD)
- Consentement explicite opt-in pour les notifications (WhatsApp + email)
- Documentation des flux de données : WhatsApp → Supabase Storage → Claude API → Supabase DB → App

**EU AI Act (transparence) :**
- Mention visible dans l'app que les résumés et classifications sont générés par IA
- Les dossiers structurés et auditables sont un avantage de conformité vs les chatbots opaques

**Loi 1965 copropriété :**
- Le CS a légalement le droit d'accéder à tous les documents de gestion (art. 21). Septrion aide le CS à exercer ce droit — pas de risque juridique sur l'usage.
- Le budget de délégation CS (art. 21-2) est la piste de monétisation post-MVP. Montant voté par chaque AG, pas de pourcentage fixe.

### Contraintes Techniques

**WhatsApp Business API :**
- Dépendance Meta — canal d'entrée principal. Risque de changement de règles unilatéral.
- Les messages ingérés peuvent contenir des données personnelles de tiers (copropriétaires mentionnés dans les documents).
- Mitigation post-MVP : email comme 2ème canal d'entrée.

**Notifications (MVP) :**
- Canal principal : WhatsApp sortant (template pré-approuvé Meta) + email
- Contenu : titre signalement, urgence, lien pour ouvrir l'app
- MVP = loop solo : seul le testeur reçoit ses propres notifications
- Pas de push PWA pour le MVP (fiabilité non garantie, surtout iOS)
- Coût WhatsApp négligeable pour le test (10 testeurs)

**Données & stockage :**
- Documents uploadés stockés dans Supabase Storage
- Limite 10MB par fichier (free tier Supabase)
- Pas de données de santé — pas de certification HDS nécessaire

### Risques Domaine

Les risques domaine sont consolidés dans le tableau unique de la section "Risques & Mitigations" (cf. Scoping & Développement Phasé).

## Exigences Techniques PWA

### Architecture

- **SPA React** (Vite + Tailwind + shadcn/ui) — navigation sans rechargement de page
- **PWA installable** — manifest, service worker, icône écran d'accueil
- **Mobile-first** — conçue pour l'usage smartphone, desktop secondaire
- **Authentification** — Supabase Auth avec email + mot de passe. Le numéro WhatsApp est collecté à l'onboarding et sert de clé de liaison avec le compte WhatsApp.

### Navigateurs cibles

- Chrome Android (cible principale)
- Safari iOS 16.4+
- Desktop : non prioritaire, mais fonctionnel via navigateur

### Temps réel

- Supabase Realtime pour la mise à jour automatique de la page signalements quand un nouveau signalement arrive
- Utilisé aussi pour l'onboarding écran 5 (détection du premier signalement)

### Hors scope MVP

- SEO — les testeurs arrivent par lien direct, pas par recherche
- Accessibilité — fera l'objet d'un examen approfondi post-MVP
- Support desktop dédié
- Offline mode

## Scoping & Développement Phasé

### Stratégie MVP

**Approche :** MVP de validation de problème — confirmer que le CS trouve de la valeur dans la centralisation automatique + analyse IA de documents sur un usage réel de 5 jours.

**Ce qu'on valide :** Le flow WhatsApp/upload → analyse IA → signalement → dossier résout un vrai problème pour des bénévoles qui n'ont pas le temps de structurer eux-mêmes.

**Ce qu'on ne valide pas encore :** La monétisation, l'adoption collective (multi-membres CS), la rétention long terme, le canal email.

### Équipe

| Membre | Rôle |
|--------|------|
| David | Tech / Produit / Setup testeurs |
| Jamel | À préciser |
| Ibtissem | À préciser |

### Périmètre MVP — Verrouillé

Le scope MVP est défini dans la section "Scope Produit" ci-dessus. Aucune feature supplémentaire ne sera ajoutée. Les ajouts identifiés pendant ce workflow (notification WhatsApp sortante comme fallback push) sont intégrés.

**Principe directeur :** Bien fait, pas vite fait. Simplicité avant exhaustivité.

### Risques & Mitigations

| Type | Risque | Mitigation |
|------|--------|------------|
| **Marché** | Les testeurs n'adoptent pas le forward WhatsApp spontanément | Pré-chargement dummy + simulation par David pendant le test |
| **Marché** | 5 jours trop court pour observer le moment retrieval | Documents seed pour créer la masse critique dès jour 1 |
| **Technique** | L'analyse IA produit des résumés insuffisants sur des docs réels | Itérer le prompt Claude avant le test. Kill criterion : >50% de corrections |
| **Technique** | Notifications non délivrées | Double canal WhatsApp + email pour maximiser la délivrabilité |
| **Ressource** | Équipe de 3, scope ambitieux | Scope verrouillé, pas de feature creep. Focus sur la qualité du flow principal |
| **Réglementaire** | DPA non signés avant le test | Action préalable obligatoire : signer DPA Anthropic + Supabase avant de lancer les testeurs |
| **Réglementaire** | Syndic invoque le RGPD pour bloquer l'accès aux documents | Hors scope MVP — le CS ingère ses propres documents |
| **Réglementaire** | Transfert données hors UE (Claude API) | DPA + clauses contractuelles types en place avant le test |
| **Réglementaire** | Plainte CNIL d'un copropriétaire | Politique de confidentialité + processus de suppression sur demande |

## Exigences Fonctionnelles

### Authentification

- **FR1 :** Le nouvel utilisateur peut créer un compte avec son email et un mot de passe
- **FR2 :** Le système peut lier le numéro WhatsApp (collecté à l'onboarding) au compte pour le matching des messages entrants
- **FR3 :** Un utilisateur authentifié peut se connecter avec son email + mot de passe
- **FR4 :** Un utilisateur authentifié peut rester connecté entre les sessions (persistance de session)

### Onboarding

- **FR5 :** Le nouvel utilisateur peut suivre un stepper de 5 étapes après inscription avant d'accéder au dashboard
- **FR6 :** L'utilisateur peut voir une explication visuelle du fonctionnement de Septrion (étape 1)
- **FR7 :** L'utilisateur peut s'inscrire et renseigner son profil sur un même écran : numéro, mdp, email optionnel, prénom, copropriété, opt-in notifications (étape 2)
- **FR8 :** L'utilisateur peut recevoir les instructions d'installation PWA sur son écran d'accueil (étape 3)
- **FR9 :** L'utilisateur peut voir comment ajouter le contact Septrion WhatsApp et forwarder un document (étape 4)
- **FR10 :** L'utilisateur peut uploader un document, utiliser un document exemple, ou explorer l'app directement (étape 5)

### Ingestion de Documents

- **FR11 :** Un utilisateur peut forwarder un document à l'agent WhatsApp Septrion (PDF, image, texte)
- **FR12 :** Un utilisateur peut créer un signalement depuis l'app via le bouton "+" — saisie manuelle des champs (titre, description, urgence, localisation)
- **FR13 :** Un utilisateur peut attacher un fichier (PDF, image) à un signalement créé depuis l'app — le fichier est stocké sans analyse IA
- **FR14 :** Un utilisateur peut déclencher l'auto-complétion IA sur un fichier attaché — les champs du formulaire se pré-remplissent (titre, urgence, localisation, résumé). L'utilisateur peut modifier avant soumission.
- **FR15 :** Le système peut limiter la taille des fichiers uploadés à 10MB
- **FR16 :** Le système peut analyser automatiquement chaque document et produire un titre, un niveau d'urgence, une localisation (si détectable), un résumé et une prochaine action recommandée
- **FR17 :** Le système peut traiter des documents de types variés : PDF, images/photos, texte brut WhatsApp
- **FR18 :** Le système peut créer automatiquement un signalement structuré dans l'inbox à partir de l'analyse IA

### Triage des Signalements

- **FR19 :** Un membre CS peut consulter la liste des signalements en attente de qualification
- **FR20 :** Un membre CS peut qualifier un signalement en créant un nouveau dossier
- **FR21 :** Un membre CS peut qualifier un signalement en le rattachant à un dossier existant
- **FR22 :** Un membre CS peut rejeter un signalement non pertinent
- **FR23 :** La page signalements peut se mettre à jour en temps réel quand un nouveau signalement arrive

### Gestion des Dossiers

- **FR24 :** Un membre CS peut consulter la liste de tous les dossiers
- **FR25 :** Un membre CS peut consulter le détail d'un dossier : résumé IA, niveau d'urgence, prochaine action
- **FR26 :** Un membre CS peut consulter la chronologie des événements d'un dossier
- **FR27 :** Un membre CS peut consulter les documents attachés à un dossier
- **FR28 :** Un membre CS peut voir le statut d'un dossier (en cours, bloqué, terminé)
- **FR29 :** Un membre CS peut changer le statut d'un dossier (en cours ↔ bloqué ↔ terminé)
- **FR29b :** Le système peut régénérer automatiquement le résumé IA d'un dossier quand un nouveau signalement y est rattaché — le résumé intègre l'ensemble des documents et événements du dossier

### Notifications & Communication

- **FR30 :** Le système peut envoyer automatiquement une notification WhatsApp + email au testeur quand un nouveau signalement arrive
- **FR31 :** Le système peut envoyer automatiquement une notification WhatsApp + email au testeur quand le digest est envoyé
- **FR32 :** Un membre CS peut initier un "partage" depuis un dossier — UI avec choix "résidents" ou "CS uniquement", placeholders pré-remplis avec exemples de messages. Le testeur reçoit lui-même la notification (loop solo cosmétique).

### Dashboard & Digest

- **FR33 :** Un membre CS peut consulter un dashboard avec remontée automatique des informations clés depuis les dossiers (dossiers actifs, bloqués, dernières mises à jour, signalements en attente)
- **FR34 :** Un administrateur peut déclencher manuellement l'envoi d'un digest au testeur
- **FR35 :** Le digest peut contenir un résumé IA des dossiers actifs, bloqués et des signalements en attente
- **FR36 :** Le digest peut être envoyé par WhatsApp + email

### Analytics

- **FR37 :** Le système peut identifier chaque utilisateur authentifié dans l'outil d'analytics
- **FR38 :** Le système peut traquer automatiquement les pages visitées et les interactions utilisateur
- **FR39 :** Le système peut enregistrer les events custom : signalement qualifié, dossier consulté, notification envoyée, document uploadé, digest cliqué

### Administration (Setup Testeur)

- **FR40 :** Un administrateur peut ingérer des documents dummy via WhatsApp pour pré-charger des dossiers seed
- **FR41 :** Un administrateur peut qualifier et créer des dossiers à partir des signalements seed

### Conformité

- **FR42 :** L'utilisateur peut consulter la politique de confidentialité depuis l'app
- **FR43 :** L'utilisateur peut voir une mention visible que les résumés sont générés par IA
- **FR44 :** L'utilisateur peut donner son consentement explicite (opt-in) pour recevoir des notifications par WhatsApp et email lors de l'onboarding

### Assistant IA

- **FR45 :** Un membre CS peut poser une question à l'assistant IA par texte depuis l'app
- **FR46 :** Un membre CS peut poser une question à l'assistant IA par la voix depuis l'app (transcription vocale en français)
- **FR47 :** L'assistant IA peut charger le contexte des dossiers et signalements de la copropriété et fournir une réponse synthétique et contextualisée (résumé, statut, dernière action, responsable)
- **FR48 :** L'assistant IA peut proposer des actions contextuelles suite à une question (consulter le dossier, créer un signalement)
- **FR49 :** L'assistant IA peut afficher des suggestions de questions au lancement et des chips de suivi après chaque réponse

### Settings

- **FR50 :** Un membre CS peut consulter et modifier le nombre de lots de sa copropriété depuis les Settings

## Exigences Non-Fonctionnelles

### Sécurité & Vie Privée

- Les documents uploadés et stockés ne sont pas accessibles publiquement sans lien direct
- Les communications entre l'app et le backend utilisent HTTPS
- Les appels à l'API d'analyse IA transmettent les documents via connexion chiffrée
- Les données personnelles des copropriétaires présentes dans les documents sont traitées conformément au RGPD (cf. section Exigences Domaine)
- Aucun document n'est conservé côté fournisseur IA après analyse (API stateless, pas de training sur les données)

### Fiabilité des Intégrations

- Le webhook WhatsApp doit traiter chaque message entrant sans perte — un document forwardé ne peut pas disparaître silencieusement
- Si l'analyse IA échoue (timeout, document corrompu), le signalement est créé avec un statut d'erreur plutôt que perdu
- Les notifications WhatsApp et email doivent être envoyées dans un délai raisonnable (minutes, pas heures)

### Performance

- Pas de seuils chiffrés imposés pour le MVP
- L'expérience utilisateur doit rester fluide : navigation instantanée entre les pages, chargement des dossiers sans attente perceptible
- L'analyse IA est asynchrone — le testeur n'attend pas devant un écran de chargement. Le signalement apparaît quand il est prêt (mise à jour temps réel)
