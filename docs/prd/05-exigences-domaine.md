# Exigences Domaine

**Partie 5/9** | [Sommaire](./00-sommaire-prd.md) | [Document complet](../prd.md)

---

## Conformité & Réglementaire

**RGPD (applicable immédiatement) :**
- Politique de confidentialité accessible dans la PWA (données collectées, finalités, durée, droits)
- DPA signé avec Anthropic (documents analysés = sous-traitance IA au sens RGPD)
- DPA signé avec Supabase (hébergement données)
- Base légale : intérêt légitime du CS dans l'exercice de son mandat (art. 6.1.f RGPD)
- Consentement explicite opt-in pour les push notifications
- Documentation des flux de données : WhatsApp → Supabase Storage → Claude API → Supabase DB → App

**EU AI Act (transparence) :**
- Mention visible dans l'app que les résumés et classifications sont générés par IA
- Les dossiers structurés et auditables sont un avantage de conformité vs les chatbots opaques

**Loi 1965 copropriété :**
- Le CS a légalement le droit d'accéder à tous les documents de gestion (art. 21). Septrion aide le CS à exercer ce droit — pas de risque juridique sur l'usage.
- Le budget de délégation CS (art. 21-2) est la piste de monétisation post-MVP. Montant voté par chaque AG, pas de pourcentage fixe.

## Contraintes Techniques

**WhatsApp Business API :**
- Dépendance Meta — canal d'entrée principal. Risque de changement de règles unilatéral.
- Les messages ingérés peuvent contenir des données personnelles de tiers (copropriétaires mentionnés dans les documents).
- Mitigation post-MVP : email comme 2ème canal d'entrée.

**Notification WhatsApp sortante (MVP) :**
- Fallback aux push notifications PWA — garantit la délivrance sur tous les appareils, iOS inclus
- Contenu : mêmes infos que la push (titre signalement, urgence) + lien pour ouvrir l'app
- Nécessite un template de message pré-approuvé par Meta
- Coût négligeable pour le test (10 testeurs × 5 jours)
- Sera remplacé par des push natives après passage en React Native (post-MVP)

**Données & stockage :**
- Documents uploadés stockés dans Supabase Storage
- Limite 10MB par fichier (free tier Supabase)
- Pas de données de santé — pas de certification HDS nécessaire

**Push notifications PWA :**
- Android : pleinement supporté
- iOS (16.4+) : nécessite installation PWA sur l'écran d'accueil. Fiabilité limitée si l'app n'a pas été ouverte récemment — d'où le fallback WhatsApp.

## Risques Domaine

Les risques domaine sont consolidés dans le tableau unique de la section "Risques & Mitigations" (cf. [07-scoping-developpement.md](./07-scoping-developpement.md)).

---
