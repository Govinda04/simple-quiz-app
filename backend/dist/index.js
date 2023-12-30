"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IOManger_1 = require("./managers/IOManger");
const UserManager_1 = require("./managers/UserManager");
const io = IOManger_1.IOManger.getIO();
const userManger = new UserManager_1.UserManager();
io.on("connection", (socket) => {
    userManger.addUser(socket);
    // socket.on("join_admin", (data) => {
    //   console.log("Event recieved: ", data);
    //   // 3 admin events
    //   //  2 client events
    //   // UserMmanger => QuizManager => Quiz => broadcast
    //   //
    // });
    socket.on("disconnect", () => {
        console.log("User Disconnected");
    });
});
io.listen(3000);
