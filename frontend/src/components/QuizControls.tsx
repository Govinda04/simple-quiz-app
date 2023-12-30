import React from "react";
// import { Socket } from "socket.io-client";

const QuizControls = ({ socket, roomId }: { socket: any; roomId: string }) => {
  return (
    <div>
      <button
        onClick={() => {
          socket?.emit("next_problem", {
            roomId,
          });
        }}
      >
        Go to next Problem
      </button>
    </div>
  );
};

export default QuizControls;
