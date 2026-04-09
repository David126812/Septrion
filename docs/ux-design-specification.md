---
stepsCompleted:
  - "step-01-init"
  - "step-02-discovery"
  - "step-03-core-experience"
  - "screens-specification"
status: 'complete'
completedAt: '2026-04-09'
  - "step-03-core-experience"
inputDocuments:
  - "prd.md"
  - "architecture.md"
  - "epics.md"
  - "product-brief-septrion.md"
  - "product-brief-septrion-distillate.md"
---

# UX Design Specification — Septrion

**Author:** David
**Date:** 2026-04-09

---

## Executive Summary

### Vision Projet

Septrion est un filet de sécurité cognitif pour les bénévoles du CS. L'app doit **disparaître** — pas au sens d'être invisible, mais au sens de ne jamais faire perdre du temps. Chaque interaction doit être plus courte que l'alternative (chercher dans WhatsApp, fouiller ses emails). Si Louise met plus de temps avec Septrion que sans, on a échoué.

### Utilisateurs Cibles

**Louise** — 30-50 ans, bénévole CS, gère la copro le soir. Utilise WhatsApp quotidiennement. Tech-savviness modérée — à l'aise avec les apps mobiles, pas avec le jargon technique. Consulte l'app sur son **smartphone**, debout dans le hall ou assise dans le canapé. Sessions courtes (2-5 minutes), rarement plus.

**Contexte d'usage :**
- Souvent interrompue (entre deux activités perso)
- Connexion variable (4G, WiFi)
- Écran petit — tout doit être lisible d'un coup d'oeil
- Mains parfois occupées → l'agent vocal prend tout son sens

### Défis UX Clés

1. **Onboarding en 6 étapes** — Chaque étape ultra-légère (10 secondes max), stepper avec sentiment de progression rapide.
2. **Page création "+" à 3 modes** — Le flow guide naturellement. Upload = l'IA propose. Pas d'upload = saisie manuelle.
3. **Éléments cosmétiques / "Prochainement"** — Doivent donner envie, pas décevoir.
4. **Assistant IA chat + vocal** — Feature hero. Doit se sentir instantanée avec feedback visuel engageant.

### Opportunités Design

1. **Moment wow onboarding** — Upload → signalement structuré. Transition visuelle satisfaisante.
2. **Assistant IA comme point d'entrée principal** — Carte hero sur le dashboard.
3. **Inbox → Dossier en 2 taps** — Triage ultra-rapide.
4. **Résumé IA comme héros visuel** — Grand, lisible, au-dessus de la fold dans le détail dossier.

## Expérience Utilisateur Core

### Expérience Définissante

**Deux interactions définissent Septrion :**

1. **"Qu'est-ce qui se passe avec l'ascenseur ?"** → L'utilisateur pose la question à l'assistant IA, la réponse arrive en 3 secondes avec le contexte complet. C'est le moment qui crée la rétention.

2. **Forward → signalement structuré** → L'utilisateur envoie un document, il le retrouve analysé et prêt à qualifier. C'est le moment qui crée le wow.

Tout le reste de l'app est au service de ces deux moments.

### Stratégie Plateforme

- **PWA mobile-first** — smartphone, une main, pouce accessible
- **Touch-based** — pas de hover states, zones de tap généreuses (44px minimum)
- **Pas d'offline** — connexion requise (IA + Supabase)
- **Sessions courtes** — 2-5 minutes max, l'app doit charger en <2 secondes

### Interactions Sans Friction

| Action | Objectif | Taps max |
|---|---|---|
| Poser une question à l'assistant | Réponse contextuelle | 1 (parler) ou tap + texte |
| Qualifier un signalement → dossier | Signalement traité | 2 taps |
| Consulter un dossier | Résumé visible | 1 tap depuis la liste |
| Changer le statut d'un dossier | Statut mis à jour | 2 taps |
| Créer un signalement manuel | Signalement créé | Formulaire + 1 tap submit |

### Moments Critiques de Succès

1. **Premier document (onboarding)** — Animation de transition obligatoire : "Analyse en cours..." → résultat qui apparaît.
2. **Première question à l'assistant** — Réponse rapide et juste dès la première interaction.
3. **Premier triage** — Qualification en 2 taps, pas de formulaire laborieux.

### Principes d'Expérience

