<?php

class Admin extends Controller{

    public function index(){
        session_start();

        if (isset($_SESSION['userID']) && $_SESSION['userID'] === 1) {
            $this->loadModel('Utilisateur');

            $utilisateurs = $this->Utilisateur->getAll();

            $this->render('index', compact('utilisateurs'));
        }
        else {
            header('Location: /utilisateurs/connexion');
        }
    }

}