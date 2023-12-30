"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizManager = void 0;
const Quiz_1 = require("../Quiz");
const IOManger_1 = require("./IOManger");
let globalProblemId = 0;
class QuizManager {
    constructor() {
        this.quizes = [];
    }
    start(roomId) {
        const io = IOManger_1.IOManger.getIO();
        const quiz = this.getQuiz(roomId);
        quiz === null || quiz === void 0 ? void 0 : quiz.start();
        // io.to(roomId).emit({
        //   type: "START_ROOM",
        // });
    }
    next(roomId) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            return;
        }
        quiz.next();
        // IOManger.getIO().to(roomId).emit("next_problem");
    }
    // submit
    addUser(roomId, name) {
        var _a;
        return (_a = this.getQuiz(roomId)) === null || _a === void 0 ? void 0 : _a.addUser(name);
    }
    createQuiz(roomId) {
        let quiz = this.getQuiz(roomId);
        if (quiz) {
            return;
        }
        quiz = new Quiz_1.Quiz(roomId);
        this.quizes.push(quiz);
    }
    addProblemToQuiz(roomId, problem) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            return;
        }
        quiz.addProblem(Object.assign(Object.assign({}, problem), { startTime: new Date().getTime(), submissions: [], id: `${globalProblemId++}` }));
    }
    getQuiz(roomId) {
        var _a;
        return (_a = this.quizes.find((x) => x.roomId === roomId)) !== null && _a !== void 0 ? _a : null;
    }
    submit(userId, roomId, problemId, submission) {
        var _a;
        (_a = this.getQuiz(roomId)) === null || _a === void 0 ? void 0 : _a.submit(userId, roomId, problemId, submission);
    }
    getCurrentState(roomId) {
        const quiz = this.getQuiz(roomId);
        if (!quiz)
            return null;
        return quiz.getCurrentState();
    }
}
exports.QuizManager = QuizManager;
