import { getAnimeById, getFetchAnimeList, searchAnime } from "./core/animes/animes.api";
import { getUser } from "./core/auth/auth";
import { getList, removeList, saveList } from "./core/storage/storage";
import { hiddeAnimeDetails, renderAnimeList, showAnimeDetails } from "./core/ui/ui";

const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const registerBtn = document.getElementById("register-btn");
const loginBtn = document.getElementById("login-btn");
const goLogin = document.getElementById("go-login");
const goRegister = document.getElementById("go-register");


const FAVORITES_LIST = "animeFavorites";
const PENDING_LIST = "animePending";
const COLLECTION_LIST = "animeCollection";



let currentAnimeId = null;

// ================= FAVORITES =================

const loadFavorites = () =>
    JSON.parse(localStorage.getItem(FAVORITES_LIST)) || [];

const saveFavorites = (favorites) =>
    localStorage.setItem(FAVORITES_LIST, JSON.stringify(favorites));

const isFavorite = (id) => loadFavorites().includes(id);

const toggleFavorite = (id) => {
    let favorites = loadFavorites();

    if (favorites.includes(id)) {
        favorites = favorites.filter((fav) => fav !== id);
    } else {
        favorites.push(id);
    }

    saveFavorites(favorites);
};

// ================= DETALLES =================


const handleAnimeClick = async (id) => {
    const anime = await getAnimeById(id);

    if (anime) {
        currentAnimeId = anime.mal_id;
        showAnimeDetails(anime, isFavorite(anime.mal_id));
    }
};

const showAllAnimes = async () => {
    const animes = await getFetchAnimeList();
    renderAnimeList(animes, handleAnimeClick);
};

const handleSearch = async (query) => {
    const animesSearch = await searchAnime(query);
    renderAnimeList(animesSearch, handleAnimeClick);
};

// ================= FAVORITE BUTTON =================

const handleFavoriteClick = () => {
    if (!currentAnimeId) return;

    toggleFavorite(currentAnimeId);
    handleAnimeClick(currentAnimeId);
};

const showFavorites = async () => {
    const favoritesId = loadFavorites();

    const favorites = await Promise.all(
        favoritesId.map((id) => getAnimeById(id))
    );

    const favoritesList = favorites.filter((anime) => anime);
    renderAnimeList(favoritesList, handleAnimeClick);
};

// ================= LISTAS =================

const toggleList = (key, anime) => {
    const list = getList(key);
    const exists = list.some((a) => a.mal_id === anime.mal_id);

    if (exists) {
        removeList(key, anime.mal_id);
    } else {
        saveList(key, anime);
    }
};

const handleListButton = async (key) => {
    if (!currentAnimeId) return;

    const anime = await getAnimeById(currentAnimeId);

    if (anime) {
        toggleList(key, anime);
        handleAnimeClick(currentAnimeId);
    }
};

const renderList = (key) => {
    const list = getList(key);

    renderAnimeList(list, handleAnimeClick, (id) => {
        removeList(key, id);
        renderList(key);
    });

    hiddeAnimeDetails();
};

document.getElementById("back-btn").addEventListener("click", hiddeAnimeDetails);
document.getElementById("favorite-btn").addEventListener("click", handleFavoriteClick);
document.getElementById("pending-btn").addEventListener("click", () => handleListButton(PENDING_LIST));
document.getElementById("collection-btn").addEventListener("click", () => handleListButton(COLLECTION_LIST));
document.getElementById("search-input").addEventListener("input", (event) => {
    const value = event.target.value.trim();

    if (value.length >= 2) {
        handleSearch(value);
    } else {
        showAllAnimes();
    }
});

showAllAnimes();

document.getElementById("show-favorites").addEventListener("click", () => {
    hideForms();
    showFavorites();
});

document.getElementById("show-pending").addEventListener("click", () => {
    hideForms()
    renderList(PENDING_LIST);
});

document.getElementById("show-collection").addEventListener("click", () => {
    hideForms();
    renderList(COLLECTION_LIST);
});

document.getElementById("show-all").addEventListener("click", () => {
    hideForms();
    showAllAnimes();
});

showAllAnimes();
// ================= FORM TOGGLE =================

document.getElementById("register-btn").addEventListener("click", () => {
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    // registerForm.scrollIntoView({ behavior: "smooth" });
});

document.getElementById("login-btn").addEventListener("click", () => {
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    // loginForm.scrollIntoView({ behavior: "smooth" });
});

const showRegister = () => {
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
};

const showLogin = () => {
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
};

const hideForms = () => {
    registerForm.classList.add("hidden");
    loginForm.classList.add("hidden");
};

registerBtn.addEventListener("click", showRegister);
loginBtn.addEventListener("click", showLogin);

goLogin.addEventListener("click", showLogin);
goRegister.addEventListener("click", showRegister);




//VISTOS//

document.getElementById("show-viewed").addEventListener("click", () => {
    hideForms();
    const user = getUser();
    if (!user) return alert("Inicia sesión para ver tus animes");
    const viewAnime = JSON.parse(localStorage.getItem(`vista_${user}`)) || [];
    renderAnimeList(viewAnime, handleAnimeClick);
});




