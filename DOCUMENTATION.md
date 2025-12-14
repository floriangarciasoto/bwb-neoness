# Introduction au MVC en PHP

## Le MVC ? C'est quoi ?

Avant d'entrer dans le vif du sujet, arrêtons nous quelques instants sur ce qu'est le MVC.

Il s'agit d'abord d'un acronyme, signifiant "Model View Controller", ou "Modèle Vue Contrôleur" en français.

Il s'agit surtout d'une structure que nous donnerons à nos projets pour séparer clairement les principaux composants de notre application.

En utilisant une structure MVC, nous allons séparer les requêtes en base de données de notre code HTML et de toute "l'intelligence" de l'application.

## Les Modèles

Les modèles seront les éléments qui se chargeront des échanges avec la base de données (CRUD). On ne mettra pas de traitement dans ces fichiers, uniquement des requêtes.

## Les vues

Les vues contiendront uniquement le code HTML destiné à structurer les pages.

## Les contrôleurs

Les contrôleurs, pour leur part, contiendront toute l'intelligence de l'application, le traitement des données en vue de leur affichage, par exemple.

## Le routeur

Dans la structure MVC, un seul et unique fichier est le point d'entrée de l'application, quelle que soit la page affichée. Il est systématiquement appelé, et envoie la demande au bon contrôleur. Il est chargé de trouver le bon chemin pour que l'utilisateur récupère la bonne page, d'où le nom de routeur.

Voici l'utilité des différents dossiers et fichiers

## .htaccess et index.php : ces fichiers seront notre routeur

## app : ce dossier contiendra le coeur de l'application

## controllers : contiendra, comme son nom l'indique, les contrôleurs, dont le nom commencera par une majuscule, par convention.

## models : contiendra nos modèles, leur nom commencera également par une majuscule

## views : contiendra nos fichiers de vues, dans des dossiers, un dossier par contrôleur.

## Le point d'entrée : le routeur

Comme indiqué précédemment, le point d'entrée de notre application est le routeur.

Il s'agit "tout simplement" de notre fichier index.php situé à la racine publique de notre projet.

Ce routeur va nous servir à identifier quel contrôleur doit être utilisé pour générer la page demandée.

Dans cette introduction, nous allons faire un routeur simple, qui comprendra les adresses comme ci-dessous.

http://url_du_site/controleur/methode

Cette url permettra à notre routeur de comprendre qu'il doît pointer vers le contrôleur mentionné en premier paramètre et la méthode de ce contrôleur mentionnée en deuxième paramètre.

## Le .htaccess

Afin de parvenir à ce fonctionnement, nous devons utiliser la réécriture d'URL proposée par les serveurs Apache au moyen d'un fichier .htaccess.

Nous allons donc créer ce fichier à la racine publique de notre projet, comme index.php.

Dans ce fichier nous allons ajouter ces lignes

RewriteEngine On
RewriteRule ^([a-zA-Z0-9\-\_\/]\*)$ index.php?p=$1

Allons dans les détails

