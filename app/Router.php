<?php

class Router
{
    public function run($url): void
    {
        // On enlève les éventuels "/" au début et à la fin
        $url = trim($url,'/'); // exemple : /home/index/ -> home/index

        // Si l'URL est vide, on créé un tableau vide, sinon on découpe sur "/"
        $parts = $url === '' ? [] : explode('/',$url); // home/index -> ['home','index']
        // Exemple pour : ['home','index']
        // home = controleur
        // index = méthode du controleur

        // On récupère le nom du controleur (première partie de l'URL) ou 'Home' par défaut
        $controllerName = !empty($parts[0]) ? ucfirst($parts[0]) : 'Home'; // home -> Home

        // On récupère le nom de la méthode (deuxième partie de l'URL) ou 'index' par défaut
        $methodName = $parts[1] ?? 'index'; // S'il n'y a pas de deuxième partie, on prend l'index par défaut
    
        // On récupère maintenant les éventuels paramètres après controller et method
        $params = array_slice($parts, 2); // ['home','lire','test'] -> ['test']

        // On va construire le chemin du fichier controleur correspondant
        $controllerFile = ROOT . 'controllers/' . $controllerName . '.php'; // exemple : /controllers/Home.php

        // Si le fichier n'existe pas, on renvoit une erreur 404
        if (!file_exists($controllerFile)) {
            http_response_code(404); // On envoit un code HTTP 404
            echo "Controleur introuvable : {$controllerName}";
            return; // On arrête l'exécution de la méthode            
        }

        // On inclut le fichier du controleur
        require_once $controllerFile; // On charge le fichier PHP du controleur

        // On vérifie si la classe du controleur existe
        if (!class_exists($controllerName)) {
            http_response_code(500); // On envoit un code HTTP 500 (erreur serveur)
            echo "Classe du controleur introuvable : {$controllerName}";
            return; // On arrête l'exécution de la méthode            
        }

        // On instancie le controleur
        $controller = new $controllerName(); // exemple new Home() pour la page d'accueil

        // On vérifie si la méthode demandée existe bien dans ce controleur
        if (!method_exists($controller,$methodName)) { // On test la présence de la méthode
            http_response_code(404);
            echo "Méthode {$methodName} introuvable dans le controleur {$controllerName}";
            return;
        }

        // Si tout est ok, on appelle dynamiquement la méthode du controleur avec les paramètres
        call_user_func_array([$controller,$methodName],$params); // exemple : $controller->index(), ou $controller->lire(string $slug)
        // params = partie restante de l'URL après les deux premiers termes (séparés par des "/")
        // Pour l'URL suivante : /controler/method/param1/param2/param3
        // - contrôleur : controler
        // - méthode : method
        // - paramètres : [param1, param2, param3]
    }
}