1. **Plus rapide que l'alternative** — Chaque action doit prendre moins de temps que WhatsApp + email + Drive.
2. **L'IA travaille, l'humain valide** — L'utilisateur ne saisit jamais ce que l'IA peut deviner.
3. **2 taps pour l'essentiel** — Consulter, qualifier, changer statut = 2 taps max.
4. **Mobile, une main, pouce** — Zone naturelle du smartphone (bas de l'écran).

## Spécifications Écran par Écran

### Navigation globale

**Bottom nav (persistante sauf Auth et Onboarding) :**
- Dashboard (icône maison)
- Dossiers (icône dossier)
- **"+" central** (bouton primaire, créer signalement)
- Signalements (icône inbox + badge count)
- Assistant IA (icône micro/chat)

**Auth guard :** Non connecté → `/auth`. Connecté mais onboarding non complété → `/onboarding`. Sinon → `/dashboard`.

---

### 1. Auth (`/auth`)

Pas de bottom nav. Écran plein. Logo Septrion en haut.

**Inscription :**
- Champ numéro de téléphone (format international, préfixe +33)
- Champ email (optionnel)
- Champ mot de passe (8 car. min, toggle visibilité)
- Bouton "Créer mon compte" (btn-gradient, pleine largeur)
- Lien "Déjà un compte ? Se connecter"

**Connexion :**
- Champ numéro + mot de passe
- Bouton "Se connecter" (btn-gradient)
- Lien "Pas encore de compte ? S'inscrire"

**Erreurs :** Toast haut écran.

---

### 2. Onboarding (`/onboarding`)

Pas de bottom nav. Stepper en haut (5 points, actif coloré).

**Étape 1 — Explication visuelle :**
Illustration/animation : document → Septrion → dossier structuré. Texte court 2 lignes. Bouton "Suivant".

**Étape 2 — Inscription + profil fusionnés :**
Deux blocs visuels sur le même écran :
- Bloc "Votre compte" : numéro de téléphone, mot de passe (toggle visibilité), email (optionnel)
- Bloc "Votre profil" : prénom, nom copropriété, checkbox opt-in notifications
- Nombre de lots NON demandé ici (déplacé dans Settings)
- Bouton "Créer mon compte" (désactivé si numéro + mdp + prénom + copro vides)

**Étape 3 — Installation PWA :**
Instructions visuelles iOS + Android. Bouton "C'est fait".

**Étape 4 — WhatsApp :**
Contenu explicatif (texte + image/vidéo) : comment ajouter le contact et forwarder un document. Numéro affiché + bouton "Copier". Bouton "Suivant".

**Étape 5 — Premier document :**
Trois boutons en stack vertical :
1. "Uploader un document" (icône upload) → sélecteur fichier → pipeline IA → signalements
2. "Utiliser un document exemple" (icône sparkle) → upload dummy in-app → signalements
3. "Explorer d'abord" (style secondaire) → dashboard

Si option 1 ou 2 : indicateur "Analyse en cours..." → animation de succès → "Votre premier signalement est prêt !" → bouton "Voir"

---

### 3. Dashboard (`/dashboard`)

Bottom nav visible. Page d'accueil.

**Header :** "Résidence [copro]" (small muted) + "Bonjour [prénom]" (bold 26px) + avatar initiales → Settings

**Carte hero : Assistant IA** — Fond gradient, icône micro + "Parler à l'assistant" + sous-titre + flèche → `/assistant`. **Fonctionnel.**

**Quick actions (3 grid) :** Signaler incident, Dossiers, Signalements (badge count).

**Section "Prochains événements" :** Données dummy (badge "Exemple"). Bouton "Créer un événement" avec badge "Prochainement".

**Section "Activité récente" :** Remontée auto 4 derniers événements dossiers. Tap → détail dossier.

---

### 4. Signalements (`/signalements`)

**Liste :** Triée par date desc. Chaque carte : titre (bold), badge urgence coloré, localisation, résumé 2 lignes, date relative. Mise à jour temps réel (Supabase Realtime).

**Détail signalement (tap) :** Résumé complet + document attaché + 3 boutons :
1. "Créer un dossier" (primary)
2. "Rattacher à un dossier" (secondary) → liste dossiers → sélection → rattachement + régénération résumé IA
3. "Rejeter" (destructive discret) → confirmation

---

### 5. Signaler un incident (`/signaler-incident`)

Accessible via "+" central.

**Formulaire :**
- Titre (obligatoire)
- Localisation (chips : Parking, Hall, Ascenseur, Escalier, Façade, Toiture, Parties communes, Cave, Extérieur, Autre)
- Description (textarea, optionnel)
- Zone upload (bordure dashed + icône caméra). Après upload : preview + bouton "Analyser avec l'IA" (sparkle). Clic = spinner → pré-remplissage champs modifiables. Sans clic = fichier juste attaché.
- Pas de champ urgence (normal par défaut, IA détermine si analyse)
- Bouton "Envoyer" (btn-gradient, désactivé si titre vide)

**Succès :** Écran check + "Signalement créé !" → redirection 1.5s.

---

### 6. Liste dossiers (`/dossiers`)

Triée par updated_at desc. Chaque carte : titre, badge statut (bleu en_cours, rouge bloqué, gris terminé), badge urgence, date. Dossiers terminés atténués. Dossiers bloqués en évidence (bordure ou icône). Tap → détail.

---

### 7. Détail dossier (`/dossiers/:id`)

**Encart héros — Résumé IA :** Fond léger, padding généreux. Résumé (14px, lisible). Badge urgence + statut. "Prochaine action :" en bold. Mention "Résumé généré par IA". Skeleton loader si régénération en cours.

**Boutons d'action :**
- Changement statut → dropdown transitions possibles
- Partager → UI cosmétique (choix résidents/CS, message pré-rempli, envoi = loop solo, "Communiquer aux résidents" visible comme feature cosmétique)

**Timeline :** Chronologique, check vert (done) / cercle vide (todo).

**Documents :** Liste avec nom + type + icône. Tap → ouvrir.

---

### 8. Assistant IA (`/assistant`)

**Référence UI : repo jhgu (`VoiceAgent.tsx`)**

**Header :** Avatar gradient "CS" + "Assistant Septrion" + sous-titre.

**État idle (pas de conversation) :**
- Grand bouton micro central (w-24 h-24, rond, `bg-primary/10`, bordure `primary/20`)
- "Appuyez pour parler" (14px bold)
- Sous-texte explicatif (12px muted)
- Bouton "Ajouter une photo" (optionnel)

**Micro actif :**
- Bouton scale-110 + `bg-primary` + shadow glow (`shadow-[0_0_40px_rgba(37,99,235,0.4)]`)
- Icône micro pulsante (`animate-pulse`)
- Texte "Je vous écoute…"

**Conversation (après première question) :**
- Bulles user (droite) : fond primary, texte blanc, `rounded-2xl rounded-br-md`
- Bulles agent (gauche) : fond secondary, bordure, `rounded-2xl rounded-bl-md`, avatar gradient
- **Animation entrée agent :** `animate-in fade-in slide-in-from-left-2 duration-300`

**Typing indicator (IA réfléchit) :**
- 3 dots qui rebondissent (`animate-bounce` avec delays staggerés : 0ms, 150ms, 300ms)
- Dans une bulle agent avec avatar
- Délai proportionnel à la longueur de la réponse : `Math.min(1800, Math.max(700, text.length * 6))` ms
- **Séquence obligatoire :** message user → typing indicator → réponse agent (jamais instantané)

**Chips de question (dernier message uniquement) :**
- Boutons pleine largeur, `rounded-[12px]`, bordure, icône + texte bold + chevron
- Tap → sélection → nouveau cycle user → typing → agent

**Actions contextuelles :**
- Même style que chips avec description sous le label
- Ex : "Consulter le dossier" (description: "Ascenseur bâtiment C"), "Créer un signalement"
- Tap → navigation ou modal

**Success screen :**
- Overlay plein écran, fond card
- Icône check vert (cercle vert clair + check vert foncé)
- Titre bold + description muted + bouton CTA primaire

**Barre de saisie (sticky bas) :**
- Champ texte "Posez votre question..."
- Bouton envoyer (icône send)
- Bouton micro (icône mic, rond)

**Suggestions initiales :** Chips : "Où en est l'ascenseur ?", "Quels dossiers sont bloqués ?", "Résume la situation"

---

### 9. Settings (`/settings`)

Profil (prénom, copropriété — lecture seule), nombre de lots (sélecteur +/−, modifiable), toggle notifications, lien politique de confidentialité, mention IA, bouton déconnexion.

---

### Patterns transversaux

**Loading :** Analyse IA = skeleton pulse + "Analyse en cours...". Pages = skeleton cards. Boutons = spinner inline.

**Erreurs :** Toast (sonner) réseau/API. Validation inline (bordure rouge + texte).

**Dummy :** Badge "Exemple" discret, couleur atténuée.

**"Prochainement" :** opacity 0.5 + badge outline. Disabled.
