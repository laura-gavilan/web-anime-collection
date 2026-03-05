export const login = (email, password) => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    if (user[email] && user[email].password === password) {
        localStorage.setItem("Usuario logueado", email);
        return true;
    }
    return false;
};

export const register = (email, password) => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    if (!user[email]) {
        user[email] = {password};
        localStorage.setItem("user", JSON.stringify(user))
        return true;
    }
    return false
};

export const getUser = () => localStorage.getItem("Usuario logueado");
export const logout = () => localStorage.removeItem("Usuario logueado");

