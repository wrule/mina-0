'use client';
import Head from 'next/head';
import { useEffect } from 'react';
import GradientBG from '../components/GradientBG.js';
import styles from '../styles/Home.module.css';

const RPC_ADDRESS = 'https://api.minascan.io/node/devnet/v1/graphql';
const CONTRACT_ADDRESS = 'B62qkqaxfZZPPE5T8RSU3bpCZ9CP3XtYzCQvUbJU6c6DcjPrRyC13V4';

export default function Home() {
  useEffect(() => {
    (async () => {
      const { Mina, PublicKey, fetchAccount } = await import('o1js');
      const { Counter } = await import('../../contracts/build/src/');

      // 设置连接到 Berkeley 测试网
      const Devnet = Mina.Network(RPC_ADDRESS);
      Mina.setActiveInstance(Devnet);

      // Update this to use the address (public key) for your zkApp account.
      // To try it out, you can try this address for an example "Add" smart contract that we've deployed to
      // Testnet B62qnTDEeYtBHBePA4yhCt4TCgDtA4L2CGvK7PirbJyX4pKH8bmtWe5.
      const zkAppAddress = CONTRACT_ADDRESS;

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
        <title>Mina-0</title>
        <meta name="description" content="built with o1js" />
        <link rel="icon" href="/assets/favicon.ico" />
      </Head>
      <GradientBG>
        <main className={styles.main}>
          <h1>Mina-0</h1>
          <section>
            <div
              className="flex items-center justify-center space-x-4 bg-white/30 backdrop-blur-sm p-6 rounded-xl shadow-lg">
              <button 
                className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl font-bold hover:opacity-80 transition-opacity duration-200 shadow-md flex items-center justify-center">
                -
              </button>
              <div className="w-24 h-16 rounded-lg bg-white/50 backdrop-blur-md flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">
                  1
                </span>
              </div>
              <button 
                className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-2xl font-bold hover:opacity-80 transition-opacity duration-200 shadow-md flex items-center justify-center">
                +
              </button>
            </div>
          </section>
        </main>
      </GradientBG>
    </>
  );
}
