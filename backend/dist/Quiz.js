"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quiz = void 0;
const IOManger_1 = require("./managers/IOManger");
const PROBLEM_TIME_S = 20;
var CURR_STATE;
(function (CURR_STATE) {
    CURR_STATE[CURR_STATE["leaderboard"] = 0] = "leaderboard";
    CURR_STATE[CURR_STATE["question"] = 1] = "question";
    CURR_STATE[CURR_STATE["not_started"] = 2] = "not_started";
    CURR_STATE[CURR_STATE["ended"] = 3] = "ended";
})(CURR_STATE || (CURR_STATE = {}));
class Quiz {
    constructor(roomId) {
        this.roomId = roomId;
        this.hasStarted = false;
        this.problems = [];
        this.activeProblems = 0;
        this.users = [];
        this.currentState = CURR_STATE.not_started;
    }
    addProblem(problem) {
        this.problems.push(problem);
        console.log(this.problems);
    }
    start() {
        this.hasStarted = true;
        const io = IOManger_1.IOManger.getIO();
        this.setActiveProblem(this.problems[0]);
        this.problems[this.activeProblems].startTime = new Date().getTime();
        console.log(this.problems);
    }
    setActiveProblem(problem) {
        problem.startTime = new Date().getTime();
        problem.submissions = [];
        IOManger_1.IOManger.getIO().emit("CHANGE_PROBLEM", { problem });
        setTimeout(() => {
            this.semdLeaderBoard();
        }, PROBLEM_TIME_S * 1000);
    }
    semdLeaderBoard() {
        const leaderboard = this.getLeaderboard();
        IOManger_1.IOManger.getIO().to(this.roomId).emit("leaderboard", {
            leaderboard,
        });
    }
    next() {
        this.activeProblems++;
        const problem = this.problems[this.activeProblems];
        if (problem) {
            this.setActiveProblem(problem);
        }
        else {
            // IOManger.getIO().emit("QUIZ_END", {});
        }
    }
    genRandonString(length) {
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()";
        var charLength = chars.length;
        var result = "";
        for (var i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * charLength));
        }
        return result;
    }
    addUser(name) {
        const id = this.genRandonString(7);
        this.users.push({
            id: id,
            name: name,
            points: 0,
        });
        return id;
    }
    submit(userId, roomId, problemId, submission) {
        const problem = this.problems.find((i) => i.id === problemId);
        const user = this.users.find((u) => u.id === userId);
        if (!problem || !user) {
            return;
        }
        const existingSubmission = problem.submissions.find((x) => x.userId === userId);
        if (existingSubmission)
            return;
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
                problem: this.problems[this.activeProblems],
            };
        }
    }
}
exports.Quiz = Quiz;
