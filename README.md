# MERC Migration dApp

This folder contains a simple React + Vite web application that allows users
to swap their legacy wrapped MERC (WTT) for the new native MERC (NTT) on
Base. The dApp connects to the user's MetaMask wallet, displays their WTT
balance, and performs the approval and migration transactions in a single
flow.

## Features

- Detects and connects to MetaMask via `ethers` v6.
- Shows the connected account address and WTT balance.
- Allows users to specify an amount of WTT to migrate.
- Automatically handles ERC‑20 approvals if needed.
- Calls the `migrate` function on your deployed `MERCMigration` contract.

## Configuration

1. Install dependencies (requires internet access):

   ```bash
   npm install
   ```

2. Set the address of your deployed `MERCMigration` contract in
   `src/App.tsx` by replacing the `MIGRATION_CONTRACT` constant.

3. Run the development server:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000` by default.

4. To build a production bundle:

   ```bash
   npm run build
   ```

The WTT and NTT token addresses are already set in `src/App.tsx`. If the
token addresses change in the future, update the `WTT_ADDRESS` and
`NTT_ADDRESS` constants accordingly.

## Notes

This dApp uses Tailwind CSS for styling. The included configuration files
(`tailwind.config.js`, `postcss.config.js`) and `src/index.css` are set up
to enable Tailwind via Vite. Feel free to customize the styles as needed.

Because dependencies must be installed from npm, you must run `npm install`
in an environment with internet access. After installation you can run
development or build commands normally. If you encounter missing package
errors, ensure that your environment has network connectivity to the npm
registry.