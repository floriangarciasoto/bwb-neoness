<?php foreach($articles as $article): ?>

<h2><a href="/articles/lire/<?= $article['slug'] ?>">
<?= $article['id']." ".$article['titre'] ?></a></h2>

<p><?= $article['slug'] ?></p>
<p><?= $article['contenu'] ?></p>


<?php endforeach ?>
