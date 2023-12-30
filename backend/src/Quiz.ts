import { IOManger } from "./managers/IOManger";

interface User {
  id: string;
  name: string;
  points: number;
}

interface Submission {
  problemId: string;
  userId: string;
  isCorrect: boolean;
  optionSelected: AllowedSubmission;
}
export type AllowedSubmission = 0 | 1 | 2 | 3;

const PROBLEM_TIME_S = 20;
export interface Problem {
  id: string;
  title: string;
  description: string;
  image?: string;
  answer: AllowedSubmission; //0,1,2,3
  options: {
    id: number;
    title: string;
  }[];
  startTime: number;

  submissions: Submission[];
}

// enum CURR_STATE {
//   "leaderboard",
//   "question",
//   "not_started",
//   "ended",
// }

const CURR_STATE = {
  leaderboard: "leaderboard",
  question: "question",
  not_started: "not_started",
  ended: "ended",
};

export class Quiz {
  public roomId: string;
  private hasStarted: boolean;
  private activeProblem: number;
  private currentState: string;

  private problems: Problem[];
  private users: User[];

  constructor(roomId: string) {
    this.roomId = roomId;
    this.hasStarted = false;
    this.problems = [];
    this.activeProblem = 0;
    this.users = [];
    this.currentState = CURR_STATE.not_started;

    setInterval(() => {
      this.debug();
    }, 10000);
  }

  debug() {
    console.log("----debug---");
    console.log(this.roomId);
    console.log(JSON.stringify(this.problems));
    console.log(this.users);
    console.log(this.currentState);
    console.log(this.activeProblem);
  }

  addProblem(problem: Problem) {
    this.problems.push(problem);
    // console.log(this.problems);
  }

  start() {
    this.currentState = CURR_STATE.question;
    this.hasStarted = true;
    const io = IOManger.getIO();
    this.setActiveProblem(this.problems[0]);
    this.problems[this.activeProblem].startTime = new Date().getTime();

    // console.log(this.problems);
  }

  setActiveProblem(problem: Problem) {
    problem.startTime = new Date().getTime();
    problem.submissions = [];
    IOManger.getIO().emit("CHANGE_PROBLEM", { problem });
    setTimeout(() => {
      this.sendLeaderBoard();
    }, PROBLEM_TIME_S * 1000);
  }

  sendLeaderBoard() {
    this.currentState = CURR_STATE.leaderboard;
    const leaderboard = this.getLeaderboard();
    IOManger.getIO().to(this.roomId).emit("leaderboard", {
      leaderboard,
    });
  }

  next = () => {
    this.currentState = CURR_STATE.question;
    this.activeProblem++;
    const problem = this.problems[this.activeProblem];
    if (problem) {
      this.setActiveProblem(problem);
    } else {
      this.currentState = CURR_STATE.ended;
      // IOManger.getIO().emit("QUIZ_END", {});
    }

    console.log("---going to next prob");
    this.debug();
  };

  genRandonString(length: number) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()";
    var charLength = chars.length;
    var result = "";
    for (var i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
  }

  addUser(name: string) {
    const id = this.genRandonString(7);

    this.users.push({
      id: id,
      name: name,
      points: 0,
    });

    return id;
  }

  submit(
    userId: string,
    roomId: string,
    problemId: string,
    submission: AllowedSubmission
  ) {
    const problem = this.problems.find((i) => i.id === problemId);
    const user = this.users.find((u) => u.id === userId);

    if (!problem || !user) {
      return;
    }

    const existingSubmission = problem.submissions.find(
      (x) => x.userId === userId
    );
    if (existingSubmission) return;

    problem.submissions.push({
      problemId,
      userId,
      isCorrect: problem.answer === submission,
      optionSelected: submission,
    });

    user.points +=
      1000 -
      (500 * (new Date().getTime() - problem.startTime)) / PROBLEM_TIME_S;
  }

  getLeaderboard() {
    return this.users
      .sort((a, b) => (b.points > a.points ? -1 : 1))
      .splice(0, 20);
  }

  getCurrentState() {
    if (this.currentState === CURR_STATE.not_started) {
      return {
        type: CURR_STATE.not_started,
      };
    }

    if (this.currentState === CURR_STATE.ended) {
      return {
        type: CURR_STATE.ended,
        leaderboard: this.getLeaderboard(),
      };
    }
    if (this.currentState === CURR_STATE.leaderboard) {
      return {
        type: CURR_STATE.leaderboard,
        leaderboard: this.getLeaderboard(),
      };
    }
    if (this.currentState === CURR_STATE.question) {
      return {
        type: CURR_STATE.question,
        problem: this.problems[this.activeProblem],
      };
    }
  }
}
