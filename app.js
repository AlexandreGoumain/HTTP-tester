import fs from "fs";
import http from "http";
import querystring from "querystring";
import url from "url";
import usersData from "./src/ressources.js";
import {
    displayUser,
    displayUsers,
    form,
    navbar,
    updateForm,
} from "./src/utils.js";

let users = [...usersData];

try {
    if (fs.existsSync("users.json")) {
        const savedUsers = JSON.parse(fs.readFileSync("users.json", "utf8"));
        users = savedUsers;
    }
} catch (error) {
    console.error("Error loading users from file:", error);
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname.replace("/", "");
    const query = parsedUrl.query;

    if (path === "form" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`
            ${navbar()}
            <h1>Formulaire :</h1>
            ${form()}
        `);
        return;
    }

    if (path === "form" && req.method === "POST") {
        let body = "";

        req.on("data", (data) => {
            body += data;
        });

        req.on("end", () => {
            const dataObject = querystring.parse(body);

            if (
                (!dataObject.name || dataObject.name.trim() === "") &&
                (!dataObject.role || dataObject.role.trim() === "") &&
                (!dataObject.email || dataObject.email.trim() === "")
            ) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(
                    JSON.stringify({ message: "Tous les champs sont requis" })
                );
                return;
            }

            users.push({
                nom: dataObject.name,
                email: dataObject.email,
                role: dataObject.role,
            });

            fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: dataObject }));
        });

        return;
    }

    if (path === "update" && req.method === "POST") {
        let body = "";

        req.on("data", (data) => {
            body += data;
        });

        req.on("end", () => {
            const dataObject = querystring.parse(body);
            const userEmail = dataObject.email;

            const user = users.find((u) => u.email === userEmail);

            if (!user) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Utilisateur non trouvé" }));
                return;
            }

            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            res.end(`
                ${navbar()}
                <h1>Mettre à jour l'utilisateur :</h1>
                ${updateForm(user)}
            `);
        });

        return;
    }

    if (path === "saveupdate" && req.method === "POST") {
        let body = "";

        req.on("data", (data) => {
            body += data;
        });

        req.on("end", () => {
            const dataObject = querystring.parse(body);
            const originalEmail = dataObject.originalEmail;

            const userIndex = users.findIndex((u) => u.email === originalEmail);

            if (userIndex === -1) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Utilisateur non trouvé" }));
                return;
            }

            users[userIndex] = {
                nom: dataObject.name,
                email: dataObject.email,
                role: dataObject.role,
            };

            fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

            res.writeHead(302, { Location: "/users" });
            res.end();
        });

        return;
    }

    if (path === "delete" && req.method === "POST") {
        let body = "";

        req.on("data", (data) => {
            body += data;
        });

        req.on("end", () => {
            const dataObject = querystring.parse(body);
            const userEmail = dataObject.email;

            users = users.filter((u) => u.email !== userEmail);

            fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

            res.writeHead(302, { Location: "/users" });
            res.end();
        });

        return;
    }

    if (path === "user" && req.method === "GET") {
        const userEmail = query.email;
        const user = users.find((u) => u.email === userEmail);

        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`
            ${navbar()}
            <h1>Detail de l'utilisateur :</h1>
            ${displayUser(user)}
        `);
        return;
    }

    if (path === "users" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`
            ${navbar()}
            <h1>Liste des Users :</h1>
            ${displayUsers(users)}
        `);
        return;
    }

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`
        ${navbar()}
        <h1>Liste des Users :</h1>
        ${displayUsers(users)}
    `);
    return;
});

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
