<h1>Créer un article</h1> <!-- Titre de la page -->

<p><a href="/articles">← Retour à la liste</a></p> <!-- Lien pour revenir à la liste -->

<?php if (!empty($error)): ?> <!-- Si une variable $error existe et n'est pas vide -->
  <p style="color:red;"><?= htmlspecialchars($error) ?></p> <!-- On affiche le message d'erreur en rouge -->
<?php endif; ?>

<form action="/articles/save" method="post">
  <!-- Formulaire qui envoie les données en POST vers /articles/enregistrer -->
  <p>
    <label for="title">Titre</label><br> <!-- Label du champ titre -->
    <input type="text" name="title" id="title" value="<?= isset($title) ? htmlspecialchars($title) : '' ?>" required>
    <!-- Champ texte pour le titre, pré-rempli si $titre existe -->
  </p>

  <p>
    <label for="content">Contenu</label><br> <!-- Label du champ contenu -->
    <textarea name="content" id="content" rows="8"
      required><?= isset($content) ? htmlspecialchars($content) : '' ?></textarea>
    <!-- Zone de texte pour le contenu -->
  </p>

  <p>
    <button type="submit">Enregistrer</button> <!-- Bouton pour envoyer le formulaire -->
  </p>
</form>