RewriteEngine On : permet de démarrer la réécriture d'URL
RewriteRule : permet de définir une règle de réécriture d'URL et fonctionne comme suit
^([a-zA-Z0-9\-\_\/]\*)$ : il s'agit des différents caractères pris en compte dans l'URL pour sa réécriture
a-z : caractères minuscules
A-Z : caractères majuscules
0-9 : chiffres
\-\_\/ : tiret, underscore et / (caractère \ pour l'échappement)
Tout ceci entre ^( pour le début de chaîne et )$ pour la fin de chaîne
index.php?p=$1 : $1 contiendra le résultat de la réécriture notre chaîne
Que contiendra notre URL finale ?

### http://url_du_site/articles/lire

donnera

### http://url_du_site/index.php?p=articles/lire

## Le fichier index.php

Nous allons maintenant devoir gérer les données de l'URL dans le fichier index.php.

Nous allons revenir plusieurs fois sur ce fichier pour y apporter des modifications et ajouts à mesure que l'application sera développée.

## Les classes principales

Avant d'écrire notre routeur, nous allons appeler dans ce fichier le contrôleur et le modèle principaux qui serviront de base commune à tous les fichiers.

Afin d'assurer la portabilité du projet sur toutes les configurations, nous allons baser nos appels sur un chemin généré automatiquement. Nous allons le sauvegarder dans une constante que nous appellerons "ROOT".

Cette constante sera générée depuis une des informations stockées dans la super globale "$\_SERVER" qui contient le chemin complet vers notre fichier.

Nous y enlèverons uniquement le nom de fichier "index.php" au moyen de la fonction php "str_replace".

### define('ROOT', str_replace('index.php','',$\_SERVER['SCRIPT_FILENAME']));

## Les paramètres d'URL

Commençons par la gestion des paramètres d'URL. Dans l'exemple ci-dessus nous avons deux paramètres qui sont envoyés à notre routeur, un contrôleur et une méthode, que nous appellerons action dans la suite.

Il faudra garder en tête qu'une action dans l'URL correspondra à une méthode (fonction) dans un contrôleur.

Pour commencer, nous devons récupérer chacun des paramètres et les affecter à des variables, si ils existent. En effet, la page d'accueil n'aura pas de paramètre par exemple.

Nous allons utiliser la fonction explode de php pour séparer chacun des paramètres et générer un tableau. Puis nous allons tester les valeurs et enfin affecter les variables, si besoin.

Notre routeur est maintenant capable de lire une URL.

Il faut maintenant diriger la demande vers le bon contrôleur et dans ce contrôleur vers la bonne méthode.

Etant donné que nous développons en PHP orienté objet, chaque contrôleur correspondra à une classe.

Si nous prenons l'exemple d'un blog, nous manipulerons des articles. La page d'accueil des articles en affichera la liste complète.

Nous aurons donc une méthode "index" qui accèdera à cette liste.

Si nous souhaitions accéder à cette méthode, sans routeur, nous écririons le code suivant

### require_once(ROOT.'controllers/Articles.php');

### $articles = new Articles();

### $articles->index();

Ces 3 lignes permettent d'instancier la classe "Articles" et d'appeler la méthode "index".

Avec notre routeur, nous avons ces informations dans des variables

- $controller correspond à "Articles"
- $action correspond à "index"
  Nous pourrions donc écrire

### require_once(ROOT.'controllers/'.$controller.'.php');

### $controller = new $controller();

### $controller->$action();

Il nous reste maintenant à gérer les erreurs et l'absence de paramètres.

Une erreur, c'est un contrôleur ou une action qui n'existent pas.

Nous avons une fonction php qui nous permet de vérifier si une méthode existe dans une classe. C'est très pratique pour éviter d'instancier la classe si la méthode demandée n'existe pas. Dans ce cas, nous enverrons une erreur 404.

Cette fonction s'appelle "method_exists" et prend deux paramètres, la classe (contrôleur) et la méthode (action).

Elle s'utilisera donc comme ceci

### method_exists($controller, $action);

Nous obtiendrons un booléen qui nous permettra de savoir si la méthode existe dans le contrôleur demandé.

## Les contrôleurs

Composant essentiel de notre application, les contrôleurs en sont les véritables tours de contrôle. Ils se situent entre la base de données et les vues et sont chargés de demander et traiter les données avant de les envoyer vers nos vues.

## Le contrôleur principal

Le contrôleur principal est le contrôleur qui contiendra les méthodes nécessaires à tous les autres. Ceci nous évitera de répéter les mêmes méthodes plusieurs fois.

Il sera situé dans le dossier "app" et s'appellera "Controller.php".

Nous allons commencer par un contrôleur vide mais nous devrons rapidement y inclure du contenu.

### abstract class Controller{

}

Vous aurez remarqué le "abstract", qui crée une classe "abstraite" que nous ne pourrons pas instancier directement, mais qui sera utilisée par héritage dans tous nos contrôleurs.

## Le contrôleur "Articles"

Passons à notre contrôleur "Articles" qui nous permettra de gérer les pages des articles, comme son nom l'indique.

Ce contrôleur héritera du contrôleur principal et se chargera de traiter les informations et de les passer aux vues.

Pour commencer, nous déclarons l'héritage

### class Articles extends Controller{

### }

Nous allons maintenant générer l'action par défaut qui est la méthode "index". Celle-ci contiendra pour l'instant un "echo".

### public function index(){

### echo "Ici nous aurons la liste des articles";

### }

A ce stade, ouvrir l'adresse ci-dessous doit vous afficher le contenu du "echo"

### http://url_du_site/articles

## Les modèles

Les modèles nous permettront d'accéder à la base de données. La première chose à faire est donc d'initialiser une connexion avec cette base. Nous allons le faire dans le modèle principal.

## Le modèle principal

Le modèle principal sera une classe abstraite "Model" qui sera incluse par héritage dans tous nos modèles.

Il servira principalement à initialiser la connexion à la base de données.

## Les méthodes communes

Il peut être utile de créer des méthodes communes à tous les modèles. Par exemple, il sera fréquent de vouloir obtenir un unique enregistrement ou au contraire tous les enregistrements d'une table donnée. Nous avons 2 propriétés publiques "table" et "id" qui nous permettront de créer ces requêtes.

Nous allons les appeler "getOne" pour un enregistrement et "getAll" pour tous les enregistrements.

Ces méthodes seront donc disponibles depuis tous les modèles.

## Le modèle "Article"

Une classe "Articles" existant déjà pour un contrôleur, nous allons nommer notre modèle "Article.php" et le stocker dans "models".

Cette classe "Article" va hériter du modèle principal.
