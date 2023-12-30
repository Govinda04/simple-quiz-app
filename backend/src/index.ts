import { IOManger } from "./managers/IOManger";
import { UserManager } from "./managers/UserManager";

const io = IOManger.getIO();

const userManger = new UserManager();

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
