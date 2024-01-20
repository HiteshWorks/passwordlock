import { useEffect, useRef, useState } from "react";
import { MdRestartAlt } from "react-icons/md";
import { GoUnmute } from "react-icons/go";
import { RiVolumeMuteFill } from "react-icons/ri";
import ConfettiExplosion from "react-confetti-explosion";

function App() {
  const array = ["X", "O"];
  const [fillup, setFillUp] = useState(Array(9).fill(""));
  const [arrayIndex, setArrayIndex] = useState(0);
  const [result, setResult] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const clickAudio = useRef<HTMLAudioElement>(null);
  const [Xwon, setXwon] = useState(0);
  const [Owon, setOwon] = useState(0);
  const [Tie, setTie] = useState(0);
  const [Xgo, setXgo] = useState(true);

  useEffect(() => {
    if (result === "X Wins") {
      setXwon((prevXwon) => prevXwon + 1);
    } else if (result === "O Wins") {
      setOwon((prevOwon) => prevOwon + 1);
    } else if (result === "It's a Tie!") {
      setTie((prevTie) => prevTie + 1);
    }
  }, [result]);

  function handlerestart() {
    setFillUp(Array(9).fill(""));
    setArrayIndex(0);
    setResult("");
    setXgo(true);
  }

  function WhosGo() {
    if (fillup.every((value) => value === "")) {
      if (Xgo) {
        setArrayIndex(1);
      } else {
        setArrayIndex(0);
      }
      setXgo((prevXgo) => !prevXgo);
    }
  }

  useEffect(() => {
    const isBoardFull = fillup.every((value) => value !== "");

    if (
      (fillup[0] === fillup[1] &&
        fillup[1] === fillup[2] &&
        fillup[0] !== "") ||
      (fillup[3] === fillup[4] &&
        fillup[4] === fillup[5] &&
        fillup[3] !== "") ||
      (fillup[6] === fillup[7] &&
        fillup[7] === fillup[8] &&
        fillup[6] !== "") ||
      (fillup[0] === fillup[3] &&
        fillup[3] === fillup[6] &&
        fillup[0] !== "") ||
      (fillup[1] === fillup[4] &&
        fillup[4] === fillup[7] &&
        fillup[1] !== "") ||
      (fillup[2] === fillup[5] &&
        fillup[5] === fillup[8] &&
        fillup[2] !== "") ||
      (fillup[0] === fillup[4] &&
        fillup[4] === fillup[8] &&
        fillup[0] !== "") ||
      (fillup[2] === fillup[4] && fillup[4] === fillup[6] && fillup[2] !== "")
    ) {
      setResult(`${array[(arrayIndex - 1) % 2]} Wins`);
    } else if (isBoardFull) {
      setResult("It's a Tie!");
    }
  }, [fillup, array, arrayIndex, setResult]);

  function handleClick(index: number) {
    if (result || fillup[index] !== "") {
      return;
    }

    const newFillUp = [...fillup];
    newFillUp[index] = array[arrayIndex % 2 === 0 ? 0 : 1];
    setFillUp(newFillUp);
    setArrayIndex((prev) => prev + 1);

    if (!isMuted) {
      clickAudio.current?.play();
    }
  }

  return (
    <>
      <div className="flex justify-center">
        {result !== "It's a Tie!" && result !== "" ? <ConfettiExplosion /> : ``}
      </div>
      <div className="container h-screen w-full flex justify-center bg-[url('/images/bg.jpg')] bg-cover bg-center">
        <div className="flex-col gap-2 h-48  ">
          <div
            className={`heading text-9xl text-stone-800   shadow-sm shadow-pink-200 left-96 absolute top-0`}
          >
            Tic Tac Toe
          </div>
          <div className="board cursor-pointer  h-96 w-96  mt-40    grid grid-cols-3">
            {fillup.map((value, index) => (
              <div
                key={index}
                onClick={() => handleClick(index)}
                className={`squares  h-32 w-32 ${
                  value === "X" ? `text-red-500` : `text-sky-400`
                } text-8xl flex justify-center items-center rounded-lg`}
                style={{
                  borderTop: index < 3 ? "none" : "5px solid yellow ",
                  borderBottom: index >= 6 ? "none" : "5px solid yellow",
                  borderLeft: index % 3 === 0 ? "none" : "5px solid yellow",
                  borderRight: index % 3 === 2 ? "none" : "5px solid yellow",
                  backgroundColor: "transparent",
                }}
              >
                {value}
              </div>
            ))}
          </div>

          <div
            style={{
              opacity: result ? 1 : 0,
              transition: "opacity 1s ease-in-out",
            }}
            className="text-4xl absolute top-[70%] flex justify-center mt-14  bg-white shadow-xl shadow-gray-500 rounded-lg px-28 text-green-600 mx-8 font-semibold"
          >
            {result}
          </div>

          <div className="navbar absolute top-[80%] mx-[-5%] mt-12 bg-black flex gap-44 text-4xl border-4 border-yellow-300 shadow-lg shadow-gray-400 rounded-full">
            <div
              title="restart"
              onClick={handlerestart}
              className="cursor-pointer text-white shadow-md shadow-yellow-200"
            >
              <MdRestartAlt />
            </div>
            <div
              onClick={WhosGo}
              className={`whogo text-4xl cursor-pointer  ${
                arrayIndex % 2 === 0
                  ? `text-red-400`
                  : result
                  ? `text-pink-300`
                  : `text-sky-500`
              }`}
            >
              {result
                ? `Awesome!`
                : arrayIndex % 2 === 0
                ? `X's go `
                : `O's go `}
            </div>
            <div
              title={isMuted ? `Unmute` : `Mute`}
              onClick={() => setIsMuted(!isMuted)}
              className="text-white mr-1 cursor-pointer "
            >
              {isMuted ? <RiVolumeMuteFill /> : <GoUnmute />}
            </div>
            <audio ref={clickAudio} src="/sounds/click.mp3"></audio>
          </div>
        </div>
        <div className="flex justify-between absolute mt-5 gap-[40rem] p-1  top-[90%] ">
          <div className=" text-4xl bg-white rounded-lg text-red-500  ">
            X:{Xwon}
          </div>
          <div className="text-4xl text-gray-400 rounded-lg bg-white ">
            Tie:{Tie}
          </div>
          <div className=" text-4xl text-sky-500 rounded-lg bg-white">
            O:{Owon}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
