import "./App.css";
import React, { useState } from "react";
import { ethers } from "ethers";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";

const greeterContractAddress = "0xaf5d64DD1e1056A627AD4F1b2b5a01afee0e67a8";

function App() {
  const [greeting, setGreetingValue] = useState("");

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
    <div className="w-screen h-screen bg-black text-violet-800 flex flex-col content-between">
      <div className="flex flex-col container border-solid border-2 border-red-500 gshadow-lg rounded my-14 w-2/5">
        <div className="text-grey-600 text-4xl py-6 px-2 mb-2 font-black">
          react ethereum dapp
        </div>
        <div className="text-lg px-2 font-semibold">
          INTERACT WITH GOERLI TESTNET
        </div>
      </div>
      {/* card  */}
      <div className="flex justify-center h-4/6 w-full border-solid border-2 border-red-50">
        <div className="border-solid border-2 border-red-500 w-4/5 ">
          <div className="flex flex-col content-between h-full border-solid border-2 border-red-50">
            <div className="flex flex-col items-center border-solid border-2 border-red-50">
              <button
                className="bg-indigo-700 w-1/5 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={fetchGreeting}
              >
                fetch
              </button>
              <div className="neon flex">{greeting}</div>
            </div>

            <form
              className="flex flex-col items-center"
              onSubmit={(event) => handleSubmit(event)}
            >
              <input
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-lg "
                name="greetingInput"
              />
              <button className="bg-purple-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                setGreeting
              </button>
            </form>
          </div>
          {/* <div>
                <div>
                  <input
                    className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-lg "
                    name="greetingInput"
                  />
                </div>
              </div>
              <div>

                <div id="button1">
                  <button
                    className="bg-indigo-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={fetchGreeting}
                  >
                    fetch
                  </button>
                </div>

                <div id="button2">
                  <button
                    className="bg-purple-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleSubmit}
                  >
                    update
                  </button>
                </div>
              </div> */}
        </div>
      </div>
    </div>

    /* <div className="w-full border-4 p-2 mb-4 rounded border-gray-400">
          <div className="text-gray-600 font-bold text-md mb-2 ">
            fetchGreeting - smart contract - testnest
          </div>
          <div className="flex">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={fetchGreeting}
            >
              fetchGreeting
            </button>
          </div>
        </div>
        <div className="w-full border-4 p-2 mb-4 rounded border-gray-400">
          <div className="text-gray-600 font-bold text-md mb-2">
            update greeting message on smart contract
          </div>
          <form
            className="flex items-center justofy-between"
            onSubmit={(event) => handleSubmit(event)}
          >
            <input
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-lg "
              name="greetingInput"
            />
            <button className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              setGreeting
            </button>
          </form>
        </div>
        <div className="w-full border-4 p-2 mb-4 rounded border-gray-400">
          <div className="text-gray-600 font-bold text-md mb-2">
            new greeting message
          </div>
          <p>{greeting}</p>
        </div>
      </div>
    </div> */
  );
}

export default App;
