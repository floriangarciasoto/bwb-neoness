# Neoness

Neoness est un projet PHP réalisé dans le cadre de la formation Développeur Web et Web Mobile.

L’objectif du projet est de mettre en place une architecture MVC simple en PHP, avec un routeur, des contrôleurs, des modèles, des vues et un accès à une base de données avec PDO.

Le projet sert principalement à comprendre l’organisation d’une application PHP structurée.  
La fonctionnalité réellement aboutie est le CRUD des articles.

## Fonctionnalités disponibles

- Page d’accueil
- Architecture MVC simple
- Routage à partir de l’URL
- Contrôleurs PHP
- Modèles PHP avec PDO
- Layout commun
- CRUD des articles :
  - affichage de la liste des articles
  - création d’un article
  - modification d’un article
  - suppression d’un article
  - affichage du détail d’un article avec son slug
- Validation simple des formulaires articles
- Échappement des données affichées avec `htmlspecialchars`
- Réécriture d’URL avec `.htaccess`

## Fonctionnalités prévues mais non terminées

Les dossiers et fichiers existent pour préparer la suite du projet, mais ces fonctionnalités ne sont pas présentées comme terminées :

- CRUD produits
- CRUD utilisateurs
- Gestion complète des comptes utilisateurs
- Connexion / authentification

## Technologies utilisées

- PHP
- PHP orienté objet
- PDO
- MySQL / MariaDB
- HTML
- CSS
- Bootstrap
- Apache
- `.htaccess`
- Visual Studio Code
- phpMyAdmin ou MySQL CLI

## Structure du projet

```txt
bwb-neoness/
├── app/
│   ├── Controller.php
│   ├── Model.php
│   └── Router.php
├── config/
│   └── config.php
├── controllers/
│   ├── Articles.php
│   ├── Home.php
│   ├── Products.php
│   └── Users.php
├── models/
│   ├── Article.php
│   ├── Product.php
│   └── User.php
├── public/
│   ├── css/
│   │   └── style.css
│   └── script/
│       └── script.js
├── views/
│   ├── articles/
│   │   ├── create.php
│   │   ├── edit.php
│   │   ├── index.php
│   │   └── read.php
│   ├── home/
│   │   └── index.php
│   ├── layout/
│   │   └── default.php
│   ├── products/
│   └── users/
├── .htaccess
├── index.php
└── README.md
```

## Rôle des principaux fichiers

### `index.php`

Le fichier `index.php` est le point d’entrée de l’application.

Il charge :

* la configuration de la base de données ;
* le routeur ;
* la classe abstraite `Controller` ;
* la classe abstraite `Model`.

Il récupère ensuite l’URL demandée et la transmet au routeur.

### `.htaccess`

Le fichier `.htaccess` permet de rediriger les requêtes vers `index.php`.

Exemple :

```apache
RewriteEngine On

RewriteBase /

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

RewriteRule ^(.*)$ index.php?url=$1 [QSA,L]
```

Cette configuration permet d’utiliser des URLs plus lisibles comme :

```txt
/articles
/articles/create
/articles/edit/1
/articles/read/mon-article
```

### `app/Router.php`

Le routeur analyse l’URL.

Il découpe l’URL en plusieurs parties :

```txt
/articles/edit/1
```

Ce qui donne :

* contrôleur : `Articles`
* méthode : `edit`
* paramètre : `1`

Le routeur vérifie ensuite :

* si le fichier du contrôleur existe ;
* si la classe du contrôleur existe ;
* si la méthode demandée existe.

Si tout est correct, il appelle la méthode du contrôleur.

### `app/Controller.php`

La classe `Controller` sert de base aux contrôleurs.

Elle contient notamment :

* une méthode `render()` pour charger une vue dans le layout commun ;
* une méthode `loadModel()` pour charger dynamiquement un modèle.

### `app/Model.php`

La classe `Model` sert de base aux modèles.

Elle configure la connexion à la base de données avec PDO, puis propose des méthodes génériques :

* `getAll()`
* `create()`
* `find()`
* `update()`
* `delete()`

Ces méthodes sont utilisées par les modèles enfants comme `Article`.

## Installation locale

## 1. Prérequis

Avant d’installer le projet, il faut disposer de :

* PHP
* Apache
* MySQL ou MariaDB
* phpMyAdmin ou MySQL CLI
* Git
* Un navigateur web

## 2. Récupération du projet

Cloner le dépôt GitHub :

```bash
git clone https://github.com/floriangarciasoto/bwb-neoness.git
```

Entrer dans le dossier du projet :

```bash
cd bwb-neoness
```

Dans mon environnement local, le projet peut être placé dans un dossier de travail accessible depuis WSL, par exemple :

```bash
/mnt/c/Users/fgs/code/bwb/bwb-neoness
```

## 3. Configuration Apache

