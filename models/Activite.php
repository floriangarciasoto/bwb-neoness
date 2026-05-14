<?php

class Activite extends Model{

    public function __construct()
    {
        // Nous définissons la table par défaut de ce modèle
        $this->table = "activite";
    
        // Nous ouvrons la connexion à la base de données
        $this->getConnection();
    }


    // Retourne une liste d'activités en fonction d'un identifiant utilisateur
    
    public function findByEmail($idUser){
        $sql = "SELECT * FROM ".$this->table." WHERE `Utilisateur_idUtilisateur`='".$idUser."'";
        $query = $this->_connexion->prepare($sql);
        $query->execute();
        return $query->fetch(PDO::FETCH_ASSOC);    
    }
}