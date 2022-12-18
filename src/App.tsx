import Chessboard from "./components/Chessboard";
import ControlPanel from "./components/ControlPanel";

export default function App() {
  return (
    <section className="flex h-screen bg-black text-white">
      <Chessboard />

      <ControlPanel />
    </section>
  );
}
