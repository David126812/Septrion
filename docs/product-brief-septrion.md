---
title: "Product Brief: Septrion"
status: "complete"
created: "2026-04-08"
updated: "2026-04-08"
inputs:
  - research/domain-copropriete-france-research-2026-04-08.md
  - slides de présentation (31 slides, pitch mars 2026)
  - prototype copro-pilote (GitHub, React PWA + Supabase + Claude)
  - session de brainstorm rétention 2026-04-08
  - reviews skeptic, opportunity, adoption-friction
---

# Product Brief: Septrion — MVP

## Executive Summary

Les membres bénévoles de conseils syndicaux en copropriétés françaises de +20 lots passent jusqu'à 10 heures par semaine à recouper une information dispersée entre WhatsApp, emails, PDF et extranets. Quand un voisin demande "on en est où avec l'ascenseur ?", la réponse n'est nulle part — elle est partout.

Septrion est une app mobile (PWA) qui centralise automatiquement les dossiers de copropriété grâce à un agent WhatsApp et un upload direct, alimentés par l'IA. Un membre du CS forward un document par WhatsApp ou l'ajoute depuis l'app, l'IA l'analyse et le structure en dossier. Il retrouve ensuite n'importe quel dossier en secondes et communique avec les autres membres du CS via notifications push.

Le marché est prêt : la réglementation 2025-2026 (DPE collectif, extranet obligatoire, facturation électronique) génère un tsunami de documents que le CS doit absorber. Les outils existants sont soit passifs (saisie manuelle), soit orientés syndic (pas le CS). Aucun ne combine ingestion automatique + IA + gestion de dossiers + communication entre membres CS. C'est l'espace que Septrion occupe.

## Le Problème

Louise, 32 ans, est membre du conseil syndical d'une copropriété de 40 lots gérée par un syndic professionnel. Elle gère les dossiers de la copro le soir et le week-end, bénévolement.

**Sa frustration** : quand on lui pose une question sur un dossier, elle part en chasse. Le dernier devis est dans un email du syndic. Les photos du sinistre sont dans le groupe WhatsApp. Le PV de la dernière AG est sur l'extranet. Le comparatif de devis est dans un Excel sur son disque dur. Reconstituer le fil d'un dossier prend 30 minutes, parfois plus.

**Le coût du statu quo** :
- Jusqu'à 10h/semaine de travail bénévole improductif ([source : entretiens exploratoires, 6 CS interviewés](./research/05-synthese-strategique.md))
- Épuisement progressif des membres les plus investis → rotation et perte de mémoire institutionnelle
- Surcoûts pour la copropriété (relances oubliées, devis non comparés, délais)
- 66% des copropriétaires mécontents de leur syndic ([ANHA 2024](./research/01-analyse-industrie.md)) — mais le CS manque d'outils pour exercer son rôle de contrôle

**Comment ils gèrent aujourd'hui** : groupes WhatsApp + email + Google Drive + Excel + extranet syndic. Ça marche, mais l'information est éparpillée et aucun outil ne donne une vision unifiée par dossier.

## La Solution

### Job principal : retrouver un dossier et communiquer dessus

**Deux canaux d'entrée :**

| Canal | Quand | Comment |
|---|---|---|
| **WhatsApp forward** | Louise reçoit un doc par mail/WhatsApp, le forward à l'agent | Automatique — IA analyse et crée le signalement |
| **Upload dans l'app** | Louise est dans l'app et veut ajouter un fichier | Bouton "+" sur la page dossiers → sélection fichier → même analyse IA |

Les deux passent par le même pipeline Claude (analyse, classification, résumé). Seul le point d'entrée change.

**Le parcours en 3 temps :**

1. **L'info entre** — Louise forward un PDF par WhatsApp ou upload depuis l'app. L'IA (Claude Sonnet) analyse le contenu, extrait le titre, l'urgence, un résumé et la prochaine action. Un signalement structuré apparaît dans l'inbox.

2. **Louise retrouve l'info en secondes** — Elle ouvre l'app, consulte le dossier. Le résumé IA, la chronologie, les documents et les notes sont centralisés sur un seul écran.

3. **Elle communique** — Depuis le dossier, elle partage l'info avec les autres membres du CS via notification push, ou génère un lien partageable à coller dans le groupe WhatsApp de la copro pour informer les résidents.

### Onboarding

L'onboarding guide le testeur jusqu'à son premier dossier créé :

