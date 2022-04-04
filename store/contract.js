import Web3 from "web3";
import { createSlice } from "@reduxjs/toolkit";

import { NETWORKS, ABIS } from "./../consts";
import config from "./../config";

const contracts = {
  quiz: null,
};

export const contractSlice = createSlice({
  name: "contract",

  initialState: {
    chainId: null,
    accountAddress: null,
    balance: null,
    decimals: null,
    hasMetamask: false,
  },

  reducers: {
    setChainId: (state, action) => {
      state.chainId = action.payload;
    },

    setAccountAddress: (state, action) => {
      state.accountAddress = action.payload;
    },

    setBalance: (state, action) => {
      state.balance = action.payload;
    },

    setDecimals: (state, action) => {
      state.decimals = action.payload;
    },

    setHasMetamask: (state, action) => {
      state.hasMetamask = action.payload;
    },
  },
});

export const {
  setChainId,
  setAccountAddress,
  setBalance,
  setDecimals,
  setHasMetamask,
} = contractSlice.actions;

export const signInWithMetamask = () => async (dispatch) => {
  if (!window.ethereum) {
    return;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    dispatch(metamaskListener());
  } catch (error) {}
};

const getContracts = () => {
  contracts = {
    quiz: new web3.eth.Contract(ABIS["quiz"], config.addresses["quiz"]),
  };

  return contracts;
};

export const metamaskListener = () => (dispatch) => {
  if (!window.ethereum) {
    dispatch(setHasMetamask(false));
    return;
  }

  dispatch(setHasMetamask(true));

  if (config.chainId == parseInt(window.ethereum.chainId)) {
    window.web3 = new Web3(NETWORKS[parseInt(window.ethereum.chainId)]);
    contracts = getContracts(window.ethereum.chainId);
  }

  dispatch(setAccountAddress(window.ethereum.selectedAddress));
  dispatch(setChainId(parseInt(window.ethereum.chainId)));

  window.ethereum.on("chainChanged", (chainId) => {
    if (config.chainId == parseInt(chainId)) {
      window.web3 = new Web3(NETWORKS[parseInt(chainId)]);
      contracts = getContracts(chainId);
    }
    dispatch(setChainId(parseInt(chainId)));
  });

  window.ethereum.on("accountsChanged", ([currentAccount = null]) => {
    if (!currentAccount) {
      return;
    }

    dispatch(setAccountAddress(currentAccount));
  });
};

export const logout = () => (dispatch) => {
  dispatch(setChainId(null));
  dispatch(setAccountAddress(null));
};

export const loadBalance = () => async (dispatch) => {
  const balance = await contracts.quiz.methods
    .balanceOf(window.ethereum.selectedAddress)
    .call();
  dispatch(setBalance(balance));
};

export const loadDecimals = () => async (dispatch) => {
  const decimals = await contracts.quiz.methods.decimals().call();
  dispatch(setDecimals(decimals));
};

export const useSelectContracts = (state) => contracts;

export const useSelectChainId = (state) => state.contract.chainId;

export const useSelectIsWrongChain = (state) =>
  state.contract.chainId != config.chainId;

export const useSelectAccountAddress = (state) => state.contract.accountAddress;

export const useSelectBalance = (state) => state.contract.balance;

export const useSelectDecimals = (state) => state.contract.decimals;

export const useSelectHasMetamask = (state) => state.contract.hasMetamask;

export default contractSlice.reducer;
