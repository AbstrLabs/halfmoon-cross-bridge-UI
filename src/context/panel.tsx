import React, { createContext, useCallback, useMemo, useState } from "react";
import { authorizeBurnTransaction, myAlgoWallet } from "../js/algorand";
import { authorizeMintTransaction, nearWallet } from "../js/near";

import { TxnType } from "../js/config";
import algosdk from "algosdk";
import { useCountdown } from "usehooks-ts";

type TTxnSteptype = string | number | symbol;

enum TTxnStepName {
  WALLET_START = "Connect to Wallet",
  WALLET_CONNECTED = "Connected ",
  FORM_START = "Fill up the Form",
  FORM_FILLED = "Filled",
  AUTH = "Authorize the Transaction",
  AUTH_START = "Start the Transaction"
}

const DEFAULT_MINT_BENEFICIARY =
  "ACCSSTKTJDSVP4JPTJWNCGWSDAPHR66ES2AZUAH7MUULEY43DHQSDNR7DA";
const DEFAULT_MINT_AMOUNT = "1.357";
const DEFAULT_BURN_BENEFICIARY = "abstrlabs-test.testnet";
const DEFAULT_BURN_AMOUNT = "1.234";

// from backend
const AMOUNT_REGEX = /^[0-9]*\.?[0-9]{0,10}$/;
const ALGORAND_ADDR_REGEX = /^[2-79A-Z]{58}$/;
const NEAR_ADDR_REGEX = /^[0-9a-z][0-9a-z\-_]{2,64}.(testnet|mainnet)$/;

// step type
type TStep = {
  stepId: number;
  icon: JSX.Element;
  action: (() => void) | (() => Promise<any>);
  finished: string;
};

type TSteps = {
  [key in TTxnSteptype]: TStep;
};

// create context for panel
export type panelType = {
  isMint: boolean;
  isBurn: boolean;
  DEFAULT_BENEFICIARY: string;
  DEFAULT_AMOUNT: string;
  beneficiary: string;
  setBeneficiary: React.Dispatch<string>;
  amount: string;
  setAmount: React.Dispatch<string>;
  algoTxnCountdown: number;
  quickCheckAddress: (addr: string) => boolean;
  validateAddress: (addr: string) => boolean;
  isStepsFinished: Array<boolean>;
  isBeneficiaryValid: boolean;
  setIsBeneficiaryValid: React.Dispatch<boolean>;
  isAmountValid: boolean;
  setIsAmountValid: React.Dispatch<boolean>;
  validateAmount: (amount: string) => boolean;
  steps: TSteps;
  isModalOpen: boolean;
  setModalOpen: React.Dispatch<boolean>;
};

export const PanelContext = createContext<Partial<panelType>>({});

