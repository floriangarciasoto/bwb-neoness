<!DOCTYPE html>
<html lang="fr" data-bs-theme="dark">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mini MVC pédagogique</title>

  <!-- ==========================
       Feuilles de style
  ========================== -->
  <!-- Framework CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
  <!-- CSS principal -->
  <link rel="stylesheet" href="/public/css/style.css">
</head>

<body class="dark-mode">

  <!-- ==========================
       En-tête du site
  ========================== -->
  <header>
    <h1>Mini MVC</h1>
    <nav>
      <a href="/home">Accueil</a>
      <a href="/articles">Articles</a>
      <a href="/products">Produits</a>
      <a href="/users">Utilisateurs</a>
    </nav>
  </header>

  <!-- ==========================
       Contenu principal
  ========================== -->
  <main>
    <?= $content ?>
  </main>

  <!-- ==========================
       Pied de page
  ========================== -->
  <footer>
    <p>Footer</p>
  </footer>

  <!-- ==========================
       Scripts JS
  ========================== -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  <script src="/public/script/script.js"></script>

</body>

</html>