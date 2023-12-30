import React, { useEffect, useState } from "react";

import { Socket, io } from "socket.io-client";
import { CreateProblem } from "./CreateProblem";
import QuizControls from "./QuizControls";

// const socket = io("http://localhost:4000");

export const Admin = () => {
  const [isConnected, setIsConnected] = useState(false);

  const [socket, setSocket] = useState<null | Socket>(null);
  const [roomId, setRoomId] = useState("");
  const [quizId, setQuizId] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:3000");
    setSocket(socket);

    socket.on("connect", () => {
      console.log(socket.id);
      setIsConnected(true);

      socket.emit("join_admin", {
        password: "adminPass",
      });
    });
  }, []);

  if (!quizId) {
    return (
      <div>
        <input
          type="text"
          onChange={(e) => {
            setRoomId(e.target.value);
          }}
        />
        <br />
        <br />
        <button
          onClick={() => {
            socket?.emit("create_quiz", {
              roomId,
            });

            setQuizId(roomId);
          }}
        >
          Create Quiz
        </button>
      </div>
    );
  }

  return (
    <div>
      <CreateProblem socket={socket} roomId={roomId} />
      <QuizControls socket={socket} roomId={roomId} />
    </div>
  );
};

export default Admin;
