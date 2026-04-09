---
title: "Product Brief Distillate: Septrion"
type: llm-distillate
source: "product-brief-septrion.md"
created: "2026-04-08"
purpose: "Token-efficient context for downstream PRD creation. Each bullet is self-contained — no need to load the full brief."
---

# Septrion — Detail Pack pour PRD

## Spécification IA — Format de sortie Claude

- **Pipeline unique** : tout document (WhatsApp forward OU upload app) passe par le même prompt Claude Sonnet. Le webhook `/whatsapp-webhook` et la future route upload appellent la même fonction `analyzeMessage()`.
- **Sortie JSON structurée** par document analysé :
  ```json
  {
    "name": "Titre court et clair (ex: Réfection toiture Bât A, Panne portail parking B)",
    "urgency": "normal | urgent | critique",
    "nextStep": "Prochaine action concrète recommandée",
    "summary": "Résumé factuel en 2-3 phrases des points clés"
  }
  ```
- **Taxonomie urgence** : `normal` (pas de deadline immédiate), `urgent` (action requise sous 1 semaine), `critique` (sécurité, blocage, action immédiate). Le prompt actuel utilise des mots-clés en fallback (panne→urgent, fuite→urgent, inondation→critique, incendie→critique).
- **Types de documents supportés** : PDF (via base64 document type dans l'API Claude), images/photos (via image type), texte WhatsApp brut. Les scans/photos de documents papier passent par la vision multimodale de Claude.
- **Cas limite — photo sans texte** : ex. photo d'une fuite d'eau. Claude Vision analyse l'image et génère le titre + résumé. Le prompt doit inclure : "Si l'entrée est uniquement une image, décris ce que tu vois et déduis le type de problème."
- **Cas limite — email chaotique forwardé** : le contenu peut inclure des headers de forwarding, des signatures, des threads. Le prompt doit extraire le signal du bruit.
- **Qualité attendue** : le testeur ne devrait pas avoir à corriger le résumé plus de 20% du temps (kill criterion). Si >50% de corrections, le prompt doit être itéré.
- **Confidence** : pas d'indicateur de confidence dans le MVP actuel. Le triage humain (inbox → qualifier/rejeter) sert de gate de validation. Ajout d'un score de confiance visible = amélioration post-MVP.
- **Matching de doublons** : `findSimilarDossier()` existe dans le webhook (utilise Claude Haiku pour comparer le nouveau signalement aux 20 derniers dossiers). Actuellement déclenché côté WhatsApp avec confirmation OUI/NON. Recommandé de déplacer cette logique dans l'UI de triage en post-MVP ("Ce document ressemble au dossier X — rattacher ?").
- **Coût** : ~0.01-0.05€ par document analysé avec Sonnet. À 1000 copros × 10 docs/mois = 100-500€/mois. Optimisable avec Mistral Medium pour les tâches secondaires (matching).

## Architecture des Dossiers — Modèle de données

- **Un dossier = un sujet/problème de la copropriété** (ex: "Ascenseur bâtiment C", "Ravalement façade", "Nettoyage insatisfaisant"). Pas un incident ponctuel, pas un projet formel — un sujet ouvert qui accumule des événements dans le temps.
- **Table Supabase `dossiers`** : id (text PK), name, status (en_cours|bloqué|terminé), urgency (normal|urgent|critique), responsible, next_step, last_action, blocage_reason, created_via_agent (bool), timeline (JSONB array), documents (JSONB array), prestataires (JSONB array), syndic_history (JSONB array), syndic_contact (JSONB), created_at, updated_at.
- **Table `signalements`** : inbox de triage avant qualification. Champs : name, urgency, summary, next_step, sender_name, sender_phone, document_url, status (nouveau|qualifié|rejeté), dossier_id (FK nullable), raw_analysis (JSONB).
- **Flux** : Document entrant → Signalement (inbox) → CS qualifie → Dossier créé OU rattaché à un existant OU rejeté.
- **Question ouverte pour le PRD** : les dossiers peuvent-ils avoir des sous-dossiers ? Ex: "Ascenseur" avec sous-dossiers "Panne mars", "Remplacement carte mère", "Devis OTIS". Le prototype actuel ne supporte pas l'imbrication — chaque dossier est plat. À clarifier.
- **Question ouverte** : quand un dossier est marqué "terminé", est-il archivé ? Peut-on le rouvrir ? Le prototype ne gère pas les transitions d'état depuis l'app (pas de CRUD dossier dans le MVP actuel, uniquement via triage).

## Onboarding — Spécifications détaillées

- **5 écrans séquentiels**, passage obligatoire avant accès au dashboard.
- **Écran 1 (Flow visuel)** : schéma 3 étapes mail→WhatsApp→app. Pas de texte long. Bouton "Commencer".
- **Écran 2 (Install PWA)** : instructions iOS (Partager → Sur l'écran d'accueil) et Android (Menu → Installer). **Critique** : sans installation, pas de push sur iOS. Cet écran doit précéder la collecte de profil pour ne pas être skipé.
- **Écran 3 (Profil)** : prénom + nom copropriété. Stocké en localStorage + envoyé à PostHog via `posthog.identify(prenom)` et `posthog.group('copro', nom_copro)`.
- **Écran 4 (WhatsApp)** : bouton "Ajouter le contact Septrion" qui ouvre la fiche contact pré-remplie avec le numéro de l'agent WhatsApp. Le numéro doit apparaître ensuite dans la liste de transfert WhatsApp de l'utilisateur.
- **Écran 5 (Premier dossier)** : bouton "Ouvrir WhatsApp" (deep link `whatsapp://send?phone=+15551852563`). L'app attend (polling sur la table signalements ou Supabase realtime) la création du premier signalement. Quand détecté → transition vers le dossier créé.
- **Question PRD** : que se passe-t-il si l'utilisateur quitte l'onboarding en cours ? Reprise automatique au prochain lancement ? Skip possible après l'écran 3 ?
- **Pré-chargement seed** : 3-4 dossiers réels de la copro test, ingérés par David avant l'onboarding du testeur. Le testeur arrive sur un dashboard non-vide. Nécessite un entretien de setup préalable où le testeur partage ses documents existants.

## Upload Manuel — Spécifications

- **Point d'entrée** : bouton "+" visible sur la page liste des dossiers (DossiersList.tsx).
- **Flow** : clic "+" → sélection fichier (PDF, image, texte) via `<input type="file" accept="image/*,.pdf">` → upload vers Supabase Storage → appel à la même fonction d'analyse Claude que le webhook → création d'un signalement dans l'inbox → le CS qualifie.
- **Alternative** : créer directement un dossier sans passer par l'inbox (skip triage). À discuter — le triage est-il nécessaire quand l'upload est intentionnel ?
- **Taille max** : limiter à 10MB par fichier (contrainte Supabase Storage free tier). Afficher un message si dépassé.
- **UX** : indicateur de progression pendant l'upload + analyse. Message "Document reçu, analyse en cours..." puis redirection vers le signalement ou dossier créé.

## Digest Hebdo Automatisé — Spécifications

- **Déclencheur** : cron Supabase (pg_cron) tous les lundis 9h.
- **Logique** : edge function qui (1) requête les dossiers actifs/bloqués avec leurs dernières mises à jour, (2) envoie le contexte à Claude pour un résumé en 3-5 lignes, (3) envoie une push notification à chaque utilisateur enregistré.
- **Contenu type** : "Septrion — Point hebdo : 3 dossiers actifs, 1 bloqué (Ascenseur Bât C — en attente pièce depuis 3 semaines). 2 signalements à qualifier. → Voir le résumé"
- **Pas de push si rien n'a changé** — ne pas envoyer de notification vide, ça tue la rétention.
- **Infra push** : nécessite un service worker + web push subscription (VAPID keys). Supabase n'a pas de service push natif — utiliser une lib type `web-push` (Node.js) ou un service tiers (OneSignal free tier, Firebase Cloud Messaging).
- **Question PRD** : quelle granularité ? Un digest par copropriété ? Un digest global si multi-copro ? Pour le MVP (1 copro par testeur), un seul digest suffit.

## Notifications Push — Contraintes techniques PWA

- **Android** : pleinement supporté, opt-in classique.
- **iOS (depuis 16.4)** : supporté MAIS nécessite que l'utilisateur ait installé la PWA sur l'écran d'accueil (pas juste ouvert en browser). Pas de background push — la notification arrive quand l'app est ouverte ou récemment utilisée.
- **Implémentation** : Service Worker + Push API + Notification API. Nécessite des VAPID keys (paire publique/privée). Le serveur (edge function) envoie la push via le protocole Web Push.
- **Stockage des subscriptions** : nouvelle table Supabase `push_subscriptions` (user_id, endpoint, p256dh, auth, created_at).
- **MVP scope** : push pour les membres CS uniquement (3-5 personnes qui ont installé la PWA via l'onboarding). Pas de push vers les copropriétaires — ils reçoivent un lien partageable.

## Communication vers les Résidents (hors MVP mais spécifié)

- **MVP** : lien partageable type `septrion.app/update/abc123` → page web publique avec résumé du dossier. Louise copie le lien et le colle dans le groupe WhatsApp de la copro ou l'envoie par email. Zéro friction côté résidents.
- **Post-MVP** : notifications WhatsApp sortantes via Business API (contraintes : publication app Meta, templates pré-approuvés, opt-in résidents, coût ~0.05-0.15€/conversation, numéro business vérifié).
- **Post-MVP** : email transactionnel (plus simple que WhatsApp, via Resend/SendGrid/Supabase Auth emails).

## Analytics PostHog — Implémentation

- **Installation** : `npm install posthog-js` + init dans `main.tsx` avec `posthog.init('phc_KEY', { api_host: 'https://eu.posthog.com' })`.
- **Identification** : à l'onboarding écran 3, `posthog.identify(prenom)` + `posthog.group('copro', nom_copro)`.
- **Autocapture** : activé par défaut — chaque clic sur bouton/lien, chaque changement de route React est tracké automatiquement. Pas de code supplémentaire.
- **Events custom** à ajouter manuellement :
  - `posthog.capture('signalement_qualified', { dossier_name })` — quand un signalement est transformé en dossier
  - `posthog.capture('notification_sent', { dossier_id })` — quand une push est envoyée
  - `posthog.capture('link_shared', { dossier_id })` — quand un lien partageable est copié
  - `posthog.capture('document_uploaded', { source: 'app' })` — upload manuel
  - `posthog.capture('digest_clicked')` — clic depuis la notification du digest hebdo
- **Dashboard rétention** : PostHog fournit automatiquement les courbes J+1, J+7, J+30 par utilisateur.
- **Free tier** : 1M événements/mois. Avec 2-3 testeurs = quelques centaines d'événements, aucun risque de dépasser.

## Parcours Testeur — Les 14 premiers jours

- **Jour 0 (setup)** : David fait un entretien avec le testeur. Récupère 3-4 documents réels de la copro. Les ingère via WhatsApp pour créer les dossiers seed.
- **Jour 1** : le testeur reçoit le lien Septrion. Passe l'onboarding (5 écrans). Forward son premier document. Voit le wow : dossier structuré en 30 secondes. Explore les dossiers seed.
- **Jours 2-5** : le testeur reçoit de nouveaux documents par mail/WhatsApp dans sa vie réelle. Est-ce qu'il pense à les forwarder à Septrion ? (Signal clé de rétention)
- **Jour 7** : premier digest hebdo automatisé. "3 dossiers actifs, 1 bloqué." Le testeur clique-t-il ?
- **Jour 8-10** : un voisin pose une question sur un dossier. Le testeur ouvre Septrion et retrouve l'info. (Le vrai "aha moment" — retrieval, pas ingestion.)
- **Jour 10-14** : le testeur partage-t-il un lien avec les copropriétaires ? Utilise-t-il la push pour alerter les autres membres CS ?
- **Jour 14** : David fait un debrief qualitatif. "Qu'est-ce qui t'a été utile ? Qu'est-ce qui manque ? Tu continuerais à l'utiliser ?"

## Idées Rejetées (ne pas re-proposer dans le PRD)

- **n8n / orchestration workflow** — éliminé au profit des Edge Functions directes. Plus simple, moins de points de défaillance. Revisitable uniquement si les workflows multi-étapes deviennent trop complexes pour une seule edge function.
- **FlutterFlow / app native au stade MVP** — pivoté vers React PWA. Coût moindre, distribution par URL, itération plus rapide. React Native envisagé post-PMF.
- **MistralAI comme LLM principal** — évalué mais Claude Sonnet est supérieur en qualité d'analyse documentaire. Mistral Medium recommandé pour les tâches secondaires (matching doublons) en post-MVP pour réduire les coûts et renforcer l'argument souveraineté EU.
- **Wizard of Oz pour le digest hebdo** — remplacé par un cron automatisé (Supabase pg_cron + edge function). L'effort est suffisamment faible (~demi-journée) pour être dans le MVP.
- **Notifications WhatsApp sortantes vers les résidents au MVP** — trop de friction (publication Meta, templates, opt-in, coûts). Remplacé par lien partageable.
- **Authentification au MVP** — pas nécessaire avec 2-3 testeurs identifiés par l'onboarding (prénom + copro). Auth Supabase (magic link) = Phase 1 post-validation.
- **Chat interne CS** — hors scope MVP. La communication CS passe par les push notifications et les notes internes sur les dossiers.

## Pricing et Modèle Économique — Éléments collectés

- **Benchmarks concurrents** : Conseil Syndical IO (gratuit), Domino.immo (200€ setup + abo), ChouetteCopro (~9€/lot/an), MonConseilSyndical (abo annuel par taille), Copriciel (120€/an flat), Matera (~170€/lot/an mais remplacement syndic).
- **Cluster CS-tools** : 100-200€/an par copropriété pour un outil non-syndic.
- **Modèle MonConseilSyndical** : remboursement par le syndic comme charge de copro — le marché attend ce modèle.
- **Budget de délégation CS** (art. 21-2 loi 1965) : l'AG vote un montant que le CS peut dépenser sans re-voter. Montant exact variable par copro (le chiffre "5% du prévisionnel" est NON VÉRIFIÉ). [Légifrance](https://www.legifrance.gouv.fr/codes/section_lc/JORFTEXT000000305770/LEGISCTA000006093854/)
- **Question ouverte pour le PRD** : quel pricing tester ? Freemium (limité en dossiers) + premium ? Forfait annuel unique ? Le MVP est gratuit — mais faut-il intégrer un signal de WTP dans le test (ex: "Si cet outil existait à 15€/mois, vous l'utiliseriez ?") ?

## Concurrence — Détails non inclus dans le brief

- **MonConseilSyndical** (nouveau concurrent identifié) : app native iOS+Android, gestion par catégories (Devis, Vote, RDV, Incident, Chat), annuaire contacts, sondages, archivage documents. Abo annuel par taille (<20 lots, 20-50, 50+). Remboursable par syndic. Listé sur data.gouv.fr. Pas d'IA, pas de WhatsApp. Équipe apparemment petite, pas de métriques de traction publiques.
- **EXTRACS** (conseil-syndical-copropriete.fr) : espace collaboratif web CS, indépendant du syndic. Messagerie, alertes, historique travaux, comparatif devis, sondages, budget, réunions. Freemium avec caps durs (4 users, 20 events). UX datée. Semble être un projet solo/petit.
- **Genius.immo** : a étendu son GPT aux membres CS (pas juste syndics). Le CS peut interroger les documents de l'immeuble via IA. MAIS accès gated par le syndic — le syndic doit souscrire. Pas d'ingestion autonome par le CS.
- **ARC (Association des Responsables de Copropriétés)** : pas un concurrent mais un partenaire stratégique. 5 400+ visiteurs au salon annuel (oct), 80+ exposants, entrée libre. Publie des guides (30+ titres). Gère COPRO-NET et COPRO-FORUM. Membership par CS. Prochaine édition : octobre 2026 — timing idéal pour un lancement/démo. L'ARC a une position **sceptique sur l'IA** ("risque de rendre les gestionnaires encore plus paresseux") — positionner Septrion comme IA-assistée, pas IA-autonome.
- **Bureaux d'études thermiques (DPE/PPPT)** : partenaires potentiels d'onboarding. Chaque copro <50 lots doit faire un DPE collectif en 2026. Le bureau d'études pourrait livrer ses résultats "déjà structurés dans Septrion" — onboarding naturel avec premier dossier pré-rempli, zéro coût d'acquisition.

## Réglementaire — Points actionables pour le PRD

- **Art. 21 loi 1965** : le CS peut exiger tous les documents du syndic. Si non transmis sous 1 mois, pénalités journalières déduites de la rémunération du syndic. Septrion pourrait fournir un **modèle de lettre de mise en demeure** intégré à l'app (fonctionnalité de valeur ajoutée, différenciant vs concurrents).
- **CNIL 2025** : référentiel spécifique aux traitements de données en copropriété. Le syndicat (pas le syndic) est responsable de traitement. Le CS traite les données dans le cadre de son mandat = base légale intérêt légitime (art. 6.1.f RGPD).
- **EU AI Act** : obligations de transparence pour les IA à usage général (GPAI) depuis août 2025. Septrion doit mentionner visiblement que les résumés sont générés par IA. Les dossiers structurés et auditables sont plus conformes que les chatbots opaques.
- **Consentement WhatsApp** : les messages ingérés via WhatsApp peuvent contenir des données personnelles de copropriétaires (noms, plaintes, contacts). Le consentement de l'expéditeur (le membre CS) couvre l'ingestion, mais les données des tiers mentionnés dans les documents nécessitent une base légale (intérêt légitime du mandat CS).

## Opportunités stratégiques identifiées (post-MVP)

- **Mémoire institutionnelle comme headline value prop** : reframer de "outil qui organise les fichiers" vers "couche de continuité qui rend la copro indépendante de tout bénévole individuel". Le pitch onboarding pour un NOUVEAU membre CS ("jour 1, vous héritez de 3 ans d'historique structuré") est plus émotionnellement convaincant que le pitch current.
- **AG prep mode** : saison AG = avril-juin = pic de stress CS. Un mode qui surface les dossiers pertinents, génère un résumé de l'année, propose des résolutions = killer feature de rétention saisonnière. Moment idéal pour onboarder de nouveaux CS aussi.
- **Syndic accountability scoring** : Septrion accumule déjà des données de réactivité (temps de réponse syndic, dossiers bloqués, relances). Surfacer un score simple "temps moyen de réponse du syndic" transforme l'outil de passif à gouvernance active. Arme à l'AG pour renouveler ou changer de syndic.
- **Multi-copro comme flywheel** : beaucoup de présidents CS siègent dans plusieurs copros ou conseillent d'autres CS. Accélérer multi-copro (Phase 2 plutôt que Phase 3) multiplie le LTV par utilisateur et crée du benchmarking inter-copros.
