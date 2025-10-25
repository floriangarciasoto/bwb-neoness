// ========================================
// NETFLOP - Version avec API TMDB
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

// Configuration de l'API TMDB
// Clé API personnelle pour accéder aux données de The Movie Database
const API_KEY = obtenirCleAPI();

// URL de base pour toutes les requêtes API (version 3 de l'API TMDB)
const BASE_URL = 'https://api.themoviedb.org/3/';

// URL de base pour charger les images (affiches de films)
// w500 = largeur de 500 pixels pour les images
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500/';

/**
 * Fonction principale pour charger toutes les données depuis TMDB
 * Fonction asynchrone (async) car elle doit attendre les réponses de l'API
 */
async function chargerNetflopTMDB() {
    // Afficher un message dans la console pour indiquer le début du chargement
    console.log("Chargement de l'API TMDB ...");
    
    try {
        // Charger les catégories en parallèle avec Promise.all()
        let categories = [
            {
                // Titre h2 de la section
                title: "Films populaires",
                // 'movie' = type de contenu
                type: "movie",
                // movie/popular = endpoint pour les films populaires
                endpoint: `movie/popular`,
                // language=fr-FR = obtenir les résultats en français
                // page=1 = première page de résultats
                params: `?language=fr-FR` + `&page=1`,
                // ID du noeud de la balise section dans laquelle sera affichée notre catégorie
                nodeID: "films-populaires",
                // Couleur du background de la section
                color: "red"
            },
            {
                // Titre h2 de la section
                title: "Séries populaires",
                // 'tv' = type de contenu (série TV)
                type: "tv",
                // tv/popular = endpoint pour les séries TV populaires
                endpoint: `tv/popular`,
                // language=fr-FR = obtenir les résultats en français
                // page=1 = première page de résultats
                params: `?language=fr-FR` + `&page=1`,
                // ID du noeud de la balise section dans laquelle sera affichée notre catégorie
                nodeID: "series-populaires",
                // Couleur du background de la section
                color: "blue"
            },
            {
                // Titre h2 de la section
                title: "Documentaires",
                // 'movie' car les documentaires sont considérés comme des films
                type: "movie",
                // discover/movie = endpoint pour découvrir des films avec filtres
                endpoint: `discover/movie`,
                // with_genres=99 = ID 99 correspond au genre "Documentaire"
                // sort_by=popularity.desc = trier par popularité décroissante
                params: `?with_genres=99` + `&page=1` + `&sort_by=popularity.desc`,
                // ID du noeud de la balise section dans laquelle sera affichée notre catégorie
                nodeID: "documentaires",
                // Couleur du background de la section
                color: "green"
            },
            {
                // Titre h2 de la section
                title: "Animes",
                // 'tv' car les animes sont des séries TV
                type: "tv",
                // discover/tv = endpoint pour découvrir des séries avec filtres
                endpoint: `discover/tv`,
                // with_genres=16 = ID 16 correspond au genre "Animation"
                // with_origin_country=JP = filtrer par pays d'origine = Japon
                // sort_by=popularity.desc = trier par popularité décroissante
                params: `?with_genres=16` + `&with_origin_country=JP` + `&page=1` + `&sort_by=popularity.desc`,
                // ID du noeud de la balise section dans laquelle sera affichée notre catégorie
                nodeID: "animes",
                // Couleur du background de la section
                color: "yellow"
            }
        ];

        // await = attendre que toutes les promesses soient terminées
        // Promise.all() = exécuter plusieurs requêtes en même temps (plus rapide)
        await Promise.all(
            // Mapping des catégories
            // La méthode .map() permet de transformer chaque objet du tableau categories
            // en appel de la fonction afficherCategorie() en lui passant en argument
            // toutes ses propriétés dans le bon ordre
            categories.map(category =>
                afficherCategorie(
                    category.title,
                    category.type,
                    category.endpoint,
                    category.params,
                    category.nodeID,
                    category.color
                )
            )
        ).then(() => {
            // Message de succès quand tout est chargé
            console.log("Tout est chargé.");
        })
    } catch (error) {
        // Si une erreur se produit, l'afficher dans la console
        console.error("Echec du chargement de Netflop TMDB :",error);
        // Afficher une alerte à l'utilisateur
        // alert("Echech du chargement de Netflop TMDB.");
    }
}

