import http from "http";
import { Server } from "socket.io";

const server = http.createServer();

export class IOManger {
  private static io: Server;
  private static instance: IOManger;

  public static getIO() {
    if (!this.instance) {
      this.instance = new IOManger();
      const io = new Server(server);
      this.io = io;
    }

    return this.io;
  }
}
