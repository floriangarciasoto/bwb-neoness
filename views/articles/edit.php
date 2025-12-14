<h1>Éditer un article</h1> <!-- Titre de la page d'édition -->

<p><a href="/articles">← Retour à la liste</a></p> <!-- Lien pour revenir à la liste -->

<?php if (!empty($error)): ?> <!-- Si une erreur existe -->
  <p style="color:red;"><?= htmlspecialchars($error) ?></p> <!-- Affichage du message d'erreur -->
<?php endif; ?>

<form action="/articles/update/<?= (int) $article['id'] ?>" method="post">
  <!-- Formulaire d'édition, envoi vers /articles/mettreAJour/ID -->
  <p>
    <label for="title">Titre</label><br> <!-- Label du champ titre -->
    <input type="text" name="title" id="title" value="<?= htmlspecialchars($article['title']) ?>" required>
    <!-- Champ texte pré-rempli avec le titre existant -->
  </p>

  <p>
    <label for="content">Contenu</label><br> <!-- Label du champ contenu -->
    <textarea name="content" id="content" rows="8" required><?= htmlspecialchars($article['content']) ?></textarea>
    <!-- Zone de texte pré-remplie avec le contenu existant -->
  </p>

  <p>
    <button type="submit">Mettre à jour</button> <!-- Bouton pour soumettre les modifications -->
  </p>
</form>