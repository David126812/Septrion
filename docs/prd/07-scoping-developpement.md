# Scoping & Développement Phasé

**Partie 7/9** | [Sommaire](./00-sommaire-prd.md) | [Document complet](../prd.md)

---

## Stratégie MVP

**Approche :** MVP de validation de problème — confirmer que le CS trouve de la valeur dans la centralisation automatique + analyse IA de documents sur un usage réel de 5 jours.

**Ce qu'on valide :** Le flow WhatsApp/upload → analyse IA → signalement → dossier résout un vrai problème pour des bénévoles qui n'ont pas le temps de structurer eux-mêmes.

**Ce qu'on ne valide pas encore :** La monétisation, l'adoption collective (multi-membres CS), la rétention long terme, le canal email.

## Équipe

| Membre | Rôle |
|--------|------|
| David | Tech / Produit / Setup testeurs |
| Jamel | À préciser |
| Ibtissem | À préciser |

## Périmètre MVP — Verrouillé

Le scope MVP est défini dans la section [03-scope-produit.md](./03-scope-produit.md). Aucune feature supplémentaire ne sera ajoutée. Les ajouts identifiés pendant ce workflow (notification WhatsApp sortante comme fallback push) sont intégrés.

**Principe directeur :** Bien fait, pas vite fait. Simplicité avant exhaustivité.

## Risques & Mitigations

| Type | Risque | Mitigation |
|------|--------|------------|
| **Marché** | Les testeurs n'adoptent pas le forward WhatsApp spontanément | Pré-chargement dummy + simulation par David pendant le test |
| **Marché** | 5 jours trop court pour observer le moment retrieval | Documents seed pour créer la masse critique dès jour 1 |
| **Technique** | L'analyse IA produit des résumés insuffisants sur des docs réels | Itérer le prompt Claude avant le test. Kill criterion : >50% de corrections |
| **Technique** | Push iOS non fiable | Fallback notification WhatsApp sortante |
| **Ressource** | Équipe de 3, scope ambitieux | Scope verrouillé, pas de feature creep. Focus sur la qualité du flow principal |
| **Réglementaire** | DPA non signés avant le test | Action préalable obligatoire : signer DPA Anthropic + Supabase avant de lancer les testeurs |
| **Réglementaire** | Syndic invoque le RGPD pour bloquer l'accès aux documents | Hors scope MVP — le CS ingère ses propres documents |
| **Réglementaire** | Transfert données hors UE (Claude API) | DPA + clauses contractuelles types en place avant le test |
| **Réglementaire** | Plainte CNIL d'un copropriétaire | Politique de confidentialité + processus de suppression sur demande |

---