/**
 * Fonction pour afficher le contenu d'une catégorie dans un slider
 * Fonction asynchrone car elle fait une requête à l'API
 * @param {*} title - titre h2 de la section
 * @param {*} type - type de contenu
 * @param {*} query - partie finale de l'URL pour l'API contenant l'endpoint et les paramètres de la requête
 * @param {*} nodeID - id du noeud de la balise section dans laquelle sera affichée notre catégorie
 * @param {*} color - couleur du background de la section
 */
async function afficherCategorie(title,type,endpoint,params,nodeID,color) {
    try {
        // Construire l'URL de la requête API avec les paramètres
        // api_key = notre clé d'authentification
        const URL = BASE_URL + endpoint + params + `&api_key=${API_KEY}`;
        
        // ============================================
        // FETCH : ÉTAPE 1 - Lancer la requête HTTP
        // ============================================
        // fetch(url) envoie une requête HTTP GET à l'API TMDB
        // C'est une opération ASYNCHRONE (ne bloque pas le reste du code)
        // await = PAUSE : attendre que le serveur réponde avant de continuer
        // Résultat stocké dans 'response' = objet Response avec infos HTTP
        let response = await fetch(URL);
        
        // ============================================
        // FETCH : ÉTAPE 2 - Vérifier le code HTTP
        // ============================================
        // response.ok vérifie si le code HTTP est 2xx (succès)
        // Exemples : 200 = OK, 404 = Not Found, 500 = Server Error
        // Si erreur (404, 500...), on lance une exception
        if (!response.ok) {
            console.error("Impossible de récuperer les informations de la catégorie :",title);
            return;
        }
        
        // ============================================
        // FETCH : ÉTAPE 3 - Convertir JSON → JavaScript
        // ============================================
        // Le serveur envoie les données au format JSON (texte)
        // response.json() les convertit en objet JavaScript utilisable
        // C'est aussi asynchrone, donc on utilise await
        // Résultat : 'data' contient un objet avec { results: [...films] }
        let data = await response.json();
        
        // Récupérer le conteneur HTML où afficher les films
        let container = document.getElementById(nodeID);
        // Si la section existe déjà dans le DOM, on la vide
        if (container !== null) {
            // Vider le conteneur (supprimer le loader animé)
            container.innerHTML = "";
        }
        // Sinon, on en ajoute une nouvelle avec le bon ID
        else {
            container = document.createElement("section");
            container.id = nodeID;
            // Ajout de la section au DOM
            let main = document.getElementsByTagName("main")[0];
            main.appendChild(container);
        }

        // Ajout de la couleur du background
        container.className = `gradient-${color} p-3`;
        
        // Créer un élément h2 pour le titre de la section
        // Définir le texte du titre
        // Ajouter le titre au conteneur
        let h2 = document.createElement("h2");
            h2.textContent = title;
            h2.className = "h2 text-center mt-3 mb-4";
        container.appendChild(h2);
        
        // Créer la structure du slider avec les 15 premiers films
        // data.results = tableau de films reçu de l'API
        // slice(0, 15) = prendre seulement les 15 premiers
        let items = data.results.slice(0, 15);
        
        // Ajouter le slider au conteneur
        let slider = creerSlider(items, type, title);
        container.appendChild(slider);

    }
    catch(error) {
        // ============================================
        // GESTION DES ERREURS avec catch
        // ============================================
        // Si une erreur se produit dans le bloc try :
        // - Erreur réseau (pas de connexion internet)
        // - Erreur HTTP (404, 500...)
        // - Erreur de parsing JSON
        // Le code "saute" directement ici dans le catch
        // On affiche l'erreur dans la console pour déboguer
        console.error("Erreur lors du chargement de la catégorie :",title);
        console.error(error);
    }
    
}

/**
 * Créer la structure complète du slider avec boutons de navigation
 * @param {Array} items - Tableau des films/séries à afficher
 * @param {String} type - Type de contenu : 'movie' ou 'tv'
 * @returns {HTMLElement} - Conteneur complet du slider
 */
