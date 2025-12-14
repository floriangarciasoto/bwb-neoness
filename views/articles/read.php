<style>
  .article-container {
    max-width: 700px;
    /* Largeur maximale du bloc */
    margin: 40px auto;
    /* Marge supérieure + centrage horizontal */
    font-family: Arial, sans-serif;
    /* Police du texte */
    line-height: 1.6;
    /* Hauteur de ligne pour le confort de lecture */
  }

  .article-title {
    font-size: 32px;
    /* Taille du titre */
    margin-bottom: 10px;
    /* Marge en dessous du titre */
  }

  .article-meta {
    color: #777;
    /* Couleur de la date (gris) */
    font-size: 14px;
    /* Taille de la date */
    margin-bottom: 25px;
    /* Marge dessous la date */
  }

  .article-content {
    font-size: 18px;
    /* Taille du texte du contenu */
    white-space: pre-line;
    /* Respecte les sauts de lignes du texte */
  }

  .back-link {
    display: inline-block;
    /* Affichage en bloc inline pour pouvoir ajouter des marges */
    margin-bottom: 20px;
    /* Marge sous le lien de retour */
    text-decoration: none;
    /* Pas de soulignement */
    color: #007BFF;
    /* Couleur bleue */
  }

  .back-link:hover {
    text-decoration: underline;
    /* Souligne le lien au survol */
  }
</style>

<div class="article-container"> <!-- Conteneur principal de l'article -->

  <a href="/articles" class="back-link">← Retour à la liste</a> <!-- Lien pour revenir à la liste -->

  <h1 class="article-title"><?= htmlspecialchars($article['title']) ?></h1> <!-- Titre de l'article -->

  <div class="article-meta">
    Publié le <?= date('d/m/Y à H:i', strtotime($article['created_at'])) ?> <!-- Date de création formatée -->
  </div>

  <article class="article-content">
    <?= nl2br(htmlspecialchars($article['content'])) ?> <!-- Contenu de l'article, échappé + retour à la ligne -->
  </article>

</div>