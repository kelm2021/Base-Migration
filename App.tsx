import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// TODO: Set this to your deployed MERC migration contract address on Base.
const MIGRATION_CONTRACT = '0x97f44adb2bBe15427E3245E81565A9d30A093f95';
// Legacy wrapped MERC token (WTT) on Base.
const WTT_ADDRESS = '0x8923947EAfaf4aD68F1f0C9eb5463eC876D79058';
// Native MERC token (NTT) on Base.
const NTT_ADDRESS = '0xA812da2c3E2381d27024789426cbA9C8CADFdc2c';

// Minimal ERC‑20 ABI for balance and allowance checks and approvals.
const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function allowance(address,address) view returns (uint256)',
  'function approve(address,uint256) returns (bool)'
];

// ABI for the MERC migration contract. Only the migrate function is needed by the dApp.
const MIGRATION_ABI = [
  'function migrate(uint256 amount) external'
];

function App() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [amount, setAmount] = useState('');

  // Connect the user's MetaMask wallet.
  const connect = async () => {
    if (!(window as any).ethereum) {
      alert('Please install MetaMask to use this dApp.');
      return;
    }
    try {
      const prov = new ethers.BrowserProvider((window as any).ethereum);
      await prov.send('eth_requestAccounts', []);
      const signer = await prov.getSigner();
      setProvider(prov);
      setSigner(signer);
      setAccount(await signer.getAddress());
    } catch (err) {
      console.error(err);
      alert('Failed to connect wallet.');
    }
  };

  // Fetch WTT balance for the connected account.
  const fetchBalance = async () => {
    if (!signer) return;
    try {
      const token = new ethers.Contract(WTT_ADDRESS, ERC20_ABI, signer);
      const bal: bigint = await token.balanceOf(account);
      setBalance(ethers.formatUnits(bal, 18));
    } catch (err) {
      console.error(err);
      setBalance('0');
    }
  };

  useEffect(() => {
    if (signer) {
      fetchBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer]);

  // Handle the migration transaction.
  const migrate = async () => {
    if (!signer || !provider) {
      alert('Connect your wallet first.');
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Please enter a valid amount to migrate.');
      return;
    }
    try {
      const amt = ethers.parseUnits(amount, 18);
      const token = new ethers.Contract(WTT_ADDRESS, ERC20_ABI, signer);
      const allowance: bigint = await token.allowance(account, MIGRATION_CONTRACT);
      if (allowance < amt) {
        const approveTx = await token.approve(MIGRATION_CONTRACT, amt);
        await approveTx.wait();
      }
      const migration = new ethers.Contract(MIGRATION_CONTRACT, MIGRATION_ABI, signer);
      const tx = await migration.migrate(amt);
      await tx.wait();
      alert('Migration complete! You now hold NTT.');
      setAmount('');
      fetchBalance();
    } catch (err: any) {
      console.error(err);
      alert('Migration failed. See console for details.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-md rounded-md p-6 w-full max-w-md space-y-4">
        <h1 className="text-xl font-bold text-center">MERC Migration Portal</h1>
        {!account ? (
          <button
            onClick={connect}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Connect Wallet
          </button>
        ) : (
          <>
            <div className="space-y-1 text-sm text-gray-700">
              <p>
                <strong>Account:</strong> {account.slice(0, 6)}…{account.slice(-4)}
              </p>
              <p>
                <strong>WTT Balance:</strong> {balance}
              </p>
            </div>
            <input
              type="number"
              placeholder="Amount to migrate"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={migrate}
              className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Migrate WTT → NTT
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;