```
Écran 1 — LE FLOW (visuel, 3 étapes)
  📧 Vous recevez un dossier → 📲 Vous le forwardez → ✅ Il apparaît structuré
  par mail ou WhatsApp        à Septrion via WhatsApp    dans votre app
  
  "C'est tout. L'IA fait le reste."
                                         [Commencer →]

Écran 2 — INSTALLER L'APP
  "Ajoutez Septrion à votre écran d'accueil pour recevoir les notifications"
  📱 iOS : Partager → Sur l'écran d'accueil
  🤖 Android : Menu ⋮ → Installer l'application
                                         [C'est fait →]

Écran 3 — VOTRE PROFIL
  Prénom : [________]
  Nom de votre copropriété : [________]
                                         [Continuer →]

Écran 4 — CONNECTEZ WHATSAPP
  "Enregistrez ce numéro pour pouvoir forwarder vos documents"
                    [Ajouter le contact Septrion]

Écran 5 — VOTRE PREMIER DOSSIER
  "Essayez maintenant : envoyez un document à Septrion sur WhatsApp"
                    [Ouvrir WhatsApp]
  ⏳ En attente de votre premier document...
  ✅ Reçu ! → [Voir votre dossier]
```

**Pourquoi cet ordre** : l'installation PWA (écran 2) doit précéder le reste car sans elle, pas de push sur iOS. L'écran 1 ancre le concept. L'écran 5 garantit le premier wow avant de quitter l'onboarding.

### Boucle de rétention : le digest hebdo automatisé

Plutôt qu'un rappel manuel (Wizard of Oz), un cron Supabase automatisé :

```
Tous les lundis 9h :
  → Requête : dossiers actifs, mises à jour, signalements en attente
  → Claude résume en 3 lignes
  → Push notification aux membres CS
  → "3 dossiers actifs, 1 bloqué. Voir le résumé →"
```

Même pattern technique que le webhook WhatsApp existant, déclenché par un cron au lieu d'un message entrant. Effort estimé : une demi-journée.

## Ce Qui Rend Septrion Différent

| Critère | Outils existants | Septrion |
|---------|-----------------|----------|
| **Ingestion** | Saisie manuelle ou import fichier | WhatsApp forward + upload → IA analyse automatiquement |
| **Intelligence** | Aucune (stockage passif) | Résumé IA, classification urgence, suggestion d'action |
| **Cible** | Syndic (Genius, Bellman, Syndic AI) ou copropriétaire (extranets) | Le conseil syndical comme persona distinct |
| **Mobile** | Web-only (Conseil Syndical IO, Domino.immo, EXTRACS) | PWA mobile-first, installable, push notifications |
| **Proactivité** | Aucune — l'utilisateur doit aller chercher | Digest hebdo automatisé, alertes dossiers bloqués |

**Le vrai moat** : la **base de connaissance accumulée** par copropriété — historique de dossiers, documents, chronologies, résumés enrichis. Plus le CS utilise Septrion, plus l'assistant est pertinent. Quand un nouveau membre rejoint le CS (rotation annuelle), la mémoire est dans l'outil, pas dans la tête du prédécesseur.

**Concurrents directs identifiés** :
- **MonConseilSyndical** — app mobile native pour CS, la plus proche en positionnement. Mais zéro IA, zéro WhatsApp, saisie manuelle. ([source web research](./research/02-paysage-concurrentiel.md))
- **EXTRACS** — espace collaboratif web pour CS, freemium limité, UX datée, pas d'IA
- **Genius.immo** — accès CS via GPT, mais gated par le syndic (le syndic doit souscrire)
- **Conseil Syndical IO** — gratuit, web-only, pas d'IA, pas d'ingestion auto
- **Domino.immo** — multi-rôles (syndic + CS + copropriétaires), nécessite adoption par toutes les parties

## Qui Utilise Septrion

**Utilisateur MVP** : Membre actif du conseil syndical (président, trésorier ou membre engagé) dans une copropriété de +20 lots avec syndic professionnel. Bénévole, gère la copro en dehors de son travail. Utilise WhatsApp quotidiennement.

**Marché adressable** : 65 000 à 80 000 copropriétés en France correspondent à ce profil ([source : analyse industrie](./research/01-analyse-industrie.md)).

**Le moment "aha"** se joue en deux temps :
1. **Ingestion (jour 1)** : Louise forward un PDF et le retrouve structuré en 30 secondes. Wow immédiat.
2. **Retrieval (semaine 2+)** : Un voisin demande "on en est où ?" et Louise retrouve tout instantanément au lieu de fouiller 30 minutes. C'est le vrai aha — celui qui crée la rétention.

**Volume critique** : la valeur retrieval se déclenche à partir de **5 dossiers**. En dessous, Louise retient tout de mémoire. Au-dessus, Septrion devient indispensable. Implication : pré-charger 3-4 dossiers seed à partir de documents réels fournis par le testeur lors du setup.

## Hypothèses et Kill Criteria

| Hypothèse | Seuil de validation | Seuil d'abandon |
|---|---|---|
| Le CS forward des documents spontanément | 5+ docs en 2 semaines sans sollicitation | <2 docs malgré relance |
| Le CS revient après le digest hebdo | Clique dans les 24h, 2 semaines de suite | Ignore 2 digests consécutifs |
| Le CS utilise le partage/notification | Au moins 1 partage en 2 semaines | Jamais utilisé en 3 semaines |
| L'IA produit des résumés utiles | Le testeur ne corrige pas le résumé plus de 20% du temps | Plus de 50% des résumés jugés inutiles ou incorrects |

