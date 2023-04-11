export const EVotingManagerAddress =
  "0x3b4c444791F4Efc6D26aC7944004eF0cc8f452BD";
export const EVotingManagerABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_eVoting",
        type: "address",
      },
    ],
    name: "addEVoting",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getEVotings",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
