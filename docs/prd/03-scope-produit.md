# Scope Produit

**Partie 3/9** | [Sommaire](./00-sommaire-prd.md) | [Document complet](../prd.md)

---

## MVP — Minimum Viable Product

- **Onboarding** : flow visuel 5 écrans (explication → install PWA → profil → WhatsApp → premier dossier)
- **Ingestion WhatsApp** : agent avec analyse IA (Claude Sonnet) → signalement structuré
- **Upload manuel** : bouton "+" sur la page dossiers → même pipeline IA
- **Inbox triage** : qualifier / rejeter un signalement → créer ou rattacher à un dossier
- **Détail dossier** : résumé IA, chronologie, documents, notes internes
- **Communication** : push notification aux membres CS + notification WhatsApp sortante (fallback push, mêmes infos + lien app) + bouton de partage avec écran de confirmation (flux UI uniquement — pas de livraison côté résident pour le MVP)
- **Dashboard** : événements récents, mises à jour, accès rapides
- **Digest hebdo** : déclenché manuellement pendant le test (automatisation cron post-MVP)
- **Analytics** : PostHog (pageview, autocapture, identification par testeur)
- **Pré-chargement** : 3-4 dossiers seed par copro test à partir de documents dummy (le testeur peut ajouter ses propres documents s'il le souhaite)
- **RGPD minimum** : politique de confidentialité, DPA Anthropic + Supabase, mention IA visible, consentement push

## Croissance (Post-MVP)

- Authentification Supabase (magic link email)
- Email comme 2ème canal d'entrée
- Rattachement IA suggeré dans l'inbox de triage
- Résumé IA dynamique enrichi à chaque événement
- Digest hebdo automatisé (cron Supabase)
- Architecture multi-LLM (Claude + Mistral pour tâches secondaires)
- Offre commerciale via budget de délégation CS (art. 21-2)

## Vision (Futur)

- Multi-copropriété (un président CS gère plusieurs copros)
- App store (React Native)
- Intégration extranets syndics (API ou scraping)
- Agent IA proactif (relances syndic, préparation AG, benchmark inter-copros)
- Interface résidents dédiée
- Chat interne CS

---
