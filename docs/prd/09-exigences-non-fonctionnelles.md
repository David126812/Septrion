# Exigences Non-Fonctionnelles

**Partie 9/9** | [Sommaire](./00-sommaire-prd.md) | [Document complet](../prd.md)

---

## Sécurité & Vie Privée

- Les documents uploadés et stockés dans Supabase Storage ne sont pas accessibles publiquement sans lien direct
- Les communications entre l'app et Supabase utilisent HTTPS
- Les appels à l'API Claude transmettent les documents via connexion chiffrée
- Les données personnelles des copropriétaires présentes dans les documents sont traitées conformément au RGPD (cf. [05-exigences-domaine.md](./05-exigences-domaine.md))
- Aucun document n'est conservé côté Claude après analyse (API stateless, pas de training sur les données)

## Fiabilité des Intégrations

- Le webhook WhatsApp doit traiter chaque message entrant sans perte — un document forwardé ne peut pas disparaître silencieusement
- Si l'analyse IA échoue (timeout Claude, document corrompu), le signalement est créé avec un statut d'erreur plutôt que perdu
- Les push notifications et notifications WhatsApp sortantes doivent être envoyées dans un délai raisonnable (minutes, pas heures)

## Performance

- Pas de seuils chiffrés imposés pour le MVP
- L'expérience utilisateur doit rester fluide : navigation instantanée entre les pages, chargement des dossiers sans attente perceptible
- L'analyse IA est asynchrone — le testeur n'attend pas devant un écran de chargement. Le signalement apparaît quand il est prêt (temps réel via Supabase Realtime)

---
