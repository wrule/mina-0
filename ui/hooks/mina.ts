import { ChainInfoArgs, ProviderError } from '@aurowallet/mina-provider';
import React, { useEffect, useMemo, useState } from 'react';

export
const useMina = () => {
  const mina = window.mina!;

  const [accounts, setAccounts] = useState<string[]>([]);
  const [chainInfo, setChainInfo] = useState<ChainInfoArgs | null>(null);

  const mainAccount = useMemo(() => accounts[0] as string | undefined, [accounts]);

  const handleAccountsChanged = (accounts: string[]) => {
    setAccounts(accounts);
  };

  const handleChainChanged = (chainInfo: ChainInfoArgs) => {
    setChainInfo(chainInfo);
  };

  const connect = async () => {
    const result = await mina.requestAccounts();
    if (result instanceof Array) {
      setAccounts(result);
    }
    return result;
  };

  const getNetworkInfo = async () => {
    try {
      const network = await mina.requestNetwork();
      setChainInfo(network);
      return network;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    connect();
    getNetworkInfo();
    mina.on('accountsChanged', handleAccountsChanged);
    mina.on('chainChanged', handleChainChanged);
    return () => {
      mina.removeListener('accountsChanged', handleAccountsChanged);
      mina.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  return {
    connect,
    accounts,
    mainAccount,
    chainInfo,
  };
};