Créer un lien symbolique vers le dossier utilisé par Apache :

```bash
sudo ln -s /mnt/c/Users/fgs/code/bwb/bwb-neoness /var/www/neoness.bwb.local
```

Créer la configuration Apache à partir du modèle local :

```bash
sudo sed "s|DOMAIN|neoness.bwb.local|g" /mnt/c/Users/fgs/code/templates/apache2.local.conf \
  | sudo tee /etc/apache2/sites-available/neoness.bwb.local.conf > /dev/null
```

Activer le site :

```bash
sudo a2ensite neoness.bwb.local.conf
```

Recharger Apache :

```bash
sudo service apache2 reload
```

## 4. Configuration du fichier hosts

Ouvrir le fichier `hosts` de Windows en administrateur :

```powershell
notepad C:\Windows\System32\drivers\etc\hosts
```

Ajouter les lignes suivantes :

```txt
127.0.0.1    neoness.bwb.local
::1          neoness.bwb.local
```

## 5. Vérification Apache

Vérifier que le virtual host est bien déclaré :

```bash
apache2ctl -t -D DUMP_VHOSTS
```

Exemple de résultat attendu :

```txt
VirtualHost configuration:
*:80                   is a NameVirtualHost
  default server FGS-PC. (/etc/apache2/sites-enabled/000-default.conf:1)
  port 80 namevhost FGS-PC. (/etc/apache2/sites-enabled/000-default.conf:1)

[...]

  port 80 namevhost neoness.bwb.local (/etc/apache2/sites-enabled/neoness.bwb.local.conf:1)
    alias www.neoness.bwb.local
```

Si la configuration est correcte, Apache doit afficher :

```txt
Syntax OK
```

## Configuration de la base de données

## 1. Créer la base de données

Le projet utilise la base de données suivante :

```txt
mvc_pedagogique
```

Depuis MySQL ou MariaDB :

```sql
CREATE DATABASE mvc_pedagogique
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Sélectionner la base :

```sql
USE mvc_pedagogique;
```

## 2. Créer la table des articles

La fonctionnalité principale du projet est le CRUD des articles.

Créer la table `articles` :

```sql
CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 3. Ajouter des données de test

Insérer un premier article :

```sql
INSERT INTO articles (slug, title, content, created_at)
VALUES (
    'premier-article',
    'Premier article',
    'Contenu du premier article de test.',
    NOW()
);
```

Insérer un deuxième article :

```sql
INSERT INTO articles (slug, title, content, created_at)
VALUES (
    'deuxieme-article',
    'Deuxième article',
    'Contenu du deuxième article de test.',
    NOW()
);
```

## 4. Vérifier les données

```sql
SELECT * FROM articles;
```

## Configuration du projet

Le fichier de configuration de la base se trouve ici :

```txt
config/config.php
```

Exemple de configuration locale :

```php
<?php

define('DB_HOST','localhost');
define('DB_NAME','mvc_pedagogique');
define('DB_USER','root');
define('DB_PASSWORD','');
```

À adapter selon l’environnement local.

Exemples :

* `DB_USER` peut être `root`
* `DB_PASSWORD` peut être vide en local
* le mot de passe peut être différent selon la configuration MySQL ou MariaDB

## Lancement du projet

Ouvrir le navigateur et accéder à :

```txt
http://neoness.bwb.local
```

La page d’accueil doit s’afficher.

## Routes principales

### Accueil

```txt
/
```

ou :

```txt
/home
```

### Liste des articles

```txt
/articles
```

### Créer un article

```txt
/articles/create
```

Le formulaire envoie les données vers :

```txt
/articles/save
```

### Lire un article

```txt
/articles/read/premier-article
```

Le paramètre correspond au slug de l’article.

### Modifier un article

```txt
/articles/edit/1
```

Le formulaire envoie les données vers :

```txt
/articles/update/1
```

### Supprimer un article

```txt
/articles/delete/1
```

## Fonctionnement du CRUD articles

## 1. Affichage des articles

Le contrôleur `Articles` charge le modèle `Article`, récupère tous les articles avec `getAll()`, puis affiche la vue :

```txt
views/articles/index.php
```

## 2. Création d’un article

La route :

```txt
/articles/create
```

affiche le formulaire de création.

La route :

```txt
/articles/save
```

traite les données envoyées en `POST`.

Le contrôleur vérifie que le titre et le contenu ne sont pas vides.

Si les données sont valides, il crée :

* un slug ;
* un titre ;
* un contenu ;
* une date de création.

Puis il enregistre l’article en base de données.

## 3. Modification d’un article

La route :

```txt
/articles/edit/1
```

récupère l’article avec son identifiant et affiche le formulaire prérempli.

La route :

```txt
/articles/update/1
```

traite les données modifiées.

## 4. Suppression d’un article

La route :

