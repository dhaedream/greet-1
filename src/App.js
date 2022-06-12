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

  return <div className=""></div>;
}

export default App;
