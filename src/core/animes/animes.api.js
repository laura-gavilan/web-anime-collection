const API_URL = "https://api.jikan.moe/v4/anime";

export const getFetchAnimeList = async () => {
    try {
        const response = await fetch(`${API_URL}?limit=24`);

        if (!response.ok) {
            throw new error("Error en la API");
        };

        const data = await response.json();
        return data.data || [];
    }
    catch (error) {
        console.error("Error al obtener la lista de animes", error);
        return [];
    };
};

export const getAnimeById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error al obtener anime", error);
        throw error;
    };
};

export const searchAnime = async (query) => {
    try {
        const response = await fetch(`${API_URL}?q=${encodeURIComponent(query)}&limit=12`);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error al buscar anime:", error)
        return [];
    };
};