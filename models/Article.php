<?php

class Article extends Model
{
    public function __construct()
    {
        // On appelle le constructeur du parent Model afin d'initialiser la connexion PDO à la base de données
        parent::__construct();

        // Puis on définit à quelle table de la base de données l'entité de notre modèle correspond
        $this->table = "articles";
    }

// Méthode permettant de récuperer un article par son slug
    public function findBySlug(string $slug): ?array
    {
        $sql = "SELECT * FROM {$this->table} WHERE slug=:slug";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['slug' => $slug]);
        return $stmt->fetch() ?? null;
    }
}