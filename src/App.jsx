import { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import photo from "../src/assets/photo.png";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdClose } from "react-icons/md";
let alphabets = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
let playedAlphabets = [];

const notify = () => toast("This Alphabet has already been selected");

function App() {
  const intervalRef = useRef();
  const nameRef = useRef(null);
  const animalRef = useRef(null);
  const placeRef = useRef(null);
  const thingRef = useRef(null);

  const [selectedAlphabet, setSelectedAlphabet] = useState("choosen alphabet");
  const [totalScore, setTotalScore] = useState(0);
  const [timer, setTimer] = useState(15);
  const [nameTotal, setNameTotal] = useState(0);
  const [animalTotal, setAnimalTotal] = useState(0);
  const [placeTotal, setPlaceTotal] = useState(0);
  const [thingTotal, setThingTotal] = useState(0);
  const [disableInput, setDisableInput] = useState(false);
  const [selectButtonAble, setSelectButtonAble] = useState(false);
  const [nameData, setNameData] = useState("");
  const [animalData, setAnimalData] = useState("");
  const [placeData, setPlaceData] = useState("");
  const [thingData, setThingData] = useState("");
  const selectAlphabet = () => {
    setNameData('')
    setAnimalData('')
    setPlaceData('')
    setThingData('')
    let alphabetIndex = Math.floor(Math.random() * 26) + 1;
    if (!playedAlphabets.includes(alphabetIndex)) {
      playedAlphabets.push(alphabetIndex);
      setSelectedAlphabet(alphabets[alphabetIndex]);

      // Check if the intervalRef is a falsy value (undefined or null), if its is falsy returns true , therefore this code is going to run
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          setTimer((prevTimer) => {
            if (prevTimer === 0) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
              setSelectButtonAble(false)
              setDisableInput(true)
              return 15;
            } else {
              setSelectButtonAble(true);
              setDisableInput(false);
              return prevTimer - 1;
            }
          });
        }, 1000);
      }
      console.log(selectButtonAble);
    } else {
      notify();
      console.log("Alphabet already selected");
    }
  };

  const searchWord = async (word) => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          setNameData(false);
          throw new Error("404: Word not found");
        } else {
          setNameData(false);
          throw new Error("An unexpected error occurred");
        }
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const searchAnimal = async (animal) => {
    const url = "https://animals-by-api-ninjas.p.rapidapi.com/v1/animals";
    const params = { name: animal };
    const headers = {
      "X-RapidAPI-Key": "49fffaa6e0mshe0a533da68a5ff1p116b14jsn5cb6c79ed054",
      "X-RapidAPI-Host": "animals-by-api-ninjas.p.rapidapi.com",
    };

    try {
      const response = await fetch(url + "?name=" + params.name, { headers });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data.length);
      if (data.length === 0) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      return false;
    }
  };

  // Updated submitGame function
  const submitGame = async () => {
    let newTotalScore = 0;
    let isAnimalFound = await searchAnimal(animalRef.current.value);
    let isPlaceFound = await searchWord(placeRef.current.value);
    let isThingFound = await searchWord(thingRef.current.value);

    if (
      nameRef.current.value[0] &&
      nameRef.current.value[0].toUpperCase() ===
        selectedAlphabet.toUpperCase() &&
      nameRef.current.value.length > 2
    ) {
      setNameData(<IoIosCheckmarkCircleOutline className="text-green-700"/>);
      newTotalScore += 5;
    } else {
      setNameData(<MdClose className="text-red-700"/>);
      newTotalScore += 0;
    }

    if (
      animalRef.current.value[0] &&
      animalRef.current.value[0].toUpperCase() ===
        selectedAlphabet.toUpperCase() &&
      isAnimalFound == true
    ) {
      setAnimalData(<IoIosCheckmarkCircleOutline  className="text-green-700"/>);
      newTotalScore += 5;
    } else {
      setAnimalData(<MdClose className="text-red-700"/>);
      newTotalScore += 0;
    }
    if (
      placeRef.current.value[0] &&
      placeRef.current.value[0].toUpperCase() ===
        selectedAlphabet.toUpperCase() &&
      isPlaceFound === true
    ) {
      setPlaceData(<IoIosCheckmarkCircleOutline  className="text-green-700" />);
      newTotalScore += 5;
    } else {
      setPlaceData(<MdClose  className="text-red-700"/>);
      newTotalScore += 0;
    }
    if (
      thingRef.current.value[0] &&
      thingRef.current.value[0].toUpperCase() ===
        selectedAlphabet.toUpperCase() &&
      isThingFound === true
    ) {
      setThingData(<IoIosCheckmarkCircleOutline className="text-green-700"/>);
      newTotalScore += 5;
    } else {
      setThingData(<MdClose className="text-red-700" />);
      newTotalScore += 0;
    }

    setTotalScore((prevScore) => prevScore + newTotalScore);
    nameRef.current.value = "";
    animalRef.current.value = "";
    placeRef.current.value = "";
    thingRef.current.value = "";
    
  };

  return (
    <div className="px-24 py-10">
      <Toaster />

      <h1 className="text-5xl text-red font-semibold text-center">
        ALPHABET GAME!!!
      </h1>
      <p className="text-center py-10 text-5xl text-green-700">{totalScore}</p>
      <div className="">
        <img src={photo} alt="illustration" className="w-3/12 mx-auto"></img>
        <div>
          <p className="text-3xl">Timer</p>
          <p className="text-5xl pr-44 text-red-700 font-semibold rounded-full">
            {timer}
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center gap-5">
        <p className="text-3xl font-bold">{selectedAlphabet}</p>
        <button
          onClick={selectAlphabet}
          className="bg-black text-white p-3 hover:bg-gray-600 rounded-md"
          disabled={selectButtonAble}
        >
          Select an Alphabet
        </button>
      </div>

      <section className="grid-cols-2 grid lg:grid-cols-4 gap-5 lg:gap-0 py-10">
        <div>
          <input
            type="text"
            placeholder="Name"
            className="focus:outline-none border py-5 px-3"
            disabled={disableInput}
            ref={nameRef}
          ></input>
          <p>{nameData}</p>
        </div>
        <div>
          <input
            type="text"
            placeholder="Animal"
            className="focus:outline-none border py-5 px-3"
            disabled={disableInput}
            ref={animalRef}
          ></input>
          <p>{animalData}</p>
        </div>
        <div>
          <input
            type="text"
            placeholder="Place"
            className="focus:outline-none border py-5 px-3"
            disabled={disableInput}
            ref={placeRef}
          ></input>
          <p>{placeData}</p>
        </div>
        <div>
          <input
            type="text"
            placeholder="Thing"
            className="focus:outline-none border py-5 px-3"
            disabled={disableInput}
            ref={thingRef}
          ></input>
          <p>{thingData}</p>
        </div>
       
      </section>
      <button
          className="bg-black text-white rounded-md hover:bg-gray-600 flex justify-center items-center py-2 px-5"
          onClick={submitGame}
        >
          Submit
        </button>
      <div className="flex gap-5">
        {playedAlphabets.map((alphabet, index) => (
          <div key={index} >
            <p className="text-2xl font-semibold bg-red-700 text-white p-3 mt-5">{alphabets[alphabet]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
