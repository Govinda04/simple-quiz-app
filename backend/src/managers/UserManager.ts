//  join, get current state, submit
import { Socket } from "socket.io";
import { QuizManager } from "./QuizManager";

const ADMIN_PASSWORD = "adminPass";

export class UserManager {
  // private users: {
  //   roomId: string;
  //   socket: Socket;
  // }[];

  private quizManger: QuizManager;

  constructor() {
    // this.users = [];
    this.quizManger = new QuizManager();
  }

  addUser(socket: Socket) {
    // this.users.push({
    //   roomId,
    //   socket,
    // });

    this.createHandlers(socket);
  }

  private createHandlers(socket: Socket) {
    socket.on("join", (data) => {
      const userId = this.quizManger.addUser(data.roomId, data.name);

      socket.emit("userId", {
        userId,
        state: this.quizManger.getCurrentState(data.roomId),
      });
    });

    socket.on("join_admin", (data) => {
      console.log("admin joined : ", data);
      if (data.password !== ADMIN_PASSWORD) {
        return;
      }

      socket.on("create_quiz", (data) => {
        this.quizManger.createQuiz(data.roomId);
      });

      socket.on("start_quiz", (data) => {
        this.quizManger.start(data.roomId);
      });

      socket.on("create_problem", (data) => {
        this.quizManger.addProblemToQuiz(data.roomId, data.problem);
      });

      socket.on("next_problem", (data) => {
        console.log("next_problem: ", data);
        this.quizManger.next(data.roomId);
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
      this.quizManger.submit(userId, data.roomId, problemId, submission);
    });
  }
}
