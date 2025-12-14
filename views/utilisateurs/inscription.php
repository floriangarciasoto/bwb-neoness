<main class="container d-flex justify-content-center align-items-center" style="min-height: 90vh;">
  <div class="col-12 col-md-8 col-lg-6 p-4 mt-5 border rounded shadow-sm bg-white">
    <h1 class="text-center mb-4">Inscription</h1>

    <form action="/utilisateurs/inscrire" method="post" class="d-grid gap-3">

      <div class="d-flex flex-column">
        <label class="form-label">Email :</label>
        <input type="email" class="form-control" name="email" max="100" placeholder="john.doe@example.com" required>
      </div>

      <div class="d-flex flex-column">
        <label class="form-label">Nom :</label>
        <input type="text" class="form-control" name="nom" min="3" max="45" placeholder="Doe" required>
      </div>

      <div class="d-flex flex-column">
        <label class="form-label">Prénom :</label>
        <input type="text" class="form-control" name="prenom" min="3" max="45" placeholder="John" required>
      </div>

      <div class="d-flex flex-column">
        <label class="form-label">Numéro de téléphone :</label>
        <input type="text" class="form-control" name="tel" max="100" placeholder="0123456789" required>
      </div>

      <div class="d-flex flex-column">
        <label class="form-label">Âge :</label>
        <input type="number" class="form-control" name="age" min="1" max="150" placeholder="25" required>
      </div>

      <div class="d-flex flex-column">
        <label class="form-label">Poids :</label>
        <input type="number" class="form-control" name="poids" step="0.1" min="40" max="500" placeholder="80 kg"
          required>
      </div>

      <div class="d-flex flex-column">
        <label class="form-label">Taille :</label>
        <input type="number" class="form-control" name="taille" step="0.01" min="1" max="3" placeholder="1.75 m"
          required>
      </div>

      <div class="d-flex flex-column">
        <label class="form-label">Objectif de poids :</label>
        <input type="number" class="form-control" name="objectifDePoids" step="0.1" min="40" max="500"
          placeholder="75 kg">
      </div>

      <div class="d-flex flex-column">
        <label class="form-label">Mot de passe :</label>
        <input type="password" class="form-control" name="motdepasse" max="100" placeholder="Mot de passe ..." required>
      </div>

      <input type="submit" class="btn btn-success w-100" value="S'inscrire">

    </form>
  </div>
</main>