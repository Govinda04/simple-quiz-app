import { Quiz } from "../Quiz";
import { IOManger } from "./IOManger";

export class QuizManager {
  private quizes: Quiz[];

  constructor() {
    this.quizes = [];
  }

  public start(roomId: string) {
    const io = IOManger.getIO();
    const quiz = this.quizes.find((x) => x.roomId === roomId);

    quiz?.start();

    io.to(roomId).emit({
      type: "START_ROOM",
    });
  }
}
