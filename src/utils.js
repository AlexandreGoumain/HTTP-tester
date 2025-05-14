import users from "./ressources.js";

const shuffleUsers = () => {
    users.sort(() => Math.random() - 0.5);
    return users.map((user) => `<p>${user}</p>`).join("");
};

const displayUsers = () => {
    return users.map((user) => `<p>${user}</p>`).join("");
};

export { displayUsers, shuffleUsers };
