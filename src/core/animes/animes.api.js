const API_URL = "https://kitsu.io/api/edge/anime";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getFetchAnimeList = async () => {
    try {
        await delay(400); // evita demasiadas peticiones

        const response = await fetch(`${API_URL}?limit=24`);

        if (!response.ok) {
            throw new Error("Error en la API");
        };

        const json = await response.json();
        return json.data.map(item => ({
            mal_id: item.id,
            title: item.attributes.titles?.en_jp || item.attributes.titles?.en || item.attributes.slug,
            images: { jpg: { image_url: item.attributes.posterImage?.small } },
            synopsis: item.attributes.synopsis,
            episodes: item.attributes.episodeCount,
            score: item.attributes.averageRating
        }));
    }
    catch (error) {
        console.error("Error al obtener la lista de animes", error);
        return [];
    };
};

export const getAnimeById = async (id) => {
    try {
        await delay(400);

        const response = await fetch(`${API_URL}/${id}`);
        const json = await response.json();

        const anime = json.data;

        return {
            mal_id: anime.id,
            title: anime.attributes.titles?.en_jp || anime.attributes.titles?.en,
            images: { jpg: { image_url: anime.attributes.posterImage?.small } },
            synopsis: anime.attributes.synopsis,
            episodes: anime.attributes.episodeCount,
            score: anime.attributes.averageRating,
            status: anime.attributes.status
        };
    } catch (error) {
        console.error("Error al obtener anime", error);
        throw error;
    };
};

export const searchAnime = async (query) => {
    try {
        await delay(400);

        const response = await fetch(`${API_URL}?q=${encodeURIComponent(query)}&limit=12`);
        const json = await response.json();

        return json.data.map(item => ({
            mal_id: item.id,
            title: item.attributes.titles?.en_jp || item.attributes.titles?.en,
            images: { jpg: { image_url: item.attributes.posterImage?.small } },
            synopsis: item.attributes.synopsis,
            episodes: item.attributes.episodeCount,
            score: item.attributes.averageRating
        }));
    } catch (error) {
        console.error("Error al buscar anime:", error)
        return [];
    };
};