<main class="container d-flex justify-content-center align-items-center" style="min-height: 90vh;">
  <div class="col-12 col-md-6 col-lg-4 p-4 border rounded shadow-sm bg-white">
    <h1 class="text-center mb-4">Connexion</h1>

    <form action="/utilisateurs/connecter" method="post" class="d-grid gap-3">

      <div class="d-flex flex-column">
        <label for="email" class="form-label">Email :</label>
        <input type="email" class="form-control" name="email" max="100" placeholder="john.doe@example.com" required>
      </div>

      <div class="d-flex flex-column">
        <label for="motdepasse" class="form-label">Mot de passe :</label>
        <input type="password" class="form-control" name="motdepasse" max="100" placeholder="Mot de passe ..." required>
      </div>

      <input type="submit" class="btn btn-primary w-100" value="Se connecter">

    </form>
  </div>
</main>