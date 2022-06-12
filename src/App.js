import "./App.css";
import React, { useState } from "react";
import { ethers } from "ethers";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";

const greeterContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

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
        // deploy + wait for contract
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
    await window.ethereum.request({ method: "eth_requestAccounts " });
  }

  return (
    <div className="">
      <div className="shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-4 ">
        <div className="text-grey-600 font-bold text-lg mb-2">
          react ethereum dapp
        </div>
      </div>
    </div>
  );
}

export default App;