function creerSlider(items, type, title) {
    console.log(title,items);

    // Créer le conteneur principal qui va contenir tout le slider
    // Ajouter la classe CSS 'slider-container'
    let slider = document.createElement("div");
        slider.className = "slider-container d-flex align-items-center";
    
    // === BOUTON PRÉCÉDENT (gauche) ===
    // Créer un bouton pour naviguer vers la gauche
    // Ajouter les classes CSS pour le style et la position
    // Ajouter le symbole flèche gauche (◄) avec code HTML
    // Désactiver le bouton par défaut (on est au début)
    let buttonLeft = document.createElement("button");
        buttonLeft.className = "slider-button m-3 me-4";
        buttonLeft.innerHTML = "&#x1F844;";
        buttonLeft.setAttribute("disabled",true);

    // === BOUTON SUIVANT (droite) ===
    // Créer un bouton pour naviguer vers la droite
    // Ajouter les classes CSS pour le style et la position
    // Ajouter le symbole flèche droite (►) avec code HTML
    let buttonRight = document.createElement("button");
        buttonRight.className = "slider-button m-3 ms-4";
        buttonRight.innerHTML = "&#x1F846;";
    
    // === WRAPPER DES CARTES ===
    // Créer le conteneur qui va contenir toutes les cartes
    // Ajouter la classe CSS (display: flex, overflow-x: hidden)
    let wrapper = document.createElement("div");
        wrapper.className = "d-flex overflow-x-scroll gap-4";
    slider.appendChild(wrapper);
    
    // === AJOUTER TOUTES LES CARTES ===
    // Parcourir chaque élément (film ou série) du tableau items
    // Créer une carte pour cet élément
    // Ajouter la carte au wrapper
    for (let i = 0; i < items.length; i++) {
        let card = creerCarteTMDB(items[i], type);
        wrapper.appendChild(card);
    }
    
    // === FONCTION DE SCROLL ===
    // Fonction pour faire défiler le slider vers la gauche ou la droite
    // Calculer la distance de scroll (80% de la largeur visible)
    // Si direction est 'next', scroller vers la droite
    // Sinon, scroller vers la gauche
    
    // === FONCTION POUR METTRE À JOUR LES BOUTONS ===
    // Active ou désactive les boutons selon la position du scroll
    // Désactiver le bouton précédent si on est tout à gauche (début)
    // scrollLeft <= 0 signifie qu'on ne peut plus aller à gauche
    
    // Calculer la position maximale du scroll (largeur totale - largeur visible)
    // Désactiver le bouton suivant si on est tout à droite (fin)
    // -10 pour une petite marge d'erreur
    
    // === ÉVÉNEMENTS DES BOUTONS ===
    // Quand on clique sur le bouton précédent
    // Scroller vers la gauche
    // Après 300ms, mettre à jour l'état des boutons (attendre la fin de l'animation)
    
    // Quand on clique sur le bouton suivant
    // Scroller vers la droite
    // Après 300ms, mettre à jour l'état des boutons
    
    // === ÉVÉNEMENT DE SCROLL ===
    // Quand l'utilisateur scroll manuellement, mettre à jour les boutons
    
    // === INITIALISATION ===
    // Vérifier l'état initial des boutons après un court délai
    // (nécessaire pour que le DOM soit bien rendu)
    
    // === ASSEMBLER LE SLIDER ===
    // Ajouter le bouton précédent au conteneur
    slider.appendChild(buttonLeft);
    // Ajouter le wrapper des cartes au conteneur
    slider.appendChild(wrapper);
    // Ajouter le bouton suivant au conteneur
    slider.appendChild(buttonRight);
    
    // Retourner le slider complet
    return slider;
}

/**
 * Créer une carte HTML complète pour afficher un film ou une série
 * @param {Object} item - Objet contenant toutes les données d'un film/série depuis l'API TMDB
 * @param {String} type - Type de contenu : 'movie' (film) ou 'tv' (série)
 * @returns {HTMLElement} - Élément div représentant la carte complète
 */
