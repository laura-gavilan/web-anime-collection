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

// ================= FAVORITOS =================
const loadFavorites = () => JSON.parse(localStorage.getItem(FAVORITES_LIST)) || [];
const saveFavorites = (favorites) => localStorage.setItem(FAVORITES_LIST, JSON.stringify(favorites));

const isFavorite = (anime) => loadFavorites().some(a => a.mal_id === anime.mal_id);

const toggleFavorite = (anime) => {
    let favorites = loadFavorites();
    if (favorites.some(a => a.mal_id === anime.mal_id)) {
        favorites = favorites.filter(a => a.mal_id !== anime.mal_id);
    } else {
        favorites.push(anime);
    }
    saveFavorites(favorites);
};

// ================= DETALLES =================
const handleAnimeClick = async (id) => {
    try {
        const anime = await getAnimeById(id);
        if (!anime) return;
        currentAnimeId = anime.mal_id;
        showAnimeDetails(anime, isFavorite(anime));
    } catch (error) {
        console.error("Error al mostrar detalles:", error);
    }
};

const showAllAnimes = async () => {
    const animes = await getFetchAnimeList();
    if (!animes || animes.length === 0) return;
    renderAnimeList(animes, handleAnimeClick);
};

const handleSearch = async (query) => {
    const animesSearch = await searchAnime(query);
    renderAnimeList(animesSearch, handleAnimeClick);
};

// ================= FAVORITE BUTTON =================
const handleFavoriteClick = async () => {
    if (!currentAnimeId) return;
    const anime = await getAnimeById(currentAnimeId);
    if (!anime) return;
    toggleFavorite(anime);
    showAnimeDetails(anime, isFavorite(anime));
};

const showFavorites = () => {
    const favorites = loadFavorites();
    renderAnimeList(favorites, handleAnimeClick, (mal_id) => {
        // quitar de favoritos
        let favs = loadFavorites();
        favs = favs.filter(a => a.mal_id !== mal_id);
        saveFavorites(favs);
        showFavorites();
    });
};

// ================= LISTAS =================
const toggleList = (key, anime) => {
    const list = getList(key);
    const exists = list.some(a => a.mal_id === anime.mal_id);
    if (exists) removeList(key, anime.mal_id);
    else saveList(key, anime);
};

const handleListButton = async (key) => {
    if (!currentAnimeId) return;
    const anime = await getAnimeById(currentAnimeId);
    if (!anime) return;
    toggleList(key, anime);
    handleAnimeClick(currentAnimeId);
};

const renderList = (key) => {
    const list = getList(key);
    renderAnimeList(list, handleAnimeClick, (id) => {
        removeList(key, id);
        renderList(key);
    });
    hiddeAnimeDetails();
};

// ================= EVENTOS =================
document.getElementById("back-btn").addEventListener("click", hiddeAnimeDetails);
document.getElementById("favorite-btn").addEventListener("click", handleFavoriteClick);
document.getElementById("pending-btn").addEventListener("click", () => handleListButton(PENDING_LIST));
document.getElementById("collection-btn").addEventListener("click", () => handleListButton(COLLECTION_LIST));

let searchTimeout;
document.getElementById("search-input").addEventListener("input", (event) => {
    const value = event.target.value.trim();
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        if (value.length >= 2) handleSearch(value);
        else showAllAnimes();
    }, 500);
});

document.getElementById("show-favorites").addEventListener("click", () => {
    hideForms();
    showFavorites();
});

document.getElementById("show-pending").addEventListener("click", () => {
    hideForms();
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
});
document.getElementById("login-btn").addEventListener("click", () => {
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
});
const showRegister = () => { registerForm.classList.remove("hidden"); loginForm.classList.add("hidden"); };
const showLogin = () => { loginForm.classList.remove("hidden"); registerForm.classList.add("hidden"); };
const hideForms = () => { registerForm.classList.add("hidden"); loginForm.classList.add("hidden"); };
registerBtn.addEventListener("click", showRegister);
loginBtn.addEventListener("click", showLogin);
goLogin.addEventListener("click", showLogin);
goRegister.addEventListener("click", showRegister);

// ================= VISTOS =================
document.getElementById("show-viewed").addEventListener("click", () => {
    hideForms();
    const user = getUser();
    if (!user) return alert("Inicia sesión para ver tus animes");
    const viewAnime = JSON.parse(localStorage.getItem(`vista_${user}`)) || [];
    renderAnimeList(viewAnime, handleAnimeClick);
});