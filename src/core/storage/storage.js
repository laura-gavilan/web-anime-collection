export const saveList = (key, anime) => {
    const list = JSON.parse(localStorage.getItem(key)) || [];
    if (!list.find((anime) => anime._id === anime._id)) {
        list.push(anime);
        localStorage.setItem(key, JSON.stringify(list));
    };
};

export const removeList = (key, id) => {
    const list = JSON.parse(localStorage.getItem(key)) || [];
    const newlist = list.filter((anime) => anime._id !== anime._id);
    localStorage.setItem(key, JSON.stringify(newlist));
};

export const getList = (key) => JSON.parse(localStorage.getItem(key)) || [];