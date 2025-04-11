import { useState } from "react";
import CoverPage from "./components/CoverPage";
import Journal from "./components/Journal"; // 👈 Make sure the file name matches exactly

export default function App() {
  const [entered, setEntered] = useState(false);

  return (
    <>
      {entered ? (
        <Journal /> // 👈 Now your real journal loads!
      ) : (
        <CoverPage onEnter={() => setEntered(true)} />
      )}
    </>
  );
}
