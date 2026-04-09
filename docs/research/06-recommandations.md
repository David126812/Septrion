# Recommandations — Septrion

**Partie 6/6** | [Sommaire](./00-sommaire-recherche.md) | [Document complet](./domain-copropriete-france-research-2026-04-08.md#recommendations)

---

## Technology Adoption Strategy

1. **Consolider le stack actuel** (React PWA + Supabase + Claude) — il est techniquement sain pour un MVP, pas de raison de pivoter
2. **Ajouter l'email comme 2ème canal d'entrée** — même pattern que le webhook WhatsApp, via une adresse email dédiée type `dossiers@copro-pilot.fr`
3. **Implémenter le rattachement IA dans l'UI** — déplacer la logique `findSimilarDossier` du webhook vers la page Signalements pour que Louise puisse rattacher un document à un dossier existant au moment de la qualification
4. **Évaluer Mistral Medium** pour le matching de doublons — réduire les coûts et préparer l'argument souveraineté

## Innovation Roadmap

| Phase | Focus technique | Déclencheur |
|-------|----------------|-------------|
| **MVP (maintenant)** | WhatsApp → IA → Signalement → Dossier → Notification | Validation early adopters |
| **Post-validation** | Email parsing, rattachement IA, résumé dynamique, auth Supabase | 5+ copropriétés actives |
| **Scale** | Multi-LLM (Claude + Mistral), React Native, API syndics, multi-copropriété | Product-market fit confirmé, première facturation |

## Risk Mitigation

- **Dépendance Meta** : Ajouter un 2ème canal d'entrée (email) dès que possible
- **RGPD** : Signer les DPA (Anthropic, Supabase), documenter les flux, évaluer Mistral EU
- **Adoption collective** : Concevoir pour l'utilisateur individuel d'abord — la valeur doit exister même si Louise est la seule à utiliser l'app
- **Qualité IA** : Constituer un corpus de test avec des vrais documents de copropriété (les 4 test-documents existants sont un début)

_Source: [Immo2.pro — 6 startups proptech 2026](https://immo2.pro/innovation-immobilier/veille-et-innovation-en-france/6-startups-de-la-proptech-qui-marqueront-2026/), [Bpifrance — Proptech](https://bigmedia.bpifrance.fr/nos-dossiers/proptech-la-technologie-au-service-de-limmobilier), [French Proptech](https://www.frenchproptech.fr/), [Gumloop — n8n alternatives 2026](https://www.gumloop.com/blog/n8n-alternatives)_

---
