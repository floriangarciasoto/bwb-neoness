<?php

class Utilisateur extends Model{

    public function __construct()
    {
        // Nous définissons la table par défaut de ce modèle
        $this->table = "utilisateur";
    
        // Nous ouvrons la connexion à la base de données
        $this->getConnection();
    }

    public function create($utilisateur): bool {
        $sql = "INSERT INTO `utilisateur`(`email`, `nom`, `prenom`, `tel`, `age`, `poids`, `taille`, `objectifDePoids`, `hash`) VALUES (:email, :nom, :prenom, :tel, :age, :poids, :taille, :objectifDePoids, :hash_mdp)";
        extract($utilisateur);
        $values = [
            'email' => $email,
            'nom' => $nom,
            'prenom' => $prenom,
            'tel' => $tel,
            'age' => $age,
            'poids' => $poids,
            'taille' => $taille,
            'objectifDePoids' => $objectifDePoids,
            'hash_mdp' => $hash
        ];
        $query = $this->_connexion->prepare($sql);
        return $query->execute($values);
    }

    public function findByID(int $userID){
        $sql = "SELECT * FROM ".$this->table." WHERE `idUtilisateur`='".$userID."'";
        $query = $this->_connexion->prepare($sql);
        $query->execute();
        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function updateByID($userID,$utilisateur): bool {
        $sql = "UPDATE `utilisateur` SET `email`=:email,`nom`=:nom,`prenom`=:prenom,`tel`=:tel,`age`=:age,`poids`=:poids,`taille`=:taille,`objectifDePoids`=:objectifDePoids,`hash`=:hash_mdp WHERE `idUtilisateur`=:userID";
        extract($utilisateur);
        $values = [
            'userID' => $userID,
            'email' => $email,
            'nom' => $nom,
            'prenom' => $prenom,
            'tel' => $tel,
            'age' => $age,
            'poids' => $poids,
            'taille' => $taille,
            'objectifDePoids' => $objectifDePoids,
            'hash_mdp' => $hash
        ];
        $query = $this->_connexion->prepare($sql);
        return $query->execute($values);
    }

    public function deleteByID(int $userID): bool {
        $sql = "DELETE FROM `utilisateur` WHERE `idUtilisateur`=:userID";
        $values = [
            'userID' => $userID
        ];
        $query = $this->_connexion->prepare($sql);
        return $query->execute($values);
    }

    public function getAll(): array {
        $sql = "SELECT * FROM `utilisateur`";
        $query = $this->_connexion->prepare($sql);
        $query->execute();
        return $query->fetchAll();
    }
    
    // Retourne un utilisateur en fonction de son email
    
    public function findByEmail($email){
        $sql = "SELECT * FROM ".$this->table." WHERE `email`='".$email."'";
        $query = $this->_connexion->prepare($sql);
        $query->execute();
        return $query->fetch(PDO::FETCH_ASSOC);
    }
}