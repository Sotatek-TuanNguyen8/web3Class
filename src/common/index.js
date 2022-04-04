import Web3 from "web3";
import WETH from "../abi/WETH.json";
import { address } from "./address";

export const approve = async (library, account, amount) => {
  const web3 = new Web3(library.provider);
  const wethContract = new web3.eth.Contract(WETH, address.WETH);
  try {
    return await wethContract.methods
      .approve(address.MASTERCHEF, web3.utils.toWei(amount))
      .send({ from: account });
  } catch (error) {
    console.log(error);
  }
};

export const deposit = async (library, account, amount) => {
  const web3 = new Web3(library.provider);
  const wethContract = new web3.eth.Contract(WETH, address.WETH);
  try {
    return await wethContract.methods
      .deposit()
      .send({ from: account, value: web3.utils.toWei(amount.toString()) });
  } catch (error) {
    console.log(error);
  }
};

export const withdraw = async (library, account, amount) => {
  const web3 = new Web3(library.provider);
  const wethContract = new web3.eth.Contract(WETH, address.WETH);
  try {
    return await wethContract.methods
      .withdraw(web3.utils.toWei(amount))
      .send({ from: account });
  } catch (error) {}
};

export const convertTimestamp = (timestamp) => {
  let date = new Date(parseInt(timestamp) * 1000);
  return date;
};
