import "./App.css";
import React, { useState } from "react";
import { ethers } from "ethers";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";

const greeterContractAddress = "0xaf5d64DD1e1056A627AD4F1b2b5a01afee0e67a8  ";

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
    <div className="w-full max-w-lg container">
      <div className="shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-4 ">
        <div className="text-grey-600 font-bold text-lg mb-2">
          react ethereum dapp
        </div>
        <div className="w-full border-4 p-2 mb-4 rounded border-gray-400">
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
    </div>
  );
}

export default App;