## Métriques de Succès MVP

**Analytics : PostHog** (gratuit, SDK React, autocapture)

Dès l'installation du SDK, sans code supplémentaire :
- Pages visitées et boutons cliqués par testeur identifié (onboarding prénom + copro)
- Rétention J+1, J+7 par utilisateur
- Temps par session et fréquence de retour

Actions clés trackées :
- `signalement_qualified` — signalement transformé en dossier
- `dossier_viewed` — consultation d'un dossier
- `notification_sent` — push envoyée aux membres CS
- `link_shared` — lien partageable copié
- `document_uploaded` — fichier ajouté manuellement

## Scope MVP

### Ce qui est dedans

- **Onboarding** : flow visuel 5 écrans (explication → install PWA → profil → WhatsApp → premier dossier)
- **Ingestion WhatsApp** : agent avec analyse IA (Claude Sonnet) → signalement structuré
- **Upload manuel** : bouton "+" sur la page dossiers → même pipeline IA
- **Inbox triage** : qualifier / rejeter un signalement → créer un dossier
- **Détail dossier** : résumé IA, chronologie, documents, notes internes
- **Communication** : push notification aux membres CS + lien partageable pour les résidents
- **Dashboard** : événements, mises à jour, accès rapides
- **Digest hebdo automatisé** : cron Supabase → résumé IA → push aux membres CS
- **Analytics** : PostHog (pageview, autocapture, identification par testeur)
- **Pré-chargement** : 3-4 dossiers seed par copro test à partir de vrais documents

### Ce qui est explicitement dehors

- Authentification (magic link, login) — pas nécessaire avec 2-3 testeurs identifiés par l'onboarding
- Email comme canal d'entrée — Phase 1 post-validation
- Chat interne entre membres du CS
- Interface résidents dédiée
- Multi-copropriété
- Rattachement IA automatique (suggestion "ce document ressemble au dossier X")
- Notifications WhatsApp sortantes vers les copropriétaires (contraintes Meta Business API)

## Ce Qu'on Ne Sait Pas

Transparence sur les points non vérifiés issus de la recherche domaine :

| Claim | Statut | Source | Impact si faux |
|---|---|---|---|
| "Référent numérique" obligatoire CS +50 lots | **NON VÉRIFIÉ** — décret cité non trouvé sur Légifrance | [Village Justice](https://www.village-justice.com/articles/copropriete-2026-virage-numerique-financier-energetique,55957.html) | Perd un persona institutionnel, mais le besoin reste réel |
| Budget CS = 5% du prévisionnel | **NON VÉRIFIÉ** — le % n'apparaît dans aucune source primaire | Même article | La monétisation via budget de délégation (art. 21-2) reste valide, seul le montant est incertain |
| Marché adressable = 65-80k copros | **ESTIMATION** — fourchette large, basée sur croisement de sources | [ANIL 2025](https://www.anil.org/immatriculation-coproprietes/), [Mon Immeuble](https://monimmeuble.com/actualite/les-chiffres-cles-de-la-copropriete) | Ordre de grandeur fiable, chiffre exact secondaire au stade MVP |

## RGPD — Minimum Requis Avant Test

Prérequis légaux, pas des features optionnelles :

- [ ] Politique de confidentialité accessible dans la PWA (données collectées, finalités, durée, droits)
- [ ] DPA signé avec Anthropic ([disponible ici](https://www.anthropic.com/policies))
- [ ] DPA signé avec Supabase
- [ ] Documentation des flux de données (WhatsApp → Supabase Storage → Claude API → Supabase DB → App)
- [ ] Consentement explicite pour les notifications push à l'onboarding
- [ ] Mention visible que les résumés sont générés par IA (transparence EU AI Act)

## Vision

Si Septrion fonctionne, il devient en 2-3 ans la **mémoire institutionnelle de la copropriété** — un outil que les CS transmettent d'une mandature à l'autre, qui accumule l'historique, apprend le contexte de chaque immeuble, et guide proactivement les membres vers les bonnes actions.

**Court terme (6 mois)** : email comme 2ème canal, auth Supabase, rattachement IA des documents aux dossiers existants, résumé IA dynamique enrichi à chaque événement.

**Moyen terme (12 mois)** : multi-copropriété, app store (React Native), partenariat ARC (5 400+ CS au salon annuel), offre commerciale via le budget de délégation CS (art. 21-2 loi 1965).

**Long terme** : intégration extranets syndics, agent IA proactif ("vous devriez relancer le syndic, ça fait 3 semaines sans réponse"), benchmark inter-copropriétés.

---

**Stack technique** : React 18 + Vite + Tailwind + shadcn/ui (PWA) | Supabase (Postgres + Edge Functions + Storage) | Claude Sonnet API | WhatsApp Business API | PostHog (analytics)

**Équipe** : David (tech/produit), Jamel, Ibtissem

**Repo** : https://github.com/David126812/copro-pilote
**Démo live** : https://david126812.github.io/copro-pilote/dashboard
