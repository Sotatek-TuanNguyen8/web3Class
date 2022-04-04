import { Multicall } from "ethereum-multicall";
import { ethers } from "ethers";
import Web3 from "web3";
import WETH from "../abi/WETH.json";
import DD2 from "../abi/DD2.json";
import MASTER_CHEF from "../abi/MasterChef.json";
import { address } from "./address";

const formatData = (data) => {
  return Object.keys(data).reduce((item, key, index) => {
    item[key] = ethers.utils
      .formatEther(
        Object.values(data)[index].callsReturnContext[0].returnValues[0].hex
      )
      .toString();
    return item;
  }, {});
};

export const getData = async (library, account) => {
  const web3 = new Web3(library.provider);
  const multicall = new Multicall({
    web3Instance: web3,
    tryAggregate: true,
  });
  const contractCallContext = [
    {
      reference: "balance",
      contractAddress: address.WETH,
      abi: WETH,
      calls: [
        {
          reference: "balance",
          methodName: "balanceOf",
          methodParameters: [account],
        },
      ],
    },
    {
      reference: "tokenEarned",
      contractAddress: address.MASTERCHEF,
      abi: MASTER_CHEF,
      calls: [
        {
          reference: "tokenEarned",
          methodName: "pendingDD2",
          methodParameters: [account],
        },
      ],
    },
    {
      reference: "stake",
      contractAddress: address.MASTERCHEF,
      abi: MASTER_CHEF,
      calls: [
        {
          reference: "stake",
          methodName: "userInfo",
          methodParameters: [account],
        },
      ],
    },
    {
      reference: "totalStake",
      contractAddress: address.DD2,
      abi: DD2,
      calls: [
        {
          reference: "totalStake",
          methodName: "balanceOf",
          methodParameters: [address.MASTERCHEF],
        },
      ],
    },
    {
      reference: "isApproved",
      contractAddress: address.WETH,
      abi: WETH,
      calls: [
        {
          reference: "isApproved",
          methodName: "allowance",
          methodParameters: [account, address.MASTERCHEF],
        },
      ],
    },
  ];
  try {
    const data = await multicall.call(contractCallContext);
    return formatData(data.results);
  } catch (error) {
    console.log(error);
  }
};
