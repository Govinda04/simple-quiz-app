//  join, get current state, submit
import { Socket } from "socket.io";
import { QuizManager } from "./QuizManager";

export class UseManager {
  private users: {
    roomId: string;
    socket: Socket;
  }[];

  private quizManger: QuizManager;

  constructor() {
    this.users = [];
    this.quizManger = new QuizManager();
  }

  addUser(roomId: string, socket: Socket) {
    this.users.push({
      roomId,
      socket,
    });

    this.createHandlers(roomId, socket);
  }

  private createHandlers(roomId: string, socket: Socket) {
    socket.on("join", (data) => {
      const userId = this.quizManger.addUser(data.roomId, data.name);

      socket.emit("userId", {
        userId,
        state: this.quizManger.getCurrentState(roomId),
      });
    });

    socket.on("submit", (data) => {
      const userId = data.userId;
      const problemId = data.problemId;
      const submission = data.submission;

      if (
        submission !== 0 ||
        submission !== 1 ||
        submission !== 2 ||
        submission !== 3
      ) {
        console.error("Not A Valid Response: ", submission);
      }
      // QuizManager.submit(data);
      this.quizManger.submit(userId, roomId, problemId, submission);
    });
  }
}
