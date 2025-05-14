import users from "./ressources.js";

const shuffleUsers = () => {
    users.sort(() => Math.random() - 0.5);
    return users.map((user) => `<p>${user}</p>`).join("");
};

const displayUsers = (customUsers = users) => {
    return customUsers
        .map(
            (user) =>
                `<div style="margin-bottom: 10px;">
                    <a href="/user?email=${user.email}">${user.nom}</a>
                    <form method="POST" action="/update" style="display: inline-block; margin-left: 10px;">
                        <input type="hidden" name="email" value="${user.email}">
                        <button type="submit">Mettre à jour</button>
                    </form>
                    <form method="POST" action="/delete" style="display: inline-block; margin-left: 10px;">
                        <input type="hidden" name="email" value="${user.email}">
                        <button type="submit">Supprimer</button>
                    </form>
                </div>`
        )
        .join("");
};

const deleteUser = (email) => {
    users = users.filter((user) => user.email !== email);
    return displayUsers(users);
};

const displayUser = (userObj) => {
    if (!userObj) {
        return "<p>User not found</p>";
    }

    return `
        <div>
            <p><strong>Nom:</strong> ${userObj.nom}</p>
            <p><strong>Email:</strong> ${userObj.email}</p>
            <p><strong>Rôle:</strong> ${userObj.role}</p>
        </div>
        <a href="/users">Retour à la liste</a>
    `;
};

const form = () => {
    return `
        <form action="/form" method="post">
            <label for="name">Nom :</label>
            <input type="text" id="name" name="name">
            <label for="email">Email :</label>
            <input type="email" id="email" name="email">
            <label for="role">Rôle :</label>
            <select id="role" name="role" defaultValue="user">
                <option value="admin">Admin</option>
                <option value="moderator">Modérateur</option>
                <option value="user">Utilisateur</option>
            </select>
            <button type="submit">Envoyer</button>
        </form>
    `;
};

const updateForm = (user) => {
    if (!user) {
        return "<p>User not found</p>";
    }

    return `
        <form action="/saveupdate" method="post">
            <input type="hidden" name="originalEmail" value="${user.email}">
            <label for="name">Nom :</label>
            <input type="text" id="name" name="name" value="${
                user.nom
            }" required>
            <label for="email">Email :</label>
            <input type="email" id="email" name="email" value="${
                user.email
            }" required>
            <label for="role">Rôle :</label>
            <select id="role" name="role" defaultValue="utilisateur">
                <option value="admin" ${
                    user.role === "admin" ? "selected" : ""
                }>Admin</option>
                <option value="modérateur" ${
                    user.role === "modérateur" ? "selected" : ""
                }>Modérateur</option>
                <option value="utilisateur" ${
                    user.role === "utilisateur" ? "selected" : ""
                }>Utilisateur</option>
            </select>
            <button type="submit">Sauvegarder</button>
        </form>
        <a href="/users">Annuler</a>
    `;
};

const navbar = () => {
    return `
        <nav style="display: flex; gap: 10px;">
            <a href="/form">Formulaire</a>
            <a href="/">Accueil</a>
        </nav>
    `;
};

export {
    deleteUser,
    displayUser,
    displayUsers,
    form,
    navbar,
    shuffleUsers,
    updateForm,
};
