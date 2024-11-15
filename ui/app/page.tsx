'use client';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import GradientBG from '../components/GradientBG.js';
import styles from '../styles/Home.module.css';
import { Mina, PublicKey, fetchAccount } from 'o1js';
import { Counter } from '../../contracts/build/src/';

const RPC_ADDRESS = 'https://api.minascan.io/node/devnet/v1/graphql';
const CONTRACT_ADDRESS = 'B62qkqaxfZZPPE5T8RSU3bpCZ9CP3XtYzCQvUbJU6c6DcjPrRyC13V4';

export default function Home() {
  const counterRef = useRef<Counter>();
  const [num, setNum] = useState<string>('');

  const updateNum = async () => {
    if (counterRef.current) {
      const currentNum = await counterRef.current.num.get();
      setNum(currentNum.toString());
    }
  };

  const initCounter = async () => {
    if (!counterRef.current) {
      Mina.setActiveInstance(Mina.Network(RPC_ADDRESS));
      await fetchAccount({ publicKey: CONTRACT_ADDRESS });
      counterRef.current = new Counter(PublicKey.fromBase58(CONTRACT_ADDRESS));
      updateNum();
    }
  };

  useEffect(() => {
    initCounter();
  }, []);

  const handleInc = async () => {
    console.log(1);
    if (counterRef.current) {
      console.log(2);
      const a = await counterRef.current.inc();
      console.log(a);
      console.log(3);
      updateNum();
    }
  };

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
          <div>
            <button
              className="px-6 py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              onClick={() => {
                // if (typeof window.mina !== 'undefined') {
                //   console.log('Auro Wallet is installed!');
                // }
              }}>
              Connect Auro Wallet
            </button>
          </div>
          <section>
            <div
              className="flex items-center justify-center space-x-4 bg-white/30 backdrop-blur-sm p-6 rounded-xl shadow-lg">
              <button 
                className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl font-bold hover:opacity-80 transition-opacity duration-200 shadow-md flex items-center justify-center">
                -
              </button>
              <div className="w-24 h-16 rounded-lg bg-white/50 backdrop-blur-md flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">
                  {num}
                </span>
              </div>
              <button 
                className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-2xl font-bold hover:opacity-80 transition-opacity duration-200 shadow-md flex items-center justify-center"
                onClick={handleInc}>
                +
              </button>
            </div>
          </section>
        </main>
      </GradientBG>
    </>
  );
}
