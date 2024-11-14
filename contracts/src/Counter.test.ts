import { AccountUpdate, Field, Mina, PrivateKey, PublicKey } from 'o1js';
import { Counter } from './Counter';

/*
 * This file specifies how to test the `Counter` example smart contract. It is safe to delete this file and replace
 * with your own tests.
 *
 * See https://docs.minaprotocol.com/zkapps for more info.
 */

let proofsEnabled = false;

describe('Counter', () => {
  let deployerAccount: Mina.TestPublicKey,
    deployerKey: PrivateKey,
    senderAccount: Mina.TestPublicKey,
    senderKey: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: Counter;

  beforeAll(async () => {
    if (proofsEnabled) await Counter.compile();
  });

  beforeEach(async () => {
    const Local = await Mina.LocalBlockchain({ proofsEnabled });
    Mina.setActiveInstance(Local);
    [deployerAccount, senderAccount] = Local.testAccounts;
    deployerKey = deployerAccount.key;
    senderKey = senderAccount.key;

    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new Counter(zkAppAddress);
  });

  async function localDeploy() {
    const txn = await Mina.transaction(deployerAccount, async () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      await zkApp.deploy();
    });
    await txn.prove();
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([deployerKey, zkAppPrivateKey]).send();
  }

  it('generates and deploys the `Counter` smart contract', async () => {
    await localDeploy();
    const num = zkApp.num.get();
    expect(num).toEqual(Field(1993));
  });

  it('correctly updates the num state on the `Counter` smart contract', async () => {
    await localDeploy();

    async function inc() {
      const txn = await Mina.transaction(senderAccount, async () => {
        await zkApp.inc();
      });
      await txn.prove();
      await txn.sign([senderKey]).send();
    }

    async function sub() {
      const txn = await Mina.transaction(senderAccount, async () => {
        await zkApp.dec();
      });
      await txn.prove();
      await txn.sign([senderKey]).send();
    }

    await sub();
    await inc();
    await inc();
    await inc();
    await inc();
    await sub();

    const updatedNum = zkApp.num.get();
    expect(updatedNum).toEqual(Field(1995));
  });
});
