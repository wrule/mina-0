'use client';
import Head from 'next/head';
import { useEffect } from 'react';
import GradientBG from '../components/GradientBG.js';
import styles from '../styles/Home.module.css';

export default function Home() {
  useEffect(() => {
    (async () => {
      const { Mina, PublicKey, fetchAccount } = await import('o1js');
      const { Counter } = await import('../../contracts/build/src/');

      // 设置连接到 Berkeley 测试网
      const Devnet = Mina.Network('https://api.minascan.io/node/devnet/v1/graphql');
      Mina.setActiveInstance(Devnet);

      // Update this to use the address (public key) for your zkApp account.
      // To try it out, you can try this address for an example "Add" smart contract that we've deployed to
      // Testnet B62qnTDEeYtBHBePA4yhCt4TCgDtA4L2CGvK7PirbJyX4pKH8bmtWe5.
      const zkAppAddress = 'B62qkqaxfZZPPE5T8RSU3bpCZ9CP3XtYzCQvUbJU6c6DcjPrRyC13V4';

      await fetchAccount({ publicKey: zkAppAddress });
      // This should be removed once the zkAppAddress is updated.
      if (!zkAppAddress) {
        console.error(
          'The following error is caused because the zkAppAddress has an empty string as the public key. Update the zkAppAddress with the public key for your zkApp account, or try this address for an example "Add" smart contract that we deployed to Testnet: B62qnTDEeYtBHBePA4yhCt4TCgDtA4L2CGvK7PirbJyX4pKH8bmtWe5'
        );
      }
      const zkApp = new Counter(PublicKey.fromBase58(zkAppAddress));
      const currentNum = await zkApp.num.get();
      console.log(1234, currentNum.toString());
    })();
  }, []);

  return (
    <>
      <Head>
        <title>Mina zkApp UI</title>
        <meta name="description" content="built with o1js" />
        <link rel="icon" href="/assets/favicon.ico" />
      </Head>
      <GradientBG>
        <main className={styles.main}>
          <h1>Hello Mina</h1>
        </main>
      </GradientBG>
    </>
  );
}
