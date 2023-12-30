import React, { useEffect, useState } from "react";

import { io } from "socket.io-client";

// const socket = io("http://localhost:4000");

export const Admin = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("connect", () => {
      console.log(socket.id);
      setIsConnected(true);

      socket.emit("join_admin", {
        password: "adminPass",
      });
    });
  }, []);
  return <div>Admin</div>;
};

export default Admin;
