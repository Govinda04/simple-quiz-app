import { AllowedSubmission, Problem, Quiz } from "../Quiz";
import { IOManger } from "./IOManger";

let globalProblemId = 0;

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

  public next(roomId: string) {
    const quiz = this.getQuiz(roomId);
    if (!quiz) {
      return;
    }
    quiz.next();
  }

  // submit
  addUser(roomId: string, name: string) {
    return this.getQuiz(roomId)?.addUser(name);
  }

  public createQuiz(roomId: string) {
    let quiz = this.getQuiz(roomId);
    if (quiz) {
      return;
    }
    quiz = new Quiz(roomId);
    this.quizes.push(quiz);
  }

  public addProblemToQuiz(
    roomId: string,
    problem: {
      title: string;
      description: string;
      image?: string;
      options: {
        id: number;
        title: string;
      }[];
      answer: AllowedSubmission;
    }
  ) {
    const quiz = this.getQuiz(roomId);
    if (!quiz) {
      return;
    }

    quiz.addProblem({
      ...problem,
      startTime: new Date().getTime(),
      submissions: [],
      id: `${globalProblemId++}`,
    });
    console.log("problem added");
    // console.log("quiz; ", JSON.stringify(quiz, null, 2));
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
