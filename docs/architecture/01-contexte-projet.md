# Analyse de Contexte Projet

**Partie 1/6** | [Sommaire](./00-sommaire-architecture.md) | [Document complet](../architecture.md)

---

## Vue d'ensemble des exigences

**Exigences fonctionnelles :** 39 FRs organisées en 9 domaines de capacités, se mappant à 6 composants architecturaux principaux : pipeline d'ingestion, triage, gestion des dossiers, notifications, onboarding, dashboard/digest.

**Exigences non-fonctionnelles :**
- Sécurité : stockage non public, HTTPS, chiffrement API Claude, conformité RGPD
- Fiabilité : zéro perte sur le webhook WhatsApp, gestion d'erreur gracieuse sur l'analyse IA
- Performance : analyse IA asynchrone, mises à jour temps réel via Supabase Realtime

**Échelle & complexité :**
- Domaine principal : Full-stack web (PWA + serverless)
- Niveau de complexité : Moyen — 5 intégrations externes, trafic faible
- Composants architecturaux estimés : 6 principaux + analytics + conformité

## Contraintes & Dépendances Techniques

- Stack décidé et prototype existant (brownfield)
- Pas d'authentification pour le MVP — identification par localStorage
- Dépendance Meta pour WhatsApp Business API (entrée + sortie)
- Dépendance Anthropic pour l'analyse IA (Claude Sonnet)
- Free tier Supabase (10MB storage par fichier, Edge Functions)
- Templates WhatsApp pré-approuvés nécessaires pour les notifications sortantes

## Préoccupations Transversales

1. **Pipeline IA partagé** — Le même flux d'analyse (Claude Sonnet) sert le webhook WhatsApp et l'upload app. Toute modification impacte les deux canaux.
2. **Temps réel** — Supabase Realtime utilisé dans la page signalements et l'onboarding écran 5. La souscription doit être fiable.
3. **Système de notifications** — WhatsApp sortant + email (Resend). Loop solo pour le MVP (testeur reçoit ses propres notifs).
4. **Gestion de fichiers** — Upload, stockage Supabase Storage, passage à Claude pour analyse, rattachement aux dossiers. Le fichier traverse 4 systèmes.
5. **Authentification & isolation** — Supabase Auth (numéro + mdp), RLS par copropriété. Le numéro lie le compte WhatsApp à l'app.

---
