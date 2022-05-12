const nearAPI = require("near-api-js");
const sha256 = require("js-sha256");
require("dotenv").config();

const sender = "sender.testnet";
const receiver = "receiver.testnet";
const networkId = "testnet";

const provider = new nearAPI.providers.JsonRpcProvider(
    `https://rpc.${networkId}.near.org`
  );

const result = new nearAPI.providers.JsonRpcProvider.txStatus