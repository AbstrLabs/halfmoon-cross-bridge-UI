import React, { useCallback, useMemo, useState, createContext } from "react";
import algosdk from "algosdk";

import {
    authorizeBurnTransaction,
    connectToMyAlgo,
  } from "../js/algorand";
import { authorizeMintTransaction, nearWallet } from "../js/near";
import { TxnType } from "../js/config";
import { useCountdown } from "usehooks-ts";

type TTxnSteptype = string | number | symbol;

enum TTxnStepName {
  WALLET = "Connect to Wallet",
  FORM = "Fill up the Form",
  AUTH = "Authorize Mint Transaction",
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
};

type TSteps = {
  [key in TTxnSteptype]: TStep;
};

// create context for panel
type panelType = {
  isMint: boolean;
  isBurn: boolean;
  DEFAULT_BENEFICIARY: string;
  DEFAULT_AMOUNT:string;
  beneficiary:string;
  setBeneficiary: React.Dispatch<string>;
  amount: string;
  setAmount: React.Dispatch<string>;
  algoTxnCountdown: number;
  quickCheckAddress: (addr: string) => boolean;
  validateAddress: (addr: string) => boolean;
  isStepsFinished: Array<boolean>;
  isBeneficiaryValid: boolean;
  setIsBeneficiaryValid: React.Dispatch<boolean>;
  isAmountValid:boolean;
  setIsAmountValid: React.Dispatch<boolean>;
  validateAmount: (amount: string) => boolean;
  steps: TSteps;
  isModalOpen: boolean;
  setModalOpen: React.Dispatch<boolean>;
}

export const PanelContext = createContext<Partial<panelType>>({});

// create provider
const PanelContextProvider = ({txnType, children}:any) => {
  const isMint = useMemo(() => txnType === TxnType.MINT, [txnType]);
  const isBurn = useMemo(() => txnType === TxnType.BURN, [txnType]);
  const DEFAULT_BENEFICIARY = isMint
  ? DEFAULT_MINT_BENEFICIARY
  : DEFAULT_BURN_BENEFICIARY;
  const DEFAULT_AMOUNT = isMint ? DEFAULT_MINT_AMOUNT : DEFAULT_BURN_AMOUNT;

  //form input
  const [beneficiary, setBeneficiary] = useState("");
  const [amount, setAmount] = useState("");

  // step function
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
    const [isAmountValid, setIsAmountValid] = useState(true);
    const [isBeneficiaryValid, setIsBeneficiaryValid] = useState(true);
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
      if (process.env.NODE_ENV === "development") {
        const c = window.confirm("Fill with test values?");
        if (c) {
          setBeneficiary(DEFAULT_BENEFICIARY);
          setAmount(DEFAULT_AMOUNT);
        }
      }
      setIsBeneficiaryValid(validateAddress(beneficiary));
      setIsAmountValid(validateAmount(amount));
      if (!isBeneficiaryValid) {
        updateStepsFinished(0, false);
        alert("Invalid address");
        return;
      }
      if (!isAmountValid) {
        updateStepsFinished(0, false);
        alert("Invalid amount");
        return;
      }
      updateStepsFinished(0, true);
    }, [
      DEFAULT_AMOUNT,
      DEFAULT_BENEFICIARY,
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
          updateStepsFinished(1, true);
          const answer = window.confirm(
            "you've signed in, do you want to sign out?"
          );
          if (answer) {
            nearWallet.signOut();
            updateStepsFinished(1, false);
          }
        } else {
          nearWallet.requestSignIn("abstrlabs.testnet");
          updateStepsFinished(1, true);
        }
      }
      if (isBurn) {
        await connectToMyAlgo();
        updateStepsFinished(1, true);
      }
      updateStepsFinished(1, true);
    }, [isBurn, isMint, updateStepsFinished]);
  
    const authorizeTxn = useCallback(
      async (/* amount: string, beneficiary: string */) => {
        if (isMint) {
          await authorizeMintTransaction(amount, beneficiary);
        }
        if (isBurn) {
          await authorizeBurnTransaction(beneficiary, amount);
          startAlgoTxnCountdown();
        }
      },
      [amount, beneficiary, isBurn, isMint, startAlgoTxnCountdown]
    );
  
    // steps 
    const steps: TSteps = useMemo(
      () => ({
        [TTxnStepName.WALLET]: {
          stepId: 0,
          icon: <></>,
          action: async () => await connectWallet(),
        },

        [TTxnStepName.FORM]: {
          stepId: 1,
          icon: <></>,
          action: validateForm,
        },

        [TTxnStepName.AUTH]: {
          stepId: 2,
          icon: <></>,
          action: async () => await authorizeTxn(),
        },
      }),
      [authorizeTxn, connectWallet, validateForm]
    );

    const value = {
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
    }

    return (
      <PanelContext.Provider value={value}>
        {children}
      </PanelContext.Provider>
    )
}

export default PanelContextProvider