"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IOManger_1 = require("./managers/IOManger");
const io = IOManger_1.IOManger.getIO();
io.on("connection", (client) => {
    client.on("event", (data) => {
        console.log("Event recieved: ", data);
        // 3 admin events
        //  2 client events
        // UserMmanger => QuizManager => Quiz => broadcast
        //
    });
    client.on("disconnect", () => {
        console.log("User Desconnected");
    });
});
io.listen(4000);
