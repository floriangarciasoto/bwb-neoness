<?php

class Article extends Model{

    public function __construct()
    {
        // Nous définissons la table par défaut de ce modèle
        $this->table = "articles";
    
        // Nous ouvrons la connexion à la base de données
        $this->getConnection();
    }

   
     // Retourne un article en fonction de son slug
    
    public function findBySlug($slug){
        $sql = "SELECT * FROM ".$this->table." WHERE ``='".$slug."'";
        $query = $this->_connexion->prepare($sql);
        $query->execute();
        return $query->fetch(PDO::FETCH_ASSOC);    
    }

}