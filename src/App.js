// import "./App.css";
import React, { useState } from "react";
import { ethers } from "ethers";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";

const greeterContractAddress = "0xaf5d64DD1e1056A627AD4F1b2b5a01afee0e67a8";

function App() {
  const [greeting, setGreetingValue] = useState("");
  const [motion, setMotion] = useState();

  async function fetchGreeting() {
    // checking for metamask
    if (typeof window.ethereum !== "undefined") {
      // initiating a way to connect to blockchain using  provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // create an instance of contract
      const contract = new ethers.Contract(
        greeterContractAddress,
        Greeter.abi,
        provider
      );
      setMotion(!motion);

      try {
        // wait for contract + pass data from blckchain
        // greet is a function frm contract
        const data = await contract.greet();
        // update useStat
        setGreetingValue(data);
        console.log("data: ", data);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  async function setGreeting(value) {
    if (!value) return;
    if (!typeof window.ethereum !== "undefinded") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        greeterContractAddress,
        Greeter.abi,
        signer
      );
      //set new greeting
      const transaction = await contract.setGreeting(value);
      // execute transaction
      await transaction.wait();
      fetchGreeting();
    }
  }

  async function requestAccount() {
    // using metamask request function on window's ethereum object
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function handleSubmit(event) {
    // prevent default submit
    event.preventDefault();
    // targeting input data + directing it to blockchain
    await setGreeting(event.target.greetingInput.value);
    // updating component state w added input values from blockchain data
    setGreetingValue(event.target.greetingInput.value);
    // reset form input field
    event.target.greetingInput.value = "";
  }

  return (
    <div className="background">
      {/* <div className="background w-screen h-screen min-h-fit text-violet-800 flex flex-col content-between"> */}
      <div className="flex flex-col border-solid border-2 border-black gshadow-lg rounded-lg  bg-slate-900/90 lg:w-3/5 md:w-4/5 sm:w-5/5 text-xs">
        {/* <div className="flex flex-col border-solid border-2 border-red-500 gshadow-lg rounded w-5/5  sm:w-3/5"> */}
        <div className="text-grey-600 text-4xl py-3 px-2 mb-2">
          react ethereum dapp
        </div>
        <div className="text-lg px-2 font-semibold mb-3">
          INTERACT WITH GOERLI TESTNET
        </div>
      </div>
      {/* card  */}
      <div className="flex justify-center min-h-fit  w-full  my-20">
        <div className="flex flex-col space-y-8  my-auto   content-center  border-solid border-2 border-black rounded-lg bg-slate-900/90 h-4/6 w-4/5 ">
          <div className="flex flex-col space-y-1  items-center">
            <button
              className="bg-indigo-500 my-6 rounded-full w-1/9 animate-bounce  hover:bg-blue-700 focus:animate-none text-white font-bold py-2 px-4"
              onClick={fetchGreeting}
            >
              <p className="button-font">fetch</p>
              <p>blockchain</p>
              <p>data</p>
            </button>
            <div className="neon flex border-solid border-2 border-black overflow-scroll bg-black/95 rounded-lg max-w-[80%] max-h-40 text-center ">
              {greeting}
            </div>
          </div>

          <form
            className="flex flex-col pb-6 space-y-7 items-center min-h-fit h-1/7 "
            onSubmit={(event) => handleSubmit(event)}
          >
            <input
              className="shadow appearance-none border rounded-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-lg "
              name="greetingInput"
            />
            <button className="rounded-full  bg-purple-700 hover:bg-blue-700 text-white font-bold py-2 px-4">
              setGreeting
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
