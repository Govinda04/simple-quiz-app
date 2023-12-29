import { AllowedSubmission, Quiz } from "../Quiz";
import { IOManger } from "./IOManger";

export class QuizManager {
  private quizes: Quiz[];

  constructor() {
    this.quizes = [];
  }

  public start(roomId: string) {
    const io = IOManger.getIO();
    const quiz = this.getQuiz(roomId);

    quiz?.start();

    // io.to(roomId).emit({
    //   type: "START_ROOM",
    // });
  }

  // submit
  addUser(roomId: string, name: string) {
    return this.getQuiz(roomId)?.addUser(name);
  }

  getQuiz(roomId: string) {
    return this.quizes.find((x) => x.roomId === roomId) ?? null;
  }

  submit(
    userId: string,
    roomId: string,
    problemId: string,
    submission: AllowedSubmission
  ) {
    this.getQuiz(roomId)?.submit(userId, roomId, problemId, submission);
  }

  getCurrentState(roomId: string) {
    const quiz = this.getQuiz(roomId);

    if (!quiz) return null;

    return quiz.getCurrentState();
  }
}
