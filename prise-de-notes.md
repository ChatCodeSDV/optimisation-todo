# Prise de notes

Les apis doivent faire des requêtes à redis qui foncitonne de cache, et il fait ensuite des données permanentes dans une base de données SQLITE avec Idempotency / BullMQ pour le queueing des tâches.

Le front simple appelera un load balancer NGINX qui va dispatcher les requêtes vers les différentes instances de l'API.
