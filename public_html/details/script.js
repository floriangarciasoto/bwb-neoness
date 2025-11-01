// ========================================
// ITEMDETAIL-TMDB - Page de détails d'un film/série
// Documentation du code (sans implémentation)
// ========================================

/**
 * Fonction permettant d'obtenir la valeur de la clé d'API "API_KEY" de plusieurs manières
 * @returns {String} - clé API
 */
function obtenirCleAPI() {
    // Si la variable API_KEY_ENV a été définie, c'est que le script .env/tmdb.js a été chargé
    // On demande le type de cette variable avec typeof, ce qui nous permet de vérifier
    // la définition de la variable sans provoquer d'erreur
    // Si le type de variable n'est pas "undefined", c'est qu'elle est déclarée, on peut donc prendre sa valeur
    if (typeof API_KEY_ENV !== "undefined") return API_KEY_ENV;

    // Si le fichier d'environement n'est pas accessible,
    // on essaie alors de récuperer une clé via les paramètres GET
    const parametresGET = new URLSearchParams(window.location.search);
    const API_KEY_GET = parametresGET.get('api_key');
    if (API_KEY_GET !== null) {
        return API_KEY_GET;
    }

    // Sinon on retourne une clé vide
    return '...';
}

// Configuration de l'API TMDB (clé chargée depuis .env/tmdb.js)
const TMDB_API_KEY = obtenirCleAPI();

const TMDB_BASE_URL = 'https://api.themoviedb.org/3/';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500/';

/**
 * Fonction pour récupérer les paramètres de l'URL
 * Extrait l'ID et le type (movie/tv) depuis l'URL de la page
 * @returns {Object} - Objet contenant {id, type}
 */
function getURLParams() {
    // Créer un objet URLSearchParams avec la query string de l'URL actuelle
    const GETparams = new URLSearchParams(window.location.search);
    
    // Extraire le paramètre 'id' (ex: "550" pour Fight Club)
    const id = GETparams.get('id');
    
    // Extraire le paramètre 'type' (ex: "movie" ou "tv")
    const type = GETparams.get('type');
    
    // Afficher les paramètres dans la console pour debug
    console.log(`Paramètres : id=${id}, type=${type}`);
    
    // Retourner un objet avec id et type
    return {id:id, type:type};
}

/**
 * Fonction pour charger les détails depuis TMDB avec fetch
 * Fonction asynchrone qui récupère les données d'un film/série depuis l'API TMDB
 */
async function chargerDetailsItemTMDB() {
    // Afficher un message de chargement temporaire dans le body
    let main = document.getElementsByTagName("main")[0];
    let tempMessage = document.createElement("p");
        tempMessage.className = "m-5 p-5 text-center"
        tempMessage.textContent = "Chargement des détails ...";
    main.appendChild(tempMessage);

    // Récupérer les paramètres de l'URL (id et type)
    const params = getURLParams();
    
    // Extraire l'ID et le type depuis l'objet retourné
    let id = params.id;
    let type = params.type;
    
    // Vérifier que l'ID existe
    // Si pas d'ID, afficher un message d'erreur et arrêter
    if (id === null || id === "") {
        alert("Impossible de charger les détails, vous allez être redirigé vers la page d'accueil.");
        window.location.href = "..";
    }

    // Par défaut: 'movie' si le type n'est pas spécifié
    if (type === null || type === "") {
        type = "movie";
    }

    try {
        // ============================================
        // FETCH : ÉTAPE 1 - Lancer la requête HTTP
        // ============================================
        // fetch(url) envoie une requête HTTP GET vers l'URL
        // C'est ASYNCHRONE : le code continue pendant que la requête se fait
        // await = ATTENDRE que la requête soit terminée avant de continuer
        // Résultat : un objet Response qui contient les infos de la réponse HTTP
        const URL = TMDB_BASE_URL + `${type}/` + id + `?language=fr-FR` + `&api_key=${TMDB_API_KEY}`;
        let response = await fetch(URL);
        
        // ============================================
        // FETCH : ÉTAPE 2 - Vérifier le statut HTTP
        // ============================================
        // response.ok = true si le code HTTP est 200-299 (succès)
        // response.ok = false si erreur 404, 500, etc.
        // Si erreur, on lance une exception avec throw
        if (!response.ok) {
            console.error("Impossible de récuperer les détails.");
            throw new Error(`HTTP ${response.status}`);
        }

        // ============================================
        // FETCH : ÉTAPE 3 - Extraire les données JSON
        // ============================================
        // response.json() lit le corps de la réponse et le convertit en objet JavaScript
        // C'est aussi ASYNCHRONE, donc on utilise await
        // Résultat : un objet JavaScript avec les données de TMDB
        let data = await response.json();
        let details = data;
        
        // ============================================
        // FETCH : Deuxième appel API pour les crédits
        // ============================================
        // Même processus : construire URL, fetch, vérifier, parser JSON
        // Récupère les informations sur le casting (acteurs, réalisateur)
        const creditsURL = TMDB_BASE_URL + `${type}/` + `${id}/` + `credits` + `?language=fr-FR` + `&api_key=${TMDB_API_KEY}`;
        response = await fetch(creditsURL);
        if (!response.ok) {
            console.error("Impossible de récuperer les credits.");
            throw new Error(`HTTP ${response.status}`);
        }
        data = await response.json();
        let credits = data;
        
        // Afficher les détails en appelant la fonction d'affichage
        afficherDetailsItemTMDB(details, credits, type, id);
    }
    catch(error) {
        // ============================================
        // GESTION DES ERREURS
        // ============================================
        // Le bloc try/catch capture toutes les erreurs :
        // - Erreurs réseau (pas d'internet)
        // - Erreurs HTTP (404, 500, etc.)
        // - Erreurs de parsing JSON
        // - Erreurs avec throw new Error()
        console.error("Erreur lors du chargement des détails.");
        console.error(error);
    }
}

