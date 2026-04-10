---
stepsCompleted:
  - "step-01-init"
  - "step-02-discovery"
  - "step-03-core-experience"
  - "screens-specification"
  - "step-04-review-sally"
status: 'complete'
completedAt: '2026-04-10'
inputDocuments:
  - "prd.md"
  - "architecture.md"
  - "epics.md"
  - "product-brief-septrion.md"
  - "product-brief-septrion-distillate.md"
---

# UX Design Specification — Septrion

**Author:** David (revu avec Sally)
**Date:** 2026-04-10

---

## Executive Summary

### Vision Projet

Septrion est un filet de securite cognitif pour les benevoles du CS. L'app doit **disparaitre** — pas au sens d'etre invisible, mais au sens de ne jamais faire perdre du temps. Chaque interaction doit etre plus courte que l'alternative (chercher dans WhatsApp, fouiller ses emails). Si Louise met plus de temps avec Septrion que sans, on a echoue.

### Utilisateurs Cibles

**Louise** — 30-50 ans, benevole CS, gere la copro le soir. Utilise WhatsApp quotidiennement. Tech-savviness moderee — a l'aise avec les apps mobiles, pas avec le jargon technique. Consulte l'app sur son **smartphone**, debout dans le hall ou assise dans le canape. Sessions courtes (2-5 minutes), rarement plus.

**Contexte d'usage :**
- Souvent interrompue (entre deux activites perso)
- Connexion variable (4G, WiFi)
- Ecran petit — tout doit etre lisible d'un coup d'oeil
- Mains parfois occupees → l'agent vocal prend tout son sens

### Defis UX Cles

1. **Onboarding en 5 etapes** — Chaque etape ultra-legere (10 secondes max), stepper avec sentiment de progression rapide. Bouton "Passer" sur les etapes informatives.
2. **Deux parcours de signalement distincts** — WhatsApp passe par l'inbox de triage. In-app cree un dossier directement.
3. **Elements cosmetiques / "Prochainement"** — Doivent donner envie, pas decevoir. Chip outline "Exemple" sur chaque element dummy.
4. **Assistant IA chat + vocal** — Feature hero. Animations de raisonnement engageantes, interactions fluides comme une vraie app native.

### Opportunites Design

1. **Moment wow onboarding** — Upload → signalement structure. Transition visuelle satisfaisante.
2. **Assistant IA comme point d'entree principal** — Carte hero sur le dashboard.
3. **Inbox WhatsApp → Dossier en 2 taps** — Triage ultra-rapide.
4. **Resume IA comme heros visuel** — Grand, lisible, au-dessus de la fold dans le detail dossier.

## Experience Utilisateur Core

### Experience Definissante

**Deux interactions definissent Septrion :**

1. **"Qu'est-ce qui se passe avec l'ascenseur ?"** → L'utilisateur pose la question a l'assistant IA, la reponse arrive en 3 secondes avec le contexte complet. C'est le moment qui cree la retention.

2. **Forward → signalement structure** → L'utilisateur envoie un document, il le retrouve analyse et pret a qualifier. C'est le moment qui cree le wow.

Tout le reste de l'app est au service de ces deux moments.

### Strategie Plateforme

- **PWA mobile-first** — smartphone, une main, pouce accessible
- **Touch-based** — pas de hover states, zones de tap genereuses (44px minimum)
- **Pas d'offline** — connexion requise (IA + Supabase)
- **Sessions courtes** — 2-5 minutes max, l'app doit charger en <2 secondes

### Deux Parcours de Signalement

