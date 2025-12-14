<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NeoNess</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</head>

<body>
  <header class="shadow-sm position-sticky top-0 z-3 bg-dark">
    <nav class="navbar navbar-expand-md navbar-dark container py-2">

      <!-- Logo -->
      <a class="navbar-brand fw-bold fs-3" href="/">NeoNess</a>

      <!-- Bouton hamburguer -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Liens -->
      <div class="collapse navbar-collapse justify-content-end" id="mainNav">

        <ul class="navbar-nav mb-2 mb-md-0">

          <?php if (isset($_SESSION) && isset($_SESSION['userID'])): ?>

            <li class="nav-item">
              <a class="nav-link" href="/utilisateurs/deconnecter">Se déconnecter</a>
            </li>

          <?php else: ?>

            <li class="nav-item">
              <a class="nav-link" href="/utilisateurs/connexion">Se connecter</a>
            </li>

            <li class="nav-item ms-md-3">
              <a class="btn btn-primary" href="/utilisateurs/inscription">S'inscrire</a>
            </li>

          <?php endif; ?>

        </ul>

      </div>
    </nav>
  </header>

  <?= $content ?>

  <footer class="bg-dark text-white text-center py-3 mt-5">
    <p class="m-0">&copy; 2025 Neoness - Tous droits réservés</p>
  </footer>
</body>

</html>