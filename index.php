<?php

// Définir une constante ROOT qui va définir le chemin absolu du projet
define('ROOT',__DIR__ . DIRECTORY_SEPARATOR);
// __DIR__ = dossier courant (mvc-php-decouverte-v2) -> dossier racine
// DIRECTORY_SEPARATOR = / ou \ selon Linux ou Windows

// On inclut les données de configuration permettant de se connecter à la base de données
require ROOT . 'config/config.php';

// On inclut le fichier du routeur qui va générer les URLs
require ROOT . 'app/Router.php'; // On charge la classe Router définie sur app/Router.php
// Puis on inclut les fichiers des classes abstraites qui vont permettre de faire fonctionner
// les contrôleurs ainsi que les modèles nécessaires en fonction de la route choisie par l'utilisateur
require ROOT . 'app/Controller.php';
require ROOT . 'app/Model.php';

// On récupère l'URL de la requête (exemple : index.php?url=home/index)
$url = $_GET['url'] ?? ''; // Si l'URL n'existe pas dans la requête, on prend une chaîne vide

// On créé une instance de Router
$router = new Router();

// On demande au routeur d'exécuter la bonne page en fonction de l'URL
$router->run($url); // On appelle la méthode run() du routeur en lui passant l'URL
