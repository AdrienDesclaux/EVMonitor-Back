
# EVMonitor

## Installer les Dépendances

```bash
npm install
```

## Configurer l'Environnement

Créez un fichier `.env` à la racine du projet et renseignez les variables d'environnement nécessaires :

```env
PG_URL=postgresql://user:pwd@localhost:5432/evmonitor
PORT=3000
JWT_ACCESS_SECRET=passphrase_ACCESS
JWT_REFRESH_SECRET=passphrase_REFRESH
```

### Configurer la Base de Données

Assurez-vous que PostgreSQL est lancé. Créez une base de données correspondant aux configurations définies dans `.env`.

Utilisez le fichier `create_tables.sql` afin de créer les tables de la base de données.

### Démarrer le Serveur

```bash
npm start
```

Le serveur doit maintenant tourner sur `http://localhost:3000` (ou le port spécifié dans `.env`).
