<h1>Liste des articles</h1> <!-- Titre de la page de liste -->

<p>
  <a href="/articles/create" class="button">Créer un nouvel article</a>
</p> <!-- Lien vers le formulaire de création -->

<?php if (empty($articles)): ?> <!-- Si le tableau $articles est vide -->
  <p>Aucun article pour le moment.</p> <!-- Message s'il n'y a aucun article -->
<?php else: ?> <!-- Sinon, il y a des articles -->
  <ul> <!-- On commence une liste HTML -->
    <?php foreach ($articles as $article): ?>
      <li>
        <a href="/articles/read/<?= htmlspecialchars($article['slug']) ?>">
          <?= htmlspecialchars($article['title']) ?>
        </a>
        |
        <a href="/articles/edit/<?= (int) $article['id'] ?>">Éditer</a>
        |
        <a href="/articles/delete/<?= (int) $article['id'] ?>" onclick="return confirm('Supprimer cet article ?');">
          Supprimer
        </a>
      </li>
    <?php endforeach; ?>
  </ul>

  </ul> <!-- Fin de la liste -->
<?php endif; ?> <!-- Fin du if -->