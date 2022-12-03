import { Chess, SQUARES } from "chess.js";
import Chessground from "@react-chess/chessground";
import { Key } from "../chessground-primitives";
import { useEffect } from "react";
import aiMove from "../aiMove";

// these styles must be imported somewhere
import { useRecoilState } from "recoil";
import { checkAtom, destsAtom, fenAtom, levelAtom } from "../state";

const gameClient = new Chess();

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
  const boardLength = window.innerHeight - 50;

  const [fen, setFen] = useRecoilState(fenAtom);
  const [dests, setDests] = useRecoilState(destsAtom);
  const [check, setCheck] = useRecoilState(checkAtom);

  const [level, setLevel] = useRecoilState(levelAtom);

  const toColor = (gameClient: Chess) => {
    return gameClient.turn() === "w" ? "white" : "black";
  };

  const pieceMoved = (from: Key, to: Key, _: any) => {
    gameClient.move({ from, to });
    fetchDests(gameClient);

    // optimistically update fen here
    setFen(gameClient.fen());
    setCheck(gameClient.inCheck());
    setDests(fetchDests(gameClient));

    if (gameClient.turn()) {
      const makeAiMove = () =>
        aiMove(gameClient.fen(), level).then((move) => {
          const [[from, to]] = Object.entries(move);
          console.log(from, to);
          console.log(gameClient.move({ from: from.toLowerCase(), to: to.toLowerCase() }));

          setFen(gameClient.fen());
          setCheck(gameClient.inCheck());
          setDests(fetchDests(gameClient));
        });

      setTimeout(makeAiMove, 1000);
    }
  };

  useEffect(() => {
    // add event listener for change in realtime database here
    // on new doc, update fen
  }, []);

  const turnColor = toColor(gameClient);

  return (
    <section className="flex justify-center items-center px-10 flex-shrink-0">
      <Chessground
        config={{
          turnColor,
          check,
          events: {
            move: pieceMoved,
          },
          movable: {
            color: toColor(gameClient),
            free: false,
            showDests: true,
            dests,
          },
          fen,
        }}
        height={boardLength}
        width={boardLength}
      />
    </section>
  );
}
