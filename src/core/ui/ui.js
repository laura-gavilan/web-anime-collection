import { getList } from "../storage/storage";

export const renderAnimeList = (animes = [], onClick, onRemove) => {
    const list = document.getElementById("anime-list");
    list.innerHTML = ""; //vaciar la lista
    list.style.display = "grid"; //asegura que sea visible

    animes.forEach(anime => {
        const card = document.createElement("div");
        card.className = "anime-card";

        const imgUrl = anime.images?.jpg?.image_url || "";
        card.innerHTML = `
            <img src="${imgUrl}" alt="${anime.title}">
            <h3>${anime.title}</h3>
        `;

        card.addEventListener("click", () => onClick(anime.mal_id));

        if (onRemove) {
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "❌ Quitar";
            removeBtn.addEventListener("click", (event) => {
                event.stopPropagation(); //para no mostrar detalles al hacer click
                onRemove(anime.mal_id);
            });
            card.appendChild(removeBtn);
        }
        list.appendChild(card);
    });
};

//Detalles anime
export const showAnimeDetails = (anime, isFavorite) => {
    const pendingList = getList("animePending");
    const collectionList = getList("animeCollection");

    const isPending = pendingList.some(a => a.mal_id === anime.mal_id);
    const isCollection = collectionList.some(a => a.mal_id === anime.mal_id);

    document.getElementById("pending-btn").textContent = isPending ? "Quitar de pendientes" : "Agregar a pendientes";
    document.getElementById("collection-btn").textContent = isCollection ? "Quitar de colección" : "Añadir a colección";

    document.getElementById("anime-title").textContent = anime.title;
    document.getElementById("anime-synopsis").textContent = anime.synopsis || "Sin sinopsis";
    document.getElementById("anime-image").src = anime.images.jpg.image_url;
    document.getElementById("anime-episodes").textContent = anime.episodes ?? "N/A";
    document.getElementById("anime-score").textContent = anime.score ?? "N/A";
    document.getElementById("anime-status").textContent = anime.status ?? "N/A";

    const favoriteBtn = document.getElementById("favorite-btn");
    favoriteBtn.textContent = isFavorite ? "Quitar de favoritos" : "⭐ Agregar a Favoritos";


    document.getElementById("anime-list").style.display = "none";
    document.getElementById("anime-details").classList.remove("hidden");
};

export const hiddeAnimeDetails = () => {
    document.getElementById("anime-details").classList.add("hidden");
    document.getElementById("anime-list").style.display = "grid";
};

// const viewBtn = document.createElement("button");
// viewBtn.textContent = "👁 Vista";
// viewBtn.classList.add("view-btn");
// viewBtn.addEventListener("click", () => {
//     addToList("vista", anime);
// });