function creerCarteTMDB(item, type) {
    // === CRÉER LE CONTENEUR PRINCIPAL ===
    // Créer un div qui va contenir toute la carte
    // Ajouter la classe CSS 'card' pour le style
    let card = document.createElement("article");
        card.className = "card p-3 my-3 bg-dark-grey text-white";
    
    // === EXTRAIRE LES DONNÉES SELON LE TYPE ===
    // Si c'est un film, utiliser 'title', sinon utiliser 'name' (pour les séries)
    let itemTitle;
    if (type === "movie") {
        itemTitle = item.title;
    }
    else {
        itemTitle = item.name;
    }
    
    // Si c'est un film, utiliser 'release_date', sinon 'first_air_date' (séries)
    let itemDate;
    if (type === "movie") {
        itemDate = item.release_date;
    }
    else {
        itemDate = item.first_air_date;
    }

    // Récupérer le résumé, ou mettre un message par défaut s'il n'existe pas
    let resume = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed porro dolor aspernatur ad dolorem amet eligendi aut adipisci. Dolore magnam vitae ducimus distinctio id doloribus et ipsa. Aliquid repudiandae omnis commodi repellat atque expedita! Fugit, quis sed sint sit deleniti quod doloremque distinctio nobis maiores quos voluptas omnis excepturi incidunt?";
    if (Object.hasOwn(item,"overview") && item.overview !== "") {
        resume = item.overview;
    }

    // Récupérer la note moyenne et la formater à 1 décimale (ex: 7.3)
    // Si pas de note, afficher 'N/A'
    let itemNote = -1;
    if (Object.hasOwn(item,"vote_average") && item.vote_average !== 0) {
        itemNote = item.vote_average.toFixed(1);
    }
    
    // Construire l'URL complète de l'image (affiche du film)
    // Si poster_path existe, utiliser l'URL TMDB, sinon image placeholder
    const PLACEHOLDER_IMAGE = "images/film-poster-placeholder.jpg";
    let imgURL = PLACEHOLDER_IMAGE;
    if (Object.hasOwn(item,"poster_path") && item.poster_path !== null) {
        imgURL = IMAGE_BASE_URL + item.poster_path;
    }

    // === CRÉER L'IMAGE ===
    // Créer un élément img pour l'affiche du film
    let cardPoster = document.createElement("img");
    // Définir la source de l'image
    cardPoster.src = imgURL;
    // Définir le texte alternatif (pour l'accessibilité)
    cardPoster.alt = "Affiche pour " + itemTitle;
    // Ajouter la classe CSS pour le style
    cardPoster.className = "card-img";
    
    // Gérer les erreurs de chargement d'image
    // Si l'image ne charge pas, afficher une image placeholder
    cardPoster.onerror = () => {
        cardPoster.src = PLACEHOLDER_IMAGE;
        cardPoster.alt = "Affiche indisponible pour " + itemTitle;
    };

    // === CRÉER LE CONTENEUR DES INFORMATIONS ===
    // Créer un div pour contenir toutes les informations textuelles
    // Ajouter la classe CSS pour le style
    let cardInfos = document.createElement("div");
        cardInfos.className = "card-infos";
    
    // === CRÉER LE TITRE ===
    // Créer un élément h3 pour le titre du film/série
    // Définir le texte du titre
    let cardTitle = document.createElement("h3");
        cardTitle.className = "card-title text-center h3 my-2 max-lines max-lines-2";
        cardTitle.textContent = itemTitle;

    let cardSpecs = document.createElement("div");
        cardSpecs.className = "d-flex justify-content-between align-items-center";
    
    // === CRÉER L'ÉLÉMENT NOTE ===
    // Créer un paragraphe pour afficher la note
    let cardNote = document.createElement("p");
    // Définir le contenu HTML avec l'étoile et la note
    if (itemNote !== -1) {
        cardNote.innerHTML = "⭐ " + itemNote;
    }
    else {
        cardNote.innerHTML = "⭐ N/A";
    }
    cardNote.className = "card-note rounded m-0";
    
    // === AJOUTER UNE COULEUR SELON LA NOTE ===
    // Convertir la note en nombre pour la comparer
    // Si note >= 7, couleur verte (bonne note)
    // Si note entre 5 et 7, couleur orange (note moyenne)
    // Si note entre 0 et 5, couleur rouge (mauvaise note)
    cardNote.className += itemNote >= 7 ? " card-note-green" : itemNote >= 5 ? " card-note-orange" : itemNote > 0 ? " card-note-red" : "";
    
    // === CRÉER L'ÉLÉMENT DATE DE SORTIE ===
    // Créer un paragraphe pour la date de sortie
    let cardDate = document.createElement("time");
        cardDate.className = "d-block";
    // Si dateSortie existe, la formater en français (jj/mm/aaaa)
    if (itemDate !== undefined && itemDate !== "") {
        cardDate.dateTime = itemDate;
        itemDate = new Date(itemDate);
        itemDate = itemDate.toLocaleDateString('fr-FR');
    }
    // Sinon afficher 'Date inconnue'
    else {
        itemDate = "Date inconnue";
    }
    // Définir le contenu HTML avec la date formatée
    cardDate.textContent = itemDate;
    
    // === CRÉER LE BADGE DE TYPE ===
    // Créer un span pour afficher le type (Film ou Série)
    let cardBadge = document.createElement("p");
    // Ajouter la classe CSS
    cardBadge.className = "card-badge m-0";
    // Si type est 'movie', afficher "🎬 Film", sinon "📺 Série"
    cardBadge.textContent = type === "movie" ? "🎬 Film" : "📺 Série";
    // Ajouter des styles inline pour le badge (fond rouge, texte blanc, arrondi)
    
    // === CRÉER LE CONTENEUR DU RÉSUMÉ ===
    // Créer un div pour contenir le résumé
    let cardResume = document.createElement("div");
    // Ajouter la classe CSS
    cardResume.className = "";
    
    // === CRÉER L'ÉLÉMENT RÉSUMÉ ===
    // Créer un paragraphe pour le résumé
    let cardResumeParagraph = document.createElement("p");
    // Ajouter la classe CSS
    cardResumeParagraph.className = "card-resume text-justify max-lines max-lines-3";
    // Ajouter des styles inline pour limiter à 3 lignes avec ellipsis (...)
    // overflow: hidden = cacher le débordement
    // text-overflow: ellipsis = ajouter ... à la fin
    // -webkit-line-clamp: 3 = limiter à 3 lignes
    // Définir le contenu HTML avec le résumé
    cardResumeParagraph.textContent = resume;
    
    // Ajouter le résumé au conteneur
    cardResume.appendChild(cardResumeParagraph);
    
    // === ASSEMBLER TOUS LES ÉLÉMENTS ===
    // Ajouter l'image à la carte
    card.appendChild(cardPoster);
    // Ajouter le titre au conteneur d'informations
    cardInfos.appendChild(cardTitle);
    // Ajouter le badge de type
    cardSpecs.appendChild(cardBadge);
    // Ajouter la date de sortie
    cardSpecs.appendChild(cardDate);
    // Ajouter la note
    cardSpecs.appendChild(cardNote);

    // Ajouter le conteneur du résumé
    cardInfos.appendChild(cardResume);

    cardInfos.appendChild(cardSpecs);

    // Ajouter les informations à la carte
    card.appendChild(cardInfos);

    // === AJOUTER UN ÉVÉNEMENT DE CLIC ===
    // Changer le curseur en pointeur (main) au survol
    card.className += " cursor-pointer";
    // Ajouter un événement click pour ouvrir la page de détails
    // Vérifier que ce n'est pas un bouton de slider qui a été cliqué
    // Si c'est un bouton slider, ne rien faire
    
    // Construire l'URL de la page de détails selon le type (film ou série)
    // Ouvrir l'URL dans la même fenêtre
    card.onclick = function() {
        const DETAILS_URL = `description/?type=${type}&id=${item.id}`;
        console.log("Card click :",DETAILS_URL);
    }
    
    // Retourner la carte complète
    return card;
}

