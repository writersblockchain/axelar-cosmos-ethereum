import {
  AxelarAssetTransfer,
  AxelarQueryAPI,
  Environment,
  CHAINS,
  AxelarGMPRecoveryAPI,
  GMPStatusResponse,
} from "@axelar-network/axelarjs-sdk";

import { SigningCosmWasmClient, Secp256k1HdWallet, GasPrice } from "cosmwasm";

import * as dotenv from "dotenv";

const osmoRpc = "https://rpc-test.osmosis.zone";

const axelarAssetTransfer = new AxelarAssetTransfer({
  environment: Environment.TESTNET,
  auth: "metamask",
});
const axelarQuery = new AxelarQueryAPI({
  environment: Environment.TESTNET,
});

const recoveryApi = new AxelarGMPRecoveryAPI({
  environment: Environment.TESTNET,
});

const mnemonic = "";

async function setupClient(
  mnemonic: string,
  rpc: string,
  gas: string | undefined
): Promise<SigningCosmWasmClient> {
  if (gas === undefined) {
    let wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: "osmo",
    });
    let client = await SigningCosmWasmClient.connectWithSigner(rpc, wallet);

    return client;
  } else {
    let gas_price = GasPrice.fromString(gas);
    let wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: "osmo",
    });
    let client = await SigningCosmWasmClient.connectWithSigner(rpc, wallet, {
      gasPrice: gas_price,
    });
    return client;
  }
}

async function getAddress(mnemonic: string, prefix: string = "osmo") {
  let wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, { prefix });
  let accounts = await wallet.getAccounts();
  return accounts[0].address;
}

let getAxelarDepositAddress = async () => {
  let address = await getAddress(mnemonic);
  console.log(address);

  let res = await axelarAssetTransfer.getDepositAddress(
    CHAINS.TESTNET.POLYGON,
    CHAINS.TESTNET.OSMOSIS,
    address,
    "uausdc"
  );
  console.log(res);
};
getAxelarDepositAddress();
// myAxelarDepositAddress = 0xB91f6eE2c6adad30904D0b3db289558a29bdFE64

const queryAxelarTransactionStatus = async () => {
  const txHash: string = "";
  const txStatus: GMPStatusResponse = await recoveryApi.queryTransactionStatus(
    txHash
  );
  console.log(txStatus);
};
// queryAxelarTransactionStatus();
