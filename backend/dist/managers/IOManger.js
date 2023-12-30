"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IOManger = void 0;
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const server = http_1.default.createServer();
class IOManger {
    static getIO() {
        if (!this.instance) {
            this.instance = new IOManger();
            const io = new socket_io_1.Server(server);
            this.io = io;
        }
        return this.io;
    }
}
exports.IOManger = IOManger;
