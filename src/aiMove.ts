import * as jsChessEngine from "js-chess-engine";

const { aiMove: chessEngineAiMove } = jsChessEngine;

export type PossibleGameLevel = 0 | 1 | 2 | 3;

export default function aiMove(fen: string, level: PossibleGameLevel): Promise<{ [key: string]: string }> {
  return new Promise((resolve, _) => {
    return resolve(chessEngineAiMove(fen, level));
  });
}
