import React, { useState } from "react";
import { Socket } from "socket.io-client";

export const CreateProblem = ({
  socket,
  roomId,
}: {
  socket: any;
  roomId: string;
}) => {
  const [title, setTitle] = useState("second");
  const [description, setDescription] = useState("second");
  const [options, setOptions] = useState([
    {
      id: 0,
      title: "",
    },
    {
      id: 1,
      title: "",
    },
    {
      id: 2,
      title: "",
    },
    {
      id: 3,
      title: "",
    },
  ]);
  const [ans, setAns] = useState(0);
  return (
    <div>
      <h2>Create Problem</h2>
      Title:{" "}
      <input
        type="text"
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <br />
      Description:{" "}
      <input
        type="text"
        onChange={(e) => {
          setDescription(e.target.value);
        }}
      />
      <br />
      {[0, 1, 2, 3].map((optionId) => {
        return (
          <div style={{ marginTop: 10 }}>
            <input
              type="radio"
              id={`opt_${optionId}`}
              name="options"
              value={optionId}
              //   checked={optionId === 0}
              onChange={() => {
                setAns(optionId);
              }}
            />
            option {optionId}:{" "}
            <input
              type="text"
              onChange={(e) => {
                //   setTitle(e.target.value);
                const _options = options.map((o) => {
                  if (o.id === optionId) {
                    return {
                      ...o,
                      title: e.target.value,
                    };
                  }
                  return o;
                });
                setOptions(_options);
              }}
            />
          </div>
        );
      })}
      <button
        onClick={() => {
          const problem = {
            title: title,
            description: description,
            // image: "",
            options: options,
            answer: ans,
          };
          socket?.emit("create_problem", {
            roomId,
            problem,
          });
        }}
      >
        Add problem
      </button>
      <br />
      {/* ============= <br /> Title: {JSON.stringify(title)} <br />
      Desc: {JSON.stringify(description)} <br />
      Options: {JSON.stringify(options, null, 2)} <br />
      Ans: {JSON.stringify(ans)} <br /> */}
    </div>
  );
};