// create provider
const PanelContextProvider = ({
  txnType,
  children,
}: {
  txnType: TxnType;
  children: JSX.Element | JSX.Element[];
}) => {
  const isMint = useMemo(() => txnType === TxnType.MINT, [txnType]);
  const isBurn = useMemo(() => txnType === TxnType.BURN, [txnType]);
  const DEFAULT_BENEFICIARY = isMint
    ? DEFAULT_MINT_BENEFICIARY
    : DEFAULT_BURN_BENEFICIARY;
  const DEFAULT_AMOUNT = isMint ? DEFAULT_MINT_AMOUNT : DEFAULT_BURN_AMOUNT;

  //form input
  const [beneficiary, setBeneficiary] = useState("");
  const [amount, setAmount] = useState("");

  //form input valid
  const [isAmountValid, setIsAmountValid] = useState(false);
  const [isBeneficiaryValid, setIsBeneficiaryValid] = useState(false);

  // connect and step function
  const [connectedNEAR, setNEARAcc] = useState("")
  const [connectedAlgo,setAlgoAcc] = useState("")
  const connected = isMint ? connectedNEAR.slice(0,5) + '...' : connectedAlgo.slice(0,5) + '...'
  
  const [isStepsFinished, setStepsFinished] = useState([false, false, false]);
  const updateStepsFinished = useCallback((pos: 0 | 1 | 2, newVal: boolean) => {
    setStepsFinished((isStepsFinished) => {
      const newStepsFinished = [...isStepsFinished];
      newStepsFinished[pos] = newVal;
      return newStepsFinished;
    });
  }, []);

  // modal control
  const [isModalOpen, setModalOpen] = useState(false);

  //countdown
  const [algoTxnCountdown, { start: startCountdown, reset: resetCountdown }] =
    useCountdown({
      seconds: 100,
      interval: 100,
    });

  const startAlgoTxnCountdown = useCallback(() => {
    resetCountdown();
    setModalOpen(true);
    startCountdown();
  }, [resetCountdown, startCountdown]);

  // form check
  const quickCheckAddress = useCallback(
    (addr: string) =>
      (isMint && ALGORAND_ADDR_REGEX.test(addr)) ||
      (isBurn && NEAR_ADDR_REGEX.test(addr)),
    [isBurn, isMint]
  );
  const validateAddress = useCallback(
    (addr: string) =>
      quickCheckAddress(addr) &&
      ((isMint && algosdk.isValidAddress(addr)) || isBurn),
    [isBurn, isMint, quickCheckAddress]
  );

  const quickCheckAmount = useCallback(
    (amount: string) => AMOUNT_REGEX.test(amount),
    []
  );
  const validateAmount = useCallback(
    (amount: string) => quickCheckAmount(amount),
    [quickCheckAmount]
  );

  const validateForm = useCallback(() => {
    // if (process.env.NODE_ENV === "development") {
    //   const c = window.confirm("Fill with test values?");
    //   if (c) {
    //     setBeneficiary(DEFAULT_BENEFICIARY);
    //     setAmount(DEFAULT_AMOUNT);
    //   }
    // }
    setIsBeneficiaryValid(validateAddress(beneficiary));
    setIsAmountValid(validateAmount(amount));
    if (!isBeneficiaryValid) {
      updateStepsFinished(1, false);
      alert("Invalid address");
      return;
    }
    if (!isAmountValid) {
      updateStepsFinished(1, false);
      alert("Invalid amount");
      return;
    }
    if(isBeneficiaryValid && isAmountValid){
      updateStepsFinished(1, true);
    }
  }, [
    // DEFAULT_AMOUNT,
    // DEFAULT_BENEFICIARY,
    amount,
    beneficiary,
    isAmountValid,
    isBeneficiaryValid,
    updateStepsFinished,
    validateAddress,
    validateAmount,
  ]);

  // connect wallet
  const connectWallet = useCallback(async () => {
    // only blockchain == near
    if (isMint) {
      if (nearWallet.isSignedIn()) {
        const answer = window.confirm(
          "you've signed in, do you want to sign out?"
        );
        if (answer) {
          nearWallet.signOut();
          updateStepsFinished(0, false);
        }
      } else {
        nearWallet.requestSignIn("abstrlabs.testnet");
      }
      setNEARAcc(nearWallet.account().accountId)
      updateStepsFinished(0, true);
    }
    if (isBurn) {
      const accounts = await myAlgoWallet.connect();
      setAlgoAcc(accounts[0].address);
      updateStepsFinished(0, true);
    }
    updateStepsFinished(0, true);
  }, [isBurn, isMint, updateStepsFinished]);

  const authorizeTxn = useCallback(
    async (/* amount: string, beneficiary: string */) => {
      if(isAmountValid && isBeneficiaryValid){
        if (isMint) {
          await authorizeMintTransaction(amount, beneficiary);
        }
        if (isBurn) {
          await authorizeBurnTransaction(connectedAlgo, beneficiary, amount);
          startAlgoTxnCountdown();
        }
      }
    },
    [amount, beneficiary, isBurn, isMint, startAlgoTxnCountdown,connectedAlgo, isAmountValid, isBeneficiaryValid]
  );

  // steps
  const steps: TSteps = useMemo(
    () => ({
      [TTxnStepName.WALLET_START]: {
        stepId: 0,
        icon: <></>,
        action: async () => await connectWallet(),
        finished: TTxnStepName.WALLET_CONNECTED + connected
      },

      [TTxnStepName.FORM_START]: {
        stepId: 1,
        icon: <></>,
        action: validateForm,
        finished: TTxnStepName.FORM_FILLED
      },

      [TTxnStepName.AUTH]: {
        stepId: 2,
        icon: <></>,
        action: async () => await authorizeTxn(),
        finished: TTxnStepName.AUTH_START
      }
    }),
    [authorizeTxn, connectWallet, validateForm, connected]
  );

  const value: panelType = {
    isMint,
    isBurn,
    DEFAULT_BENEFICIARY,
    DEFAULT_AMOUNT,
    beneficiary,
    setBeneficiary,
    amount,
    setAmount,
    algoTxnCountdown,
    quickCheckAddress,
    validateAddress,
    isStepsFinished,
    isBeneficiaryValid,
    setIsBeneficiaryValid,
    isAmountValid,
    setIsAmountValid,
    validateAmount,
    steps,
    isModalOpen,
    setModalOpen
  };

  return (
    <PanelContext.Provider value={value}>{children}</PanelContext.Provider>
  );
};

export default PanelContextProvider;