"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseManager = void 0;
const QuizManager_1 = require("./QuizManager");
const ADMIN_PASSWORD = "adminPass";
class UseManager {
    constructor() {
        this.users = [];
        this.quizManger = new QuizManager_1.QuizManager();
    }
    addUser(roomId, socket) {
        this.users.push({
            roomId,
            socket,
        });
        this.createHandlers(roomId, socket);
    }
    createHandlers(roomId, socket) {
        socket.on("join", (data) => {
            const userId = this.quizManger.addUser(data.roomId, data.name);
            socket.emit("userId", {
                userId,
                state: this.quizManger.getCurrentState(roomId),
            });
        });
        socket.on("join_admin", (data) => {
            const userId = this.quizManger.addUser(data.roomId, data.name);
            if (data.password !== ADMIN_PASSWORD) {
                return;
            }
            socket.emit("adminInit", {
                userId,
                state: this.quizManger.getCurrentState(roomId),
            });
            socket.on("createQuiz", (data) => {
                this.quizManger.createQuiz(data.roomId);
            });
            socket.on("startQuiz", (data) => {
                this.quizManger.start(data.roomId);
            });
            socket.on("createProblem", (data) => {
                this.quizManger.addProblemToQuiz(data.roomId, data.problem);
            });
            socket.on("next", (data) => {
                this.quizManger.next(data.roomId);
            });
        });
        socket.on("submit", (data) => {
            const userId = data.userId;
            const problemId = data.problemId;
            const submission = data.submission;
            if (submission !== 0 ||
                submission !== 1 ||
                submission !== 2 ||
                submission !== 3) {
                console.error("Not A Valid Response: ", submission);
            }
            // QuizManager.submit(data);
            this.quizManger.submit(userId, roomId, problemId, submission);
        });
    }
}
exports.UseManager = UseManager;