/**
 * Fonction pour afficher les détails de l'item
 * Génère dynamiquement tout le HTML de la page avec createElement
 * @param {Object} item - Données du film/série depuis TMDB
 * @param {Object} credits - Données du casting (acteurs, réalisateur)
 * @param {String} itemType - Type: 'movie' ou 'tv'
 * @param {String} itemId - ID TMDB du film/série
 */
function afficherDetailsItemTMDB(item, credits, itemType, itemId) {
    console.log("afficherDetailsItemTMDB", item, credits, itemType, itemId);
    // === EXTRACTION DES DONNÉES ===
    // Extraire le titre (title pour films, name pour séries)
    
    // Extraire les chemins des images (poster et backdrop)
    
    // Extraire le résumé (overview)
    
    // Extraire la date de sortie (release_date pour films, first_air_date pour séries)
    
    // Extraire et formater la note moyenne (vote_average) à 1 décimale
    
    // Extraire le nombre de votes (vote_count)
    
    // Extraire la popularité et l'arrondir
    
    // Construire les URLs complètes des images
    // Utiliser une image de fallback si pas d'image disponible
    
    // Extraire et joindre les genres en chaîne de caractères
    
    // Chercher le réalisateur dans les crédits (job === 'Director')
    // Ou le créateur dans item.created_by pour les séries
    
    // Extraire les 5 premiers acteurs principaux depuis credits.cast
    
    // Calculer budget et revenus en millions de dollars (seulement pour films)
    
    // Extraire la durée (runtime pour films, episode_run_time pour séries)
    
    // Choisir l'emoji selon le type (🎬 pour films, 📺 pour séries)
    
    // === CONSTRUCTION DU DOM ===
    // Vider complètement le body pour repartir de zéro
    
    // === CRÉER LE CONTAINER PRINCIPAL ===
    // Créer un div qui contiendra toute la page
    
    // === CRÉER L'EN-TÊTE ===
    // Créer un header avec image de fond (backdrop)
    // Appliquer un gradient pour améliorer la lisibilité du texte
    
    // Créer un bouton "Retour" en haut à gauche
    // onclick = appeler la fonction retourAccueil()
    
    // Créer le contenu de l'en-tête (titre + métadonnées)
    
    // Créer le titre avec emoji
    
    // Créer le conteneur des métadonnées (note, année, genre, durée)
    
    // Créer la note avec couleur selon la valeur (getNoteColor)
    
    // Extraire l'année de la date de sortie
    
    // Afficher les genres
    
    // Afficher la durée
    
    // Assembler l'en-tête et l'ajouter au container
    
    // === CRÉER LE CORPS ===
    // Créer un div pour le contenu principal
    
    // === SECTION POSTER (gauche) ===
    // Créer la section pour l'affiche du film
    
    // Créer l'élément img avec le poster
    
    // Créer le conteneur des boutons d'action
    
    // Bouton "Bande-annonce" → appelle rechercherBandeAnnonce()
    
    // Bouton "J'aime" (placeholder, pas d'action pour l'instant)
    
    // Bouton "Voir sur TMDB" → ouvre le site TMDB dans nouvel onglet
    
    // Assembler la section poster
    
    // === SECTION INFORMATIONS (droite) ===
    // Créer la section pour toutes les informations textuelles
    
    // --- Sous-section Synopsis ---
    // Créer un conteneur pour le synopsis
    // Créer un h2 avec titre "📝 Synopsis"
    // Créer un paragraphe avec le résumé (overview)
    
    // --- Sous-section Casting ---
    // Créer un conteneur pour le casting
    // Créer un h2 avec titre "🎭 Casting"
    // Créer un paragraphe avec réalisateur et acteurs
    
    // --- Sous-section Informations détaillées ---
    // Créer un conteneur pour les infos techniques
    // Créer un h2 avec titre "ℹ️ Informations"
    // Créer une grille d'informations
    
    // Si type === 'movie', afficher budget/revenus
    // Si type === 'tv', afficher nombre de saisons/épisodes
    
    // Afficher genres, date, durée, langue, statut
    // Utiliser creerInfoItem() pour chaque information
    
    // --- Sous-section Statistiques TMDB ---
    // Créer un conteneur pour les statistiques
    // Créer un h2 avec titre "📊 Statistiques TMDB"
    // Créer un conteneur flex pour les stats
    
    // Afficher note moyenne, nombre de votes, popularité
    // Utiliser creerStatItem() pour chaque statistique
    
    // === ASSEMBLER TOUS LES ÉLÉMENTS ===
    // Ajouter la section poster au body
    // Ajouter la section informations au body
    // Ajouter le body au container
    // Ajouter le container au document.body
}

