const { ethers } = require("ethers");
const EventTicketABI = require("../../frontend/src/EventTicketABI.json");

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL); 
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = "0xfEa8b30718FC87208aD682C6Aefd789fD21F80dF";
const contract = new ethers.Contract(contractAddress, EventTicketABI, wallet);

module.exports = contract;