import { User } from "@supabase/supabase-js";
import { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { io } from "socket.io-client";
import { v4 as uuid } from "uuid";
import { PossibleGameLevel } from "../aiMove";
import { BASE_URL } from "../config";
import { fenAtom, levelAtom, otherUserAtom, playingAsAtom, playingAtom, userAtom } from "../state";
import supabase from "../supabase";
import { StartGameData } from "../utils.types";
import { gameClient } from "./Chessboard";

export const socket = io(BASE_URL);

export default function ControlPanel() {
  const [level, setLevel] = useRecoilState(levelAtom);

  const [playing, setPlayingState] = useRecoilState(playingAtom);
  const [user, setUser] = useRecoilState(userAtom);
  const [otherUser, setOtherUser] = useRecoilState(otherUserAtom);

  const setFen = useSetRecoilState(fenAtom);
  const setPlayingAs = useSetRecoilState(playingAsAtom);

  const signInWithGoogle = async () => {
    // use supabase for signin
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: "google" });

    if (error) {
      console.log(error);
    }

    if (data) {
      console.log("DATA", data);
    }
  };

  const playOnline = async () => {
    if (!user) return;

    setPlayingState("searching");

    socket.emit("play", { avatar_url: user.user_metadata.avatar_url, name: user.user_metadata.full_name });

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

      // share profile data with other player
      socket.emit("share_profile", user);
    });

    socket.on("share_profile", ({ id, data }: { id: string; data: User }) => {
      if (id !== socket.id) setOtherUser(data);
    });

    socket.on("player_resigned", (playerId: string) => {
      setPlayingState("standby");
    });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data) {
        setUser(data.session?.user || null);
      }
    });

    supabase.auth.onAuthStateChange(async (_, session) => {
      if (session) setUser(session.user);
    });
  }, []);

  return (
    <section className="w-full flex flex-col justify-between border border-gray-500">
      {user && (
        <section className="flex items-center justify-between p-3">
          <div className="flex items-center">
            <img className="h-12 mr-3" src={user.user_metadata.avatar_url} alt="" />

            <p className="">
              <span>Logged in as:</span> <br />
              <span className="font-bold">{user.user_metadata.full_name}</span>
            </p>
          </div>

          {otherUser && (
            <div className="flex items-center">
              <p className="text-right">
                <span>Opponent:</span> <br />
                <span className="font-bold">{otherUser.user_metadata.full_name}</span>
              </p>

              <img className="h-12 ml-3" src={otherUser.user_metadata.avatar_url} alt="" />
            </div>
          )}
        </section>
      )}

      {(playing === "ai" || playing === "searching") && (
        <section className="py-10">
          <p className="text-3xl text-center font-bold mb-5">Play With AI</p>

          <section className="px-10">
            <button
              className={`${
                level === 0 ? "filled" : "outlined"
              } w-full rounded text-lg py-3 mb-3 outline-none`}
              onClick={() => setLevel(0)}
            >
              Well Trained Monkey
            </button>

            <button
              className={`${
                level === 1 ? "filled" : "outlined"
              } w-full rounded text-lg py-3 mb-3 outline-none`}
              onClick={() => setLevel(1)}
            >
              Beginner
            </button>

            <button
              className={`${
                level === 2 ? "filled" : "outlined"
              } w-full rounded text-lg py-3 mb-3 outline-none`}
              onClick={() => setLevel(2)}
            >
              Intermediate
            </button>

            <button
              className={`${
                level === 3 ? "filled" : "outlined"
              } w-full rounded text-lg py-3 mb-3 outline-none`}
              onClick={() => setLevel(3)}
            >
              Advanced
            </button>
          </section>
        </section>
      )}

      {playing === "standby" && (
        <p className="text-gray-500 text-center text-3xl font-bold">Opponent Resigned</p>
      )}

      <section>
        {!user && (
          <button className="outlined w-full py-5" onClick={signInWithGoogle}>
            SIGN IN VIA GOOGLE TO PLAY ONLINE
          </button>
        )}

        {(playing === "ai" || playing === "searching") && user && (
          <button
            disabled={playing === "searching"}
            onClick={playOnline}
            className="filled-green w-full py-5"
          >
            {playing === "ai" ? "PLAY ONLINE" : "Please wait, searching for players"}
          </button>
        )}

        {playing === "online" && (
          <button className="filled-red w-full py-5" onClick={() => (window.location.href = "/")}>
            RESIGN
          </button>
        )}

        {playing === "standby" && (
          <button className="filled w-full py-5" onClick={() => (window.location.href = "/")}>
            BACK TO HOME
          </button>
        )}
      </section>
    </section>
  );
}
