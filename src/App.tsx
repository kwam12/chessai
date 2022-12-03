import Chessboard from "./components/Chessboard";
import ControlPanel from "./components/ControlPanel";

export default function App() {
  return (
    <section className="flex h-screen">
      <Chessboard />

      <ControlPanel />
    </section>
  );
}
