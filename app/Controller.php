<?php

abstract class Controller
{
    public function render(string $fileName, array $data = []): void
    {
        extract($data,EXTR_SKIP);
        // ['nom' => 'Francis', 'prenom' => 'Huster', 'id' => 1]
        // -> $nom = "Francis", $prenom = "Huster", $id = 1

        ob_start(); // Pour que le echo soit mis en mémoire du serveur, pas sur le navigateur

        $controllerDir = strtolower(get_class($this)); // class Home -> home

        $viewPath = ROOT . 'views/' . $controllerDir . '/' . $fileName . '.php';

        if (!file_exists($viewPath)) {
            $viewPath = ROOT . 'views/404.php';

            $errorFile = ROOT . 'views/' . $controllerDir . '/404.php';
            if (file_exists($errorFile)) {
                $viewPath = $errorFile;
            }
            else {
                throw new RuntimeException("Vue d'erreur {$controllerDir} introuvable");
            }
        }

        require $viewPath;

        $content = ob_get_clean(); // Récupère le HTML chargé dans le view path

        require ROOT . 'views/Layout/default.php';
    }

    public function loadModel(string $model): void
    {
        $modelPath = ROOT . 'models/' . $model . '.php';

        if (!file_exists($modelPath)) {
            throw new RuntimeException("Modèle {$model} introuvable");
        }

        require_once $modelPath;

        if (!class_exists($model)) {
            throw new RuntimeException("La classe {$model} est introuvable");
        }

        $this->$model = new $model();
    }
}