// ========================================
// FONCTIONS BONUS (non utilisées dans l'interface actuelle)
// ========================================

/**
 * Fonction bonus pour rechercher des films/séries par mot-clé
 * Peut être appelée depuis la console pour tester : rechercherContenu('Avengers')
 * @param {String} query - Mot-clé de recherche (ex: 'Avengers', 'Matrix')
 * @returns {Promise<Array>} - Tableau des résultats trouvés
 */
async function rechercherContenu(query) {
    // Construire l'URL de recherche
    // search/multi = rechercher dans films ET séries en même temps
    // encodeURIComponent() = encoder les caractères spéciaux pour l'URL
    
    // Faire la requête fetch et attendre la réponse
    
    // Vérifier si la requête a réussi
    
    // Convertir la réponse JSON en objet JavaScript
    // Afficher les résultats dans la console
    // Retourner le tableau des résultats
    
    // En cas d'erreur, l'afficher dans la console
    // Retourner un tableau vide
}

/**
 * Fonction bonus pour obtenir tous les détails d'un film spécifique
 * Inclut les acteurs, réalisateur, bande-annonce, etc.
 * Exemple : obtenirDetailsFilm(550) pour Fight Club
 * @param {Number} movieId - ID du film sur TMDB (visible dans l'URL TMDB)
 * @returns {Promise<Object|null>} - Objet contenant tous les détails ou null si erreur
 */
