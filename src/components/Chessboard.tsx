import { Chess, Move, SQUARES } from "chess.js";
import Chessground from "@react-chess/chessground";
import { Key } from "../chessground-primitives";
import { useEffect } from "react";
import aiMove from "../aiMove";

// these styles must be imported somewhere
import { useRecoilState, useRecoilValue } from "recoil";
import {
  checkAtom,
  checkmateAtom,
  destsAtom,
  fenAtom,
  levelAtom,
  playingAsAtom,
  playingAtom,
} from "../state";
import { socket } from "./ControlPanel";

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

  const [fen, setFen] = useRecoilState(fenAtom);
  const [dests, setDests] = useRecoilState(destsAtom);
  const [check, setCheck] = useRecoilState(checkAtom);

  const playing = useRecoilValue(playingAtom);
  const playingAs = useRecoilValue(playingAsAtom);
  const level = useRecoilValue(levelAtom);

  const [checkmate, setCheckmate] = useRecoilState(checkmateAtom); // signfies if the game is over

  const updateBoardState = (gameClient: Chess) => {
    setFen(gameClient.fen());
    setDests(fetchDests(gameClient));
    setCheck(gameClient.inCheck());
    setCheckmate(gameClient.isCheckmate());
    setDests(fetchDests(gameClient));
  };

  const toColor = (gameClient: Chess) => {
    return gameClient.turn() === "w" ? "white" : "black";
  };

  const makeAiMove = () =>
    aiMove(gameClient.fen(), level).then((move) => {
      const [[from, to]] = Object.entries(move);
      console.log(from, to);
      console.log(gameClient.move({ from: from.toLowerCase(), to: to.toLowerCase() }));

      updateBoardState(gameClient);
    });

  const pieceMoved = (from: Key, to: Key, _: any) => {
    gameClient.move({ from, to });
    fetchDests(gameClient);

    // optimistically update fen here
    updateBoardState(gameClient);

    if (playing === "online") socket.emit("move", { from, to });
    else setTimeout(makeAiMove, 1000);
  };

  useEffect(() => {
    socket.on("move", ({ from, to }) => {
      gameClient.move({ from, to });

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
