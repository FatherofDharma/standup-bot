const http = require("http");
const express = require("express");
const app = express();

module.exports = keepRunning = () => {
    app.get("/", (request, response) => {
        console.log(Date.now() + " Ping Received");
        response.sendStatus(200);
    });

    app.listen(process.env.PORT);
    setInterval(() => {
        http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
    }, 10000);
};
