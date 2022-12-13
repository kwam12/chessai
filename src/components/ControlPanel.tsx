import { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { io } from "socket.io-client";
import { v4 as uuid } from "uuid";
import { PossibleGameLevel } from "../aiMove";
import { BASE_URL } from "../config";
import { fenAtom, levelAtom, playingAsAtom, playingAtom } from "../state";
import { StartGameData } from "../utils.types";
import { gameClient } from "./Chessboard";

export const socket = io(BASE_URL);

export default function ControlPanel() {
  const [_, setLevel] = useRecoilState(levelAtom);

  const [playing, setPlayingState] = useRecoilState(playingAtom);
  const setFen = useSetRecoilState(fenAtom);
  const setPlayingAs = useSetRecoilState(playingAsAtom);

  const playOnline = async () => {
    setPlayingState("searching");

    socket.emit("play");

    socket.on("created_room", (roomId: string) => {
      console.log("CREATED ROOM", roomId, "NOW LOOKING FOR A PLAYER");
    });

    socket.on("joined_room_start_game", ({ roomId, members }: StartGameData) => {
      window.history.pushState({}, "", `/${roomId}`);
      gameClient.reset();

      setFen(gameClient.fen());
      setPlayingState("online");
      setPlayingAs(members.find((member) => member.id === socket.id)?.isWhite ? "white" : "black");

      console.log("JOINED ROOM", roomId, "STARTING GAME", members);
    });
  };

  useEffect(() => {
    // socket.on("rooms", (rooms: string[]) => {
    //   console.log("rooms", rooms);
    //   if (rooms.length === 0) {
    //     socket.emit("create", uuid());
    //   } else {
    //     socket.emit("join", rooms[0]);
    //   }
    // });
  }, []);

  return (
    <section className="w-full flex flex-col items-center border-4">
      <p>Computer Difficulty Level</p>
      <select className="mb-5" onChange={(e) => setLevel(parseInt(e.target.value) as PossibleGameLevel)}>
        <option value="0">Well-trained Monkey</option>
        <option value="1">Beginner</option>
        <option value="2">Intermediate</option>
        <option value="3">Advanced</option>
        {/* <option value="4">Experienced</option> */}
      </select>

      {playing !== "online" && (
        <button disabled={playing === "searching"} onClick={playOnline} className="mb-5">
          {playing === "ai" ? "Play Online" : "Please wait, searching for players"}
        </button>
      )}

      <button className="mb-5">Resign</button>
    </section>
  );
}
