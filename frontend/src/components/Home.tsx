import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="admin">Admin</Link>
          </li>
          <li>
            <Link to="/user">User</Link>
          </li>
        </ul>
      </nav>
      <div
        style={{
          minHeight: 500,
          borderWidth: 1,
          borderColor: "red",
          borderStyle: "solid",
          width: 500,
          //   placeItems: "center",
          textAlign: "center",
          padding: 50,
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