```txt
/articles/delete/1
```

supprime l’article correspondant à l’identifiant transmis.

## 5. Lecture d’un article

La route :

```txt
/articles/read/premier-article
```

récupère l’article à partir de son slug avec la méthode :

```php
findBySlug()
```

Puis elle affiche la vue :

```txt
views/articles/read.php
```

## Sécurité et bonnes pratiques utilisées

Le projet met en place plusieurs bonnes pratiques simples :

* utilisation de PDO pour l’accès à la base de données ;
* requêtes préparées pour les opérations avec des données variables ;
* validation simple des champs obligatoires ;
* redirection après création, modification ou suppression ;
* échappement des données affichées avec `htmlspecialchars` ;
* séparation des responsabilités entre routeur, contrôleur, modèle et vue ;
* point d’entrée unique avec `index.php` ;
* réécriture d’URL avec `.htaccess`.

## Limites du projet

Le projet est un exercice pédagogique.

Certaines parties ne sont pas terminées ou ne doivent pas être considérées comme complètes :

* le CRUD produits est préparé mais non finalisé ;
* le CRUD utilisateurs est préparé mais non finalisé ;
* l’authentification n’est pas terminée ;
* il n’y a pas de système de rôles ;
* il n’y a pas de protection CSRF ;
* la gestion des erreurs reste simple ;
* le style graphique reste secondaire.

La partie réellement fonctionnelle à présenter est le CRUD articles.

## Tests manuels

## 1. Tester l’affichage de la liste

Ouvrir :

```txt
http://neoness.bwb.local/articles
```

Résultat attendu :

* la liste des articles s’affiche ;
* chaque article possède un lien de lecture ;
* chaque article possède un lien d’édition ;
* chaque article possède un lien de suppression.

## 2. Tester la création

Ouvrir :

```txt
http://neoness.bwb.local/articles/create
```

Remplir :

* titre ;
* contenu.

Valider le formulaire.

Résultat attendu :

* l’article est enregistré ;
* l’utilisateur est redirigé vers la liste des articles ;
* le nouvel article apparaît dans la liste.

## 3. Tester la validation

Ouvrir :

```txt
http://neoness.bwb.local/articles/create
```

Envoyer le formulaire avec un titre ou un contenu vide.

Résultat attendu :

* un message d’erreur s’affiche ;
* l’article n’est pas enregistré.

## 4. Tester la modification

Ouvrir :

```txt
http://neoness.bwb.local/articles/edit/1
```

Modifier le titre ou le contenu.

Résultat attendu :

* les données sont mises à jour ;
* l’utilisateur est redirigé vers la liste.

## 5. Tester la suppression

Ouvrir :

```txt
http://neoness.bwb.local/articles/delete/1
```

Résultat attendu :

* l’article est supprimé ;
* l’utilisateur est redirigé vers la liste.

## 6. Tester la lecture par slug

Ouvrir :

```txt
http://neoness.bwb.local/articles/read/premier-article
```

Résultat attendu :

* le détail de l’article s’affiche ;
* le titre, la date et le contenu sont visibles ;
* le contenu est échappé avant affichage.

## Problèmes possibles

### Le site ne se charge pas

Vérifier que :

* Apache est démarré ;
* le virtual host est activé ;
* le fichier `hosts` contient bien `neoness.bwb.local` ;
* le lien symbolique pointe vers le bon dossier ;
* le fichier `.htaccess` est présent ;
* le module `rewrite` d’Apache est activé.

Activer le module rewrite si nécessaire :

```bash
sudo a2enmod rewrite
sudo service apache2 reload
```

### Erreur de connexion à la base

Vérifier que :

* MySQL ou MariaDB est démarré ;
* la base `mvc_pedagogique` existe ;
* les identifiants dans `config/config.php` sont corrects ;
* la table `articles` existe.

### Les routes ne fonctionnent pas

Vérifier que :

* la réécriture d’URL est active ;
* `.htaccess` est bien pris en compte par Apache ;
* le virtual host autorise `AllowOverride All` ;
* l’URL appelée correspond à un contrôleur et une méthode existants.

### Les articles ne s’affichent pas

Vérifier que :

* la table `articles` contient des données ;
* les colonnes attendues existent ;
* le modèle `Article` utilise bien la table `articles` ;
* la base configurée est bien `mvc_pedagogique`.

## Résultat attendu

Une fois le projet installé et configuré, l’application doit permettre de gérer des articles dans une architecture MVC simple :

* accès à la page d’accueil ;
* affichage de la liste des articles ;
* création d’un article ;
* modification d’un article ;
* suppression d’un article ;
* affichage du détail d’un article ;
* accès aux données avec PDO ;
* rendu des vues dans un layout commun.

Ce projet sert de base pédagogique pour comprendre la structure d’une application PHP organisée en MVC.
