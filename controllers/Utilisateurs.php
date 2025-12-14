<?php

class Utilisateurs extends Controller {
    
    public function index(){
        session_start();
        if (isset($_SESSION['userID'])) {
            if ($_SESSION['userID'] === 1) {
                header('Location: /admin');
            }
            else {
                $this->render('index');
            }
        }
        else {
            header('Location: /utilisateurs/connexion');
        }
    }

    public function inscription() {
        $this->render('inscription');
    }

    public function inscrire() {
        // Récupération des paramètres depuis POST
        $email = trim($_POST['email']);
        $nom = trim($_POST['nom']);
        $prenom = trim($_POST['prenom']);
        $tel = trim($_POST['tel']);
        $age = intval($_POST['age']);
        $poids = floatval($_POST['poids']);
        $taille = floatval($_POST['taille']);
        $objectifDePoids = floatval($_POST['objectifDePoids']);
        $passwd = trim($_POST['motdepasse']);

        // Hashage du mot de passe
        $hash = password_hash($passwd, PASSWORD_BCRYPT, ['cost' => 12]);

        // Encapsulation des variables pour les passer en paramètres
        $utilisateur = compact("email","nom","prenom","tel","age","poids","taille","objectifDePoids","hash");

        // On charge le modèle Utilisateur
        $this->loadModel('Utilisateur');
        // Création de l'utilisateur en passant en paramètre la variable encapsulée dans la méthode du modèle correspondant
        $this->Utilisateur->create($utilisateur);

        // On connecte directement l'utilisateur
        $this->authentifier($email);
    }

    public function connexion() {
        $this->render('connexion');
    }

    public function connecter() {
        $email = trim($_POST['email']);
        $passwd = trim($_POST['motdepasse']);

        $this->loadModel('Utilisateur');
        $utilisateur = $this->Utilisateur->findByEmail($email);

        if (password_verify($passwd,$utilisateur['hash'])) {
            $this->authentifier($email);
        }
        else {
            header('Location: /utilisateurs/connexion');
        }
    }

    public function authentifier($email) {
        session_start();
        $this->loadModel('Utilisateur');
        $utilisateur = $this->Utilisateur->findByEmail($email);
        $_SESSION['userID'] = $utilisateur['idUtilisateur'];
        header('Location: /utilisateurs');
    }

    public function deconnecter() {
        session_start();
        session_destroy();
        header('Location: /');
    }
};