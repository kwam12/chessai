import { useRecoilState } from "recoil";
import { PossibleGameLevel } from "../aiMove";
import { levelAtom } from "../state";

export default function ControlPanel() {
  const [level, setLevel] = useRecoilState(levelAtom);

  return (
    <section className="w-full flex flex-col items-center border-4">
      <p>Computer Difficulty Level</p>
      <select onChange={(e) => setLevel(parseInt(e.target.value) as PossibleGameLevel)}>
        <option value="0">Well-trained Monkey</option>
        <option value="1">Beginner</option>
        <option value="2">Intermediate</option>
        <option value="3">Advanced</option>
        {/* <option value="4">Experienced</option> */}
      </select>
    </section>
  );
}