**Flow WhatsApp (passif — l'info arrive) :**
Document recu par WhatsApp → Analyse IA → Signalement dans l'inbox (`/signalements`) → Louise qualifie : creer dossier OU rattacher OU rejeter → Dossier cree/enrichi

**Flow in-app "+" (actif — Louise signale) :**
Louise tape "+" → Formulaire (`/signaler-incident`) → Submit → Dossier cree directement → Redirection vers la liste des dossiers

### Interactions Sans Friction

| Action | Objectif | Taps max |
|---|---|---|
| Poser une question a l'assistant | Reponse contextuelle | 1 (parler) ou tap + texte |
| Qualifier un signalement WhatsApp → dossier | Signalement traite | 2 taps |
| Signaler un incident in-app → dossier | Dossier cree | Formulaire + 1 tap submit |
| Consulter un dossier | Resume visible | 1 tap depuis la liste |
| Changer le statut d'un dossier | Statut mis a jour | 2 taps (crayon → modal) |

### Moments Critiques de Succes

1. **Premier document (onboarding)** — Spinner centré → check vert anime → "Votre premier signalement est pret !".
2. **Premiere question a l'assistant** — Animation de raisonnement engageante → reponse rapide et juste.
3. **Premier triage** — Qualification en 2 taps, pas de formulaire laborieux.

### Principes d'Experience

1. **Plus rapide que l'alternative** — Chaque action doit prendre moins de temps que WhatsApp + email + Drive.
2. **L'IA travaille, l'humain valide** — L'utilisateur ne saisit jamais ce que l'IA peut deviner.
3. **2 taps pour l'essentiel** — Consulter, qualifier, changer statut = 2 taps max.
4. **Mobile, une main, pouce** — Zone naturelle du smartphone (bas de l'ecran).

## Specifications Ecran par Ecran

### Navigation globale

**Header global (toutes les pages protegees) :**
- Titre de la page a gauche
- Avatar initiales en haut a droite → `/settings`
- Pages de detail : bouton retour "←" a gauche + titre + avatar a droite
- Animation avatar au tap : `scale-95` (feedback tactile)

**Bottom nav (persistante sauf Auth, Onboarding et modals plein ecran) :**
- Dashboard (icone maison)
- Dossiers (icone dossier)
- **"+" central** (cercle primary 56px, floating, sureleve 12px, `shadow-lg`, animation `scale-95` au tap) → modal plein ecran `/signaler-incident`
- Signalements (icone inbox + badge count rouge si >0, masque si 0)
- Assistant IA (icone micro/chat)
- Onglet actif : icone + label en couleur `primary`, animation `scale` subtil
- **Fixee en bas**, toujours visible au scroll (`fixed bottom-0`)
- Padding bottom sur toutes les pages (~80px)

**Animations de transition entre pages :**
- Navigation entre onglets : **slide horizontal** (gauche/droite selon la position)
- Ouverture du "+" : **slide-up** depuis le bas
- Retour depuis une modal : **slide-down**
- Navigation vers un detail : **slide-in depuis la droite**
- Retour "←" : **slide-out vers la droite**

**Auth guard :** Non connecte → `/auth`. Connecte mais onboarding non complete → `/onboarding`. Sinon → `/dashboard`.

---

### 1. Auth (`/auth`)

Pas de bottom nav. Pas de header global. Ecran plein. Logo Septrion en haut.

**Inscription :**
- Champ email
- Champ mot de passe (8 car. min, toggle visibilite)
- Helper text inline sous le champ mot de passe : "8 caracteres minimum" (muted, passe en vert quand satisfait)
- Bouton "Creer mon compte" (btn-gradient, pleine largeur) — **disabled tant que email ou mot de passe sont vides**
- Lien "Deja un compte ? Se connecter"

**Connexion :**
- Champ email + mot de passe
- Bouton "Se connecter" (btn-gradient)
- Lien "Mot de passe oublie ?" — declenche `resetPasswordForEmail` de Supabase
- Lien "Pas encore de compte ? S'inscrire"

**Erreurs :** Toast haut ecran pour erreurs serveur. Validation inline (bordure rouge + texte) pour les champs.

---

### 2. Onboarding (`/onboarding`)

Pas de bottom nav. Pas de header global. Stepper en haut (5 points, actif colore).

**Logique du bouton "Passer" :**

| Etape | Bouton "Passer" | Raison |
|-------|----------------|--------|
| 1 — Explication | Oui | Informatif seulement |
| 2 — Profil | Non | Champs obligatoires |
| 3 — Installation PWA | Oui | Informatif, pas verifiable |
| 4 — WhatsApp | Oui | Informatif, elle peut le faire plus tard |
| 5 — Premier document | Non | L'option "Explorer d'abord" joue ce role |

Le "Passer" est un **lien texte muted** sous le bouton principal (discret). "Passer" avance a l'etape suivante dans le stepper (pas a la fin de l'onboarding).

---

**Etape 1 — Explication visuelle :**

Sequence narrative en 3 temps qui raconte toute l'histoire de Septrion :

**Temps 1 — Collecter :**
Visuel : icones dispersees (email, WhatsApp, PDF) → fleche convergente vers un point central.

**Temps 2 — Structurer :**
Visuel : le point central s'ouvre en une carte dossier structuree (titre, badge statut, resume).

**Temps 3 — Informer :**
Visuel : de la carte dossier, des fleches partent vers des icones de personnes (silhouettes residents) avec une petite bulle notification.

Realisation : icones Lucide (Mail, MessageCircle, FileText, Users, Bell) + agencement Tailwind. Optionnel : `animate-fade-in` sequentiel sur chaque temps (0ms, 300ms, 600ms).

**Texte principal** (bold, 20-22px, centre) :
> **"Envoyez un document.**
> **L'IA le structure.**
> **Informez vos residents."**

**Boutons :**
- "Suivant" (primary, pleine largeur)
- "Passer" (lien muted)

---

**Etape 2 — Profil :**

L'inscription (email + mdp) a deja eu lieu sur `/auth`. Cette etape collecte le profil.

**Champs :**
- **Prenom** (obligatoire)
- **Numero WhatsApp** : prefixe `+33` affiche en dur (non effacable, muted, a gauche du champ). Louise tape ses chiffres a droite. Si elle tape `06...` → auto-reformatage (le `0` initial est supprime). Validation : exactement 9 chiffres apres +33. Message d'erreur inline si format incorrect : "Numero invalide — 9 chiffres attendus apres +33" (texte rouge, 12px).
- **Copropriete** : champ texte libre
- **Checkbox opt-in notifications** : **decochee par defaut** (RGPD). Libelle : "Je souhaite recevoir les notifications par WhatsApp et email"

**Bouton "Suivant"** : disabled tant que prenom vide OU numero WhatsApp < 9 chiffres OU copro vide. Au clic : validation format WhatsApp → si invalide, message d'erreur inline.

Pas de bouton "Passer" (champs obligatoires).

---

**Etape 3 — Installation PWA :**

**Detection de plateforme :**
- iOS (`navigator.userAgent` contient "iPhone" ou "iPad") → instructions iOS uniquement
- Android (`navigator.userAgent` contient "Android") → instructions Android uniquement
- Fallback (desktop, autre) → les deux empilees

**Contenu :**
- Texte : "Ajoutez Septrion a votre ecran d'accueil pour un acces rapide"
- 1 capture d'ecran annotee par plateforme (2 assets) :
  - `pwa-install-ios.png` — screenshot du menu Partage avec fleche vers "Sur l'ecran d'accueil"
  - `pwa-install-android.png` — screenshot du menu avec fleche vers "Installer l'application"

**Boutons :**
- "C'est fait" (primary)
- "Passer" (lien muted)

Pas de verification technique. Les deux avancent a l'etape 4.

---

**Etape 4 — WhatsApp :**

**Section 1 — "Comment ca marche" (carrousel) :**
3 images en carrousel horizontal (swipe) avec indicateurs dots (● ○ ○). Hauteur fixe ~200px pour que le reste de l'ecran soit visible sans scroll.

Slides :
1. "Vous recevez un devis par email" → capture d'un email avec piece jointe
2. "Vous le transferez a Septrion sur WhatsApp" → capture du forward WhatsApp
3. "Il apparait structure dans l'app" → capture de l'inbox avec le signalement

Chaque slide a une legende courte en dessous (1 ligne max).

**Section 2 — "Ajouter le contact Septrion" :**
- Numero affiche en gros (bold, 18px)
- Bouton "Ouvrir dans WhatsApp" (primary) → lien `https://wa.me/33XXXXXXXXX` — ouvre WhatsApp directement
- Bouton "Copier le numero" (secondary, outline) — fallback

**Boutons navigation :**
- "Suivant" (primary)
- "Passer" (lien muted)

Aucune verification. Louise peut le faire maintenant, plus tard, ou jamais.

**Assets a produire :** 3 images annotees pour le carrousel.

---

**Etape 5 — Premier document :**

Trois boutons en stack vertical :
1. **"Uploader un document"** (primary, icone upload) → selecteur fichier → pipeline IA → signalements
2. **"Utiliser un document exemple"** (secondary, icone sparkle) → pipeline IA sur document dummy realiste (PV d'AG fictif)
3. **"Explorer d'abord"** (outline muted) → dashboard avec dossiers seed

**Flow apres option 1 ou 2 :**

Etat analyse :
- **Spinner centre** + texte "Analyse en cours..." + sous-texte muted "Cela peut prendre quelques secondes"

Transition vers etat succes :
- **Check vert anime** (scale-in + fade) + texte "Votre premier signalement est pret !"
- Bouton "Voir" → redirige vers la page signalements

**Flow d'erreur :**
- Le spinner est remplace par : "L'analyse a echoue. Votre document est enregistre, vous pourrez le traiter manuellement."
- Bouton "Continuer vers le dashboard"

**Dans les 3 cas :** flag `onboarding_completed` enregistre dans `profiles`.

Pas de bouton "Passer" (l'option "Explorer d'abord" joue ce role).

---

### 3. Dashboard (`/dashboard`)

Bottom nav visible. Header global visible. Page d'accueil.

**Header :** "Residence [copro]" (small muted) + "Bonjour [prenom]" (bold 26px) + avatar initiales → `/settings`

**Ordre des sections (de haut en bas) :**

**1. Carte hero : Assistant IA** — Fond gradient, icone micro + "Parler a l'assistant" + sous-titre + fleche → `/assistant`. Fonctionnel.

**2. Quick actions (3 grid) :** Signaler incident (→ modal plein), Dossiers (→ `/dossiers`), Signalements (→ `/signalements`). Badge count rouge sur Signalements si >0, masque si 0.

**3. Alerte dossiers bloques (conditionnel)** — Visible uniquement s'il y a des dossiers bloques. Fond rose/rouge leger, texte d'alerte.

**4. Activite recente :** Remontee auto des derniers evenements dossiers. **Tri : plus recent en premier** (chronologie inversee). Tap → detail dossier. Chaque element dummy porte un **chip outline "Exemple"** (text-xs, muted, bord fin) en haut a droite.

**Etat vide activite recente :** "Aucune activite recente." + CTA "Envoyez un document pour commencer".

**5. Prochains evenements :** Donnees dummy. **Tri : plus proche dans le futur en premier.** Badge "Prochainement" sur le bouton "Creer un evenement". Chip outline "Exemple" sur chaque element dummy.

**Pas de bouton sign-out sur le dashboard** — il est dans Settings.

---

### 4. Signalements (`/signalements`)

**Rappel :** Cette page ne concerne que les signalements **issus de WhatsApp**. Les signalements in-app creent un dossier directement.

**Filtres par chips en haut :**
- 3 chips : **Nouveaux** (selectionne par defaut) · **Qualifies** · **Rejetes**
- Un signalement qualifie disparait de "Nouveaux" et apparait dans "Qualifies"
- Un signalement rejete disparait de "Nouveaux" et apparait dans "Rejetes"

**Liste :** Triee par date desc. Chaque carte : titre (bold), badge urgence colore, localisation, resume **`line-clamp-2`**, date relative. Mise a jour temps reel (Supabase Realtime).

**Etat vide (chip "Nouveaux") :** Illustration sympathique (inbox vide) + "Aucun signalement en attente".

**Detail signalement (tap → page dediee) :**
- Bouton retour "←" en haut a gauche
- Resume complet + document attache
- 3 boutons d'action :
  1. **"Creer un dossier"** (primary)
  2. **"Rattacher a un dossier"** (secondary) → bottom sheet avec liste des dossiers existants (barre de recherche si >5 dossiers)
  3. **"Rejeter"** (destructive discret) → confirmation

---

### 5. Signaler un incident (`/signaler-incident`)

Accessible via "+" central de la bottom nav et quick action "Signaler incident". **Ouvre en modal plein ecran** (slide-up). Pas de bottom nav. Bouton "Fermer" (✕) en haut a droite.

**Formulaire :**
- **Titre** (obligatoire)
- **Localisation** — champ texte libre, placeholder : "ex : Parking Bat B"
- **Description** (textarea, optionnel)
- **Zone upload** — bordure dashed + icone camera. Apres upload : preview + bouton "Analyser avec l'IA" (sparkle). Clic = spinner → pre-remplit titre + localisation + description (modifiables). Sans clic = fichier juste attache au dossier.
- Pas de champ urgence (normal par defaut, IA determine si analyse)
- **Bouton "Envoyer"** (btn-gradient, pleine largeur) — **disabled si titre vide**

**Submit → cree un dossier directement** (pas un signalement).

**Succes :** Check vert anime + "Dossier cree !" → bouton "Voir mes dossiers" → `/dossiers`.

---

### 6. Liste dossiers (`/dossiers`)

**Menu filtre + tri en haut a gauche :**
- **Filtre par statut** : Tous · En cours · Bloques · Termines
- **Tri** : Plus recent (par defaut) · Plus ancien · Urgence

**Cartes dossier :**
- Titre (bold)
- Badge statut (bleu en_cours, rouge bloque, gris termine)
- Badge urgence
- Date relative
- Dossiers termines : **opacity-60** (attenues)
- Dossiers bloques : **bordure gauche rouge** (`border-l-4 border-red-500`)

**Etat vide :** Illustration sympathique (dossier vide) + "Aucun dossier pour le moment".

Tap → detail dossier.

---

### 7. Detail dossier (`/dossiers/:id`)

**Header :** Bouton retour "←" a gauche + avatar a droite + **bouton crayon** en haut a droite → ouvre modal d'edition.

**Encart heros — Resume IA :** Fond leger, padding genereux. Resume (14px, lisible). Badge urgence + statut. "Prochaine action :" en bold. Mention "Resume genere par IA". Si regeneration en cours : ancien resume visible + badge "Mise a jour en cours...".

**Modal d'edition (crayon) :**
Modal plein ecran avec bouton "Fermer" (✕). Sections editables :
- **Statut** → select avec les transitions possibles
- **Titre** → champ texte modifiable
- **Urgence** → select (normal, urgent, critique)
- **Localisation** → champ texte modifiable
- **Documents** → liste avec bouton supprimer (✕) par document + bouton "Ajouter un document" (upload)
- Bouton "Enregistrer" (primary) en bas

**Bouton "Partager" :**
Ouvre une **modal plein ecran**. Choix de la cible : "CS uniquement" ou "Residents" (2 boutons radio). Message pre-rempli en rapport avec le dossier (titre, statut, resume). Bouton "Envoyer" → **page de succes** (check vert + "Message envoye !") pour la gamification. En loop solo MVP : Louise recoit le message par WhatsApp et par email.

**Timeline :** Chronologique. Types d'evenements : creation du dossier, changement de statut, document ajoute, signalement rattache. Check vert (done) / cercle vide (todo). Chaque event a un texte descriptif.

**Documents :** Liste avec nom + type + icone. Tap → **ouvre dans un nouvel onglet** (MVP). A terme : preview in-app.

---

### 8. Assistant IA (`/assistant`)

**Reference UI : repo jhgu (`VoiceAgent.tsx`)**

**Header :** Avatar gradient "CS" + "Assistant Septrion" + sous-titre.

**Etat idle (pas de conversation) :**
- Grand bouton micro central (w-24 h-24, rond, `bg-primary/10`, bordure `primary/20`)
- "Appuyez pour parler" (14px bold)
- Sous-texte explicatif (12px muted)
- Bouton "Ajouter une photo" → envoie pour analyse IA

**Micro actif :**
- Bouton scale-110 + `bg-primary` + shadow glow (`shadow-[0_0_40px_rgba(37,99,235,0.4)]`)
- Icone micro pulsante (`animate-pulse`)
- Texte "Je vous ecoute..."

**Conversation (apres premiere question) :**
- Bulles user (droite) : fond primary, texte blanc, `rounded-2xl rounded-br-md`. Animation : `slide-in-from-right`.
- Bulles agent (gauche) : fond secondary, bordure, `rounded-2xl rounded-bl-md`, avatar gradient. Animation : `fade-in slide-in-from-left-2 duration-300`.
- **Auto-scroll** vers le bas a chaque nouveau message.
- Historique en memoire React (session-only, pas de persistence cross-visite).

**Animation de raisonnement (IA reflechit) :**
Declenchee apres chaque input (texte, voix, clic chip, clic action). Pas juste 3 dots — un vrai indicateur de travail :
- Bulle agent avec avatar gradient
- **Texte anime qui cycle** : "Recherche dans vos dossiers..." → "Analyse en cours..." → "Preparation de la reponse..."
- 3 dots bounce en dessous du texte (delays staggeres : 0ms, 150ms, 300ms)
- Duree proportionnelle a la longueur de la reponse : `Math.min(2500, Math.max(800, text.length * 6))` ms

**Chips de question (dernier message uniquement) :**
- Boutons pleine largeur, `rounded-[12px]`, bordure, icone + texte bold + chevron
- Animation : `fade-in` staggere (150ms entre chaque)
- Tap → le chip se transforme en bulle user → animation raisonnement → reponse agent

**Actions contextuelles :**
- Meme style que chips avec description sous le label
- Tap sur "Creer un signalement" → `/signaler-incident` **pre-rempli** avec le contexte de la conversation
- Tap sur "Voir le dossier" → navigation vers `/dossiers/:id`
- Tap sur "Partager cette info" → ouvre modal partage pre-remplie
- Animation apres clic : animation raisonnement → ecran succes ou navigation

**Message de cadrage (hors sujet) :**
> "Je suis votre assistant copropriete ! Je peux vous aider sur vos dossiers, signalements et documents. Que puis-je faire pour vous ? 😊"
Suivi de chips de relance : "Resume la situation", "Dossiers bloques ?", "Derniers signalements".

**Suggestions initiales (etat idle) :** "Ou en est l'ascenseur ?", "Quels dossiers sont bloques ?", "Resume la situation"

**Barre de saisie (sticky bas) :**
- Champ texte "Posez votre question..."
- Bouton envoyer (icone send)
- Bouton micro (icone mic, rond)

**Flows de discussion type :**

*Question sur un dossier :* "Ou en est l'ascenseur ?" → Raisonnement : "Recherche dans vos dossiers..." → Reponse avec resume, dernier devis, prochaine action → Chips : "Voir le dossier", "Changer le statut", "Partager cette info"

*Vue d'ensemble :* "Quels dossiers sont bloques ?" → Raisonnement → Liste des dossiers bloques avec raisons → Chips : "Voir [dossier X]", "Resume tous les dossiers"

*Resume global :* "Resume la situation" → Raisonnement plus long → Synthese (dossiers actifs, bloques, termines, signalements en attente, dossier le plus urgent) → Chips : "Dossiers urgents", "Signalements en attente"

*Photo envoyee :* Photo d'un degat → Preview dans bulle user → Raisonnement : "Analyse de votre photo..." → Description de ce que l'IA detecte → Chips : "Creer un signalement" (pre-rempli), "Ajouter a un dossier" (bottom sheet)

*Creation depuis l'assistant :* Clic sur "Creer un signalement" → Raisonnement : "Preparation du signalement..." → Ecran succes dans la conversation avec bouton "Valider et creer" → ouvre `/signaler-incident` pre-rempli

---

### 9. Settings (`/settings`)

Accessible via avatar initiales en haut a droite de **toutes les pages protegees**.

Mise en page : sections groupees dans des Cards avec separateurs (standard multi-plateforme).

**Section Profil :**
- Prenom (lecture seule)
- Copropriete (lecture seule)

**Section Copropriete :**
- Nombre de lots : input numerique editable avec boutons +/− (range 1-999)

**Section Notifications :**
- Toggle "Notifications WhatsApp" (on/off)
- Toggle "Notifications Email" (on/off)
- L'utilisateur peut activer les deux, un seul, ou aucun

**Section Legal :**
- Lien politique de confidentialite
- Mention IA

**Section Compte :**
- Bouton "Se deconnecter" (destructive) → `supabase.auth.signOut()` + redirect `/auth`

---

### Patterns transversaux

**Loading :** Analyse IA = spinner centre + texte + sous-texte. Pages = skeleton cards. Boutons = spinner inline.

**Erreurs :** Toast (sonner) reseau/API. Validation inline (bordure rouge + texte).

**Dummy :** Chip outline "Exemple" en haut a droite de **chaque element dummy individuellement** (text-xs, muted, bord fin).

**"Prochainement" :** opacity 0.5 + badge outline. Disabled.

**Animations globales :**
- Toutes les interactions sont animees (pas de changement d'etat instantane)
- Feedback tactile sur les boutons : `scale-95` au tap
- Transitions entre pages : slide horizontal (onglets), slide-up/down (modals), slide-in/out (details)
- Chips et listes : `fade-in` staggere
