// TODO(BAN-69): Purpose of this file is to split TxnPanel to a From and a Stepper, but not finished

import React, { createContext, useCallback, useMemo, useState } from "react";
import { authorizeBurnTransaction, myAlgoWallet } from "../js/algorand";
import { authorizeMintTransaction, nearWallet } from "../js/near";

import { TxnType } from "../js/config";
import algosdk from "algosdk";
import { useCountdown } from "usehooks-ts";

enum TxnStepName {
  CONNECT_WALLET = "CONNECT_WALLET",
  VALIDATE_FORM = "VALIDATE_FORM",
  AUTH_TXN = "AUTH_TXN",
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
  title: {
    default: string;
    finished: string;
    // can add a error message here
  };
};

type TSteps = {
  [key in TxnStepName]: TStep;
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
  connectedAcc: string;
  updateStepsFinished: (pos: 0 | 1 | 2, newVal: boolean) => void;
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
  //
  const [nearAcc, setNearAcc] = useState<string>(
    nearWallet.account().accountId ?? ""
  );
  const [algoAcc, setAlgoAcc] = useState<string>("");
  const connectedAcc = useMemo(
    () => (isMint ? nearAcc : algoAcc),
    [algoAcc, isMint, nearAcc]
  );

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
  /*!!!   useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setBeneficiary(DEFAULT_BENEFICIARY);
      setAmount(DEFAULT_AMOUNT);
    }
  }, [DEFAULT_AMOUNT, DEFAULT_BENEFICIARY]); */
  const validateForm = useCallback(() => {
    // const c = window.confirm("Fill with test values?");
    // if (c) {
    // new Promise((resolve) => {
    //   resolve(0);
    // });
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
    if (isBeneficiaryValid && isAmountValid) {
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
      setNearAcc(nearWallet.account().accountId);
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
      if (isAmountValid && isBeneficiaryValid) {
        if (isMint) {
          await authorizeMintTransaction(amount, beneficiary);
        }
        if (isBurn) {
          await authorizeBurnTransaction(algoAcc, beneficiary, amount);
          startAlgoTxnCountdown();
        }
      }
    },
    [
      amount,
      beneficiary,
      isBurn,
      isMint,
      startAlgoTxnCountdown,
      algoAcc,
      isAmountValid,
      isBeneficiaryValid,
    ]
  );

  console.log("connectedAcc.length : ", connectedAcc.length); // DEV_LOG_TO_REMOVE

  // steps
  const steps: TSteps = useMemo(
    () => ({
      [TxnStepName.CONNECT_WALLET]: {
        stepId: 0,
        icon: <></>,
        action: async () => await connectWallet(),
        title: {
          default: "Connect to Wallet",
          finished: "Wallet Connected",
        },
      },
      [TxnStepName.VALIDATE_FORM]: {
        stepId: 1,
        icon: <></>,
        action: validateForm,
        title: {
          default: "Fill up the Form",
          finished: "Form Validated",
        },
      },

      [TxnStepName.AUTH_TXN]: {
        stepId: 2,
        icon: <></>,
        action: async () => await authorizeTxn(),
        title: {
          default: "Start the Transaction",
          finished: "Transaction Authorized",
        },
      },
    }),
    [validateForm, connectWallet, authorizeTxn]
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
    setModalOpen,
    connectedAcc,
    updateStepsFinished,
  };

  return (
    <PanelContext.Provider value={value}>{children}</PanelContext.Provider>
  );
};

export default PanelContextProvider;
