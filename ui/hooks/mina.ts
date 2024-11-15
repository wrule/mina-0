import { ChainInfoArgs, ProviderError } from '@aurowallet/mina-provider';
import React, { useEffect, useState } from 'react';

export
const useMina = () => {
  const mina = window.mina!;

  const [accounts, setAccounts] = useState<string[]>([]);
  const [chainInfo, setChainInfo] = useState<ChainInfoArgs | null>(null);

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

  useEffect(() => {
    connect();
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
    chainInfo,
  };
};
