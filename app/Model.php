<?php

abstract class Model
{
    protected PDO $db;
    protected string $table;

    public function __construct()
    {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4;';

        try {
            $this->db = new PDO($dsn,DB_USER,DB_PASSWORD);
            $this->db->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
            $this->db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE,PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            die("Erreur de connexion à la base : " . $e->getMessage());
        }
    }

// Méthode pour récupérer TOUS les enregistrements
    public function getAll(): array
    {
        $sql = "SELECT * FROM {$this->table}";
        $query = $this->db->query($sql);
        $result = $query->fetchAll();
        return $result;
    }

// Méthode générique pour créer un enregistrement
    public function create(array $data): int
    {
        $columns = array_keys($data);
        $columnsSet = implode(', ',$columns);
        $columnsValuesSet = implode(', ', array_fill(0, count($columns), '?'));
        $sql = "INSERT INTO {$this->table} ({$columnsSet}) VALUES ({$columnsValuesSet})";
        $stmt = $this->db->prepare($sql);
        $values = array_map(fn($col) => $data[$col], $columns);
        $stmt->execute($values);
        return (int) $this->db->lastInsertId();
    }

// Méthode générique pour créer un enregistrement par son id
    public function delete(int $id): bool
    {
        $sql = "DELETE FROM {$this->table} WHERE id=:id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([':id' => $id]);
    }

// Méthode pour récupérer UN enregistrement par son id
    public function find(int $id): ?array // Retourne un tableau ou null si non trouvé
    {
        // On prépare une requête SQL avec un paramètre nommé :id
        $sql = "SELECT * FROM {$this->table} WHERE id = :id LIMIT 1"; // On limite à 1 résultat
 
        // On prépare la requête via PDO::prepare (sécurisé)
        $stmt = $this->db->prepare($sql); // $stmt est un PDOStatement prêt à être exécuté
 
        // On exécute la requête en liant le paramètre :id à la valeur $id
        $stmt->execute([':id' => $id]); // On passe un tableau associatif de paramètres
 
        // On récupère une seule ligne (ou false si rien)
        $result = $stmt->fetch(); // Tableau associatif ou false
 
        // Si $result vaut false (aucune ligne), on retourne null
        if (!$result) {
            return null;
        }
 
        // Sinon on renvoie l'enregistrement
        return $result;
    }
 
// Méthode générique pour mettre à jour une ligne par son id
    public function update(int $id, array $data): bool // Retourne true si succès
    {
        // On crée un tableau pour stocker les parties "colonne = :colonne"
        $setParts = []; // Ex: ["titre = :titre", "contenu = :contenu"]
 
        // Pour chaque colonne à mettre à jour
        foreach ($data as $col => $value) {
            // On ajoute une partie "col = :col"
            $setParts[] = "{$col} = :{$col}";
        }
 
        // On construit la partie SET de la requête
        $set = implode(', ', $setParts); // "titre = :titre, contenu = :contenu"
 
        // On construit la requête SQL d'UPDATE
        $sql = "UPDATE {$this->table} SET {$set} WHERE id = :id";
 
        // On prépare la requête
        $stmt = $this->db->prepare($sql);
 
        // On lie les données à mettre à jour
        foreach ($data as $col => $value) {
            $stmt->bindValue(':' . $col, $value); // ex: :titre → "Nouveau titre"
        }
 
        // On lie aussi l'id de la ligne à mettre à jour
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
 
        // On exécute la requête et on retourne true/false
        return $stmt->execute();
    }
}