
import {
	Transaction,
	Keypair,
	SystemProgram,
	ComputeBudgetProgram,
} from '@solana/web3.js';
import { TpuConnection} from '../src';
import { config } from 'dotenv';
import base58 from 'bs58';

config();

const rpcurl = process.env.RPC_URL!;
const signer = Keypair.fromSecretKey(base58.decode(process.env.KEYPAIR!));

(async () => {
    const start = process.hrtime();
    const tpuConnection = await TpuConnection.load(rpcurl, { commitment: 'confirmed' });
    const tx = new Transaction();
    const instruction = SystemProgram.transfer({ fromPubkey: signer.publicKey, toPubkey: signer.publicKey, lamports: 1000 });
    tx.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1000 }));
    tx.add(ComputeBudgetProgram.setComputeUnitLimit({ units: 10_000 }));
    tx.add(instruction);
    console.log('sending tx');
    await tpuConnection.sendAndConfirmAbortableTransaction(tx, [signer]);
    const end = process.hrtime(start);
    const timeInMs = (end[0]* 1000000000 + end[1]) / 1000000;
    console.log(timeInMs);
})();