/**
 * Fonction pour rechercher la bande-annonce sur YouTube
 * Appelle l'API TMDB pour obtenir les vidéos associées au film/série
 * @param {String} itemId - ID TMDB du film/série
 * @param {String} itemType - Type: 'movie' ou 'tv'
 */
async function rechercherBandeAnnonce(itemId, itemType) {
    // Construire l'endpoint selon le type (movie ou tv)
    
    // Construire l'URL pour récupérer les vidéos
    // Endpoint: /{type}/{id}/videos
    
    // Faire la requête fetch
    
    // Parser la réponse JSON
    
    // Vérifier si des résultats existent
    
    // Chercher une vidéo avec type === 'Trailer' et site === 'YouTube'
    
    // Si trouvée, ouvrir YouTube dans un nouvel onglet
    // URL: https://www.youtube.com/watch?v={video.key}
    
    // Sinon, afficher une alerte "Aucune bande-annonce disponible"
    
    // En cas d'erreur, afficher dans console et alerte
}

/**
 * Fonction helper pour créer un item d'information
 * Génère un div avec label et valeur pour la grille d'infos
 * @param {String} label - Label de l'information (ex: "🎬 Réalisateur:")
 * @param {String} value - Valeur de l'information (ex: "David Fincher")
 * @returns {HTMLElement} - Élément div contenant label et valeur
 */
function creerInfoItem(label, value) {
    // Créer un div conteneur avec classe 'info-item'
    
    // Créer un span pour le label avec classe 'info-label'
    // Définir le texte du label
    
    // Créer un span pour la valeur avec classe 'info-value'
    // Définir le texte de la valeur
    
    // Ajouter label et valeur au conteneur
    
    // Retourner le conteneur
}

/**
 * Fonction helper pour créer un item de statistique
 * Génère un div pour afficher une stat (note, votes, popularité)
 * @param {String} value - Valeur de la statistique (ex: "8.4/10")
 * @param {String} label - Label de la statistique (ex: "Note moyenne")
 * @returns {HTMLElement} - Élément div contenant valeur et label
 */
function creerStatItem(value, label) {
    // Créer un div conteneur avec classe 'stat-item'
    
    // Créer un div pour la valeur avec classe 'stat-value'
    // Définir le texte de la valeur (gros chiffre)
    
    // Créer un div pour le label avec classe 'stat-label'
    // Définir le texte du label (description)
    
    // Ajouter valeur et label au conteneur
    
    // Retourner le conteneur
}

/**
 * Fonction pour obtenir la couleur selon la note
 * Retourne un code couleur CSS selon la valeur de la note
 * @param {Number} note - Note entre 0 et 10
 * @returns {String} - Code couleur hexadécimal
 */
function getNoteColor(note) {
    // Si note >= 7, retourner vert (#4CAF50) - Bonne note
    
    // Si note >= 5, retourner orange (#FF9800) - Note moyenne
    
    // Sinon, retourner rouge (#F44336) - Mauvaise note
}

/**
 * Fonction pour retourner à l'accueil
 * Utilise l'historique du navigateur pour revenir à la page précédente
 */
function retourAccueil() {
    // Appeler window.history.back() pour retourner à la page précédente
}

// ========================================
// INITIALISATION
// ========================================

/**
 * Événement déclenché quand le DOM est complètement chargé
 * Lance le chargement des détails du film/série
 */
document.addEventListener('DOMContentLoaded', function() {
    // Appeler chargerDetailsItemTMDB() pour démarrer le chargement
    chargerDetailsItemTMDB();
});