async function obtenirDetailsFilm(movieId) {
    // Construire l'URL pour obtenir les détails d'un film spécifique
    // movie/{movieId} = endpoint pour un film précis
    // append_to_response=credits,videos = inclure aussi les acteurs et vidéos
    
    // Faire la requête fetch et attendre la réponse
    
    // Vérifier si la requête a réussi
    
    // Convertir la réponse JSON en objet JavaScript
    // Afficher les détails dans la console
    // Retourner l'objet contenant tous les détails
    
    // En cas d'erreur, l'afficher dans la console
    // Retourner null pour indiquer qu'il y a eu une erreur
}

/**
 * Fonction bonus pour obtenir des films filtrés par genre
 * Exemple : obtenirFilmsParGenre(27) pour les films d'horreur
 * @param {Number} genreId - ID du genre TMDB (voir liste ci-dessous)
 * @returns {Promise<Array>} - Tableau des films du genre demandé
 */
async function obtenirFilmsParGenre(genreId) {
    /**
     * === LISTE COMPLÈTE DES GENRES TMDB ===
     * 28 = Action
     * 12 = Aventure
     * 16 = Animation
     * 35 = Comédie
     * 80 = Crime
     * 99 = Documentaire
     * 18 = Drame
     * 14 = Fantastique
     * 27 = Horreur
     * 10402 = Musique
     * 9648 = Mystère
     * 10749 = Romance
     * 878 = Science-Fiction
     * 53 = Thriller
     * 10752 = Guerre
     * 37 = Western
     */
    
    // Construire l'URL pour découvrir des films par genre
    // discover/movie = découvrir des films avec filtres
    // with_genres = filtrer par ID de genre
    // sort_by=popularity.desc = trier par popularité décroissante
    
    // Faire la requête fetch et attendre la réponse
    
    // Vérifier si la requête a réussi
    
    // Convertir la réponse JSON en objet JavaScript
    // Afficher les résultats dans la console
    // Retourner le tableau des films
    
    // En cas d'erreur, l'afficher dans la console
    // Retourner un tableau vide
}

// ========================================
// INITIALISATION DE L'APPLICATION
// ========================================

/**
 * Fonction d'initialisation qui se lance au chargement de la page
 * DOMContentLoaded = événement déclenché quand le HTML est complètement chargé
 */
document.addEventListener('DOMContentLoaded', function() {
    // Afficher un message dans la console pour confirmer que le DOM est chargé
    
    // === VÉRIFICATION DE LA CLÉ API ===
    // Vérifier si la clé API a été remplacée par une vraie clé
    if (API_KEY === "...") {
        // Si la clé n'a pas été changée, afficher une alerte
        alert("Clé API non chargée. Veuillez vous créer un compte sur TMDB pour obtenir une clé API.");
        // Afficher un message d'erreur dans la console
        console.error("Clé API non chargée.");
        // Afficher les instructions pour obtenir une clé API
        console.error("Veuillez vous créer un compte sur TMDB pour obtenir une clé API.");
        // Arrêter l'exécution (ne pas charger les données)
        return;
    }
    
    // === LANCEMENT DE L'APPLICATION ===
    // Si la clé API est valide, charger toutes les données
    chargerNetflopTMDB();
});
