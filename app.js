import http from "http";
import { displayUsers, shuffleUsers } from "./src/utils.js";
const server = http.createServer((req, res) => {
    const url = req.url.replace("/", "");

    if (url === "favicon.ico") {
        res.writeHead(200, { "Content-Type": "image/x-icon" });
        res.end();
        return;
    }

    if (url === "shuffle") {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`
            <h1>Users mélangés :</h1>
            ${shuffleUsers()}
        `);
        return;
    }

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`
        <h1>Liste des Users :</h1>
        ${displayUsers()}
    `);
    return;
});

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
