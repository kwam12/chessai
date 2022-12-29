import { Chess, Move, Square, SQUARES } from "chess.js";
import Chessground from "@react-chess/chessground";
import { Key } from "../chessground-primitives";
import { useEffect, useRef } from "react";
import aiMove from "../aiMove";

// these styles must be imported somewhere
import { useRecoilState, useRecoilValue } from "recoil";
import {
  checkAtom,
  checkmateAtom,
  destsAtom,
  fenAtom,
  levelAtom,
  otherUserAtom,
  playingAsAtom,
  playingAtom,
} from "../state";
import { socket } from "./ControlPanel";
import Swal from "sweetalert2";
import { User } from "@supabase/supabase-js";

export const gameClient = new Chess();

const fetchDests = (gameClient: Chess) => {
  const dests = new Map();

  SQUARES.forEach((s) => {
    const moves = gameClient.moves({ square: s, verbose: true });
    if (moves.length)
      dests.set(
        s,
        moves.map((m) => (typeof m === "string" ? m : m.to))
      );
  });

  return dests;
};

export default function Chessboard() {
  const boardMargin = 40;
  const boardLength = window.innerHeight - boardMargin;

  const otherUserRef = useRef<User | null>(null);
  const playingAsRef = useRef<"white" | "black" | null>(null);

  const [fen, setFen] = useRecoilState(fenAtom);
  const [dests, setDests] = useRecoilState(destsAtom);
  const [check, setCheck] = useRecoilState(checkAtom);
  const [playing, setPlayingState] = useRecoilState(playingAtom);

  const playingAs = useRecoilValue(playingAsAtom);
  const level = useRecoilValue(levelAtom);
  const otherUser = useRecoilValue(otherUserAtom);

  useEffect(() => {
    console.log(otherUser);
  }, [otherUser]);

  const [checkmate, setCheckmate] = useRecoilState(checkmateAtom); // signfies if the game is over

  otherUserRef.current = otherUser;
  playingAsRef.current = playingAs;

  const updateBoardState = (gameClient: Chess) => {
    setFen(gameClient.fen());
    setDests(fetchDests(gameClient));
    setCheck(gameClient.inCheck());
    setCheckmate(gameClient.isCheckmate());
    setDests(fetchDests(gameClient));

    if (gameClient.isCheckmate()) {
      const winner = gameClient.turn() === "w" ? "black" : "white";
      const message =
        winner === playingAsRef.current
          ? `You won against ${otherUserRef.current ? otherUserRef.current.user_metadata.full_name : "AI"}!`
          : `You lost against ${otherUserRef.current ? otherUserRef.current.user_metadata.full_name : "AI"}!`;

      Swal.fire({
        title: "Game Over!",
        text: message,
        showConfirmButton: false,
      });

      setPlayingState("standby");

      if (winner !== playingAsRef.current) socket.emit("gameover");
    }
  };

  const isPromotion = (moveFrom: Square, moveTo: Square) => {
    if (gameClient.get(moveFrom).type !== "p") return false;

    const [_, rank] = moveTo.split("");
    return rank === "8" || rank === "1";
  };

  const toColor = (gameClient: Chess) => {
    return gameClient.turn() === "w" ? "white" : "black";
  };

  const makeAiMove = () =>
    aiMove(gameClient.fen(), level).then((move) => {
      const [[from, to]] = Object.entries(move);
      console.log(from, to);
      if (isPromotion(from.toLowerCase() as Square, to.toLowerCase() as Square))
        gameClient.move({ from: from.toLowerCase(), to: to.toLowerCase(), promotion: "q" });
      else gameClient.move({ from: from.toLowerCase(), to: to.toLowerCase() });

      updateBoardState(gameClient);
    });

  const pieceMoved = (from: Key, to: Key, _: any) => {
    if (isPromotion(from as Square, to as Square)) gameClient.move({ from, to, promotion: "q" });
    else gameClient.move({ from, to });

    fetchDests(gameClient);

    // optimistically update fen here
    updateBoardState(gameClient);

    if (playing === "online") socket.emit("move", { from, to });
    else setTimeout(makeAiMove, 1000);
  };

  useEffect(() => {
    socket.on("move", ({ from, to }) => {
      if (isPromotion(from, to)) gameClient.move({ from, to, promotion: "q" });
      else gameClient.move({ from, to });

      updateBoardState(gameClient);
    });
  }, []);

  return (
    <section className="flex justify-center items-center flex-shrink-0">
      <Chessground
        config={{
          turnColor: toColor(gameClient),
          check,
          orientation: playingAs,
          premovable: {
            enabled: false,
          },
          events: {
            move: pieceMoved,
          },
          movable: {
            color: playingAs,
            free: false,
            showDests: true,
            dests: dests || fetchDests(gameClient),
          },
          fen,
        }}
        height={boardLength}
        width={boardLength}
      />
    </section>
  );
}
