# Executive Summary & Classification

**Partie 1/9** | [Sommaire](./00-sommaire-prd.md) | [Document complet](../prd.md)

---

## Executive Summary

Les membres bénévoles de conseils syndicaux en copropriétés françaises de +20 lots gèrent des dossiers complexes — travaux, sinistres, contrats, relances syndic — en marge de leur vie professionnelle et personnelle. L'information est dispersée entre WhatsApp, emails, PDF et extranets. Les sujets passent à travers : oublis, confusions, manque de suivi. Quand un copropriétaire demande "on en est où avec l'ascenseur ?", reconstituer la réponse prend 30 minutes. Quand un membre quitte le CS, sa mémoire part avec lui.

Septrion est une PWA mobile-first qui centralise les dossiers de copropriété et décharge la mémoire des bénévoles. Un membre du CS forward un document par WhatsApp ou l'ajoute depuis l'app. L'IA (Claude Sonnet) analyse le contenu, extrait le titre, l'urgence, un résumé et la prochaine action recommandée. Le signalement structuré apparaît dans une inbox de triage. Le membre qualifie, rattache à un dossier existant ou en crée un nouveau. Depuis le dossier, il retrouve tout l'historique, les documents et les notes — puis partage l'info aux autres membres CS par push notification ou notification WhatsApp.

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

---
