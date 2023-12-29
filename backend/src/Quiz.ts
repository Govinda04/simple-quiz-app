import { IOManger } from "./managers/IOManger";

interface Problem {
  title: string;
  description: string;
  image: string;
  answer: string; //0,1,2,3
  option: {
    id: number;
    title: string;
  };
}

export class Quiz {
  public roomId: string;
  private hasStarted: boolean;
  private activeProblems: number;

  private problems: Problem[];

  constructor(roomId: string) {
    this.roomId = roomId;
    this.hasStarted = false;
    this.problems = [];
    this.activeProblems = 0;
  }

  addProblem(problem: Problem) {
    this.problems.push(problem);
  }

  start() {
    this.hasStarted = true;
    const io = IOManger.getIO();
    io.emit("CHANGE_PROBLEM", {
      problem: this.problems[0],
    });
  }

  next() {
    this.activeProblems++;
    const problem = this.problems[this.activeProblems];
    const io = IOManger.getIO();
    if (problem) {
      io.emit("CHANGE_PROBLEM", { problem });
    } else {
      io.emit("QUIZ_END", {});
    }
  }
}
