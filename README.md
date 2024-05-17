# L1X CLI (Beta)

L1X CLI (Beta) is a command-line interface tool that allows you to interact with the L1X blockchain network. It provides a convenient way to manage accounts and wallets, deploy and interact with smart contracts, and perform various transactions on the L1X network.

## Installation

To install the L1X CLI (Beta), you need to have Node.js and npm (Node Package Manager) installed on your system. Once you have the prerequisites, you can install the CLI globally using npm:

```
npm install -g @l1x/l1x-cli-beta
```

After the installation is complete, you can use the `l1x-cli-beta` command in your terminal.

## Usage

The basic usage of the L1X CLI is as follows:

```
$ l1x-cli-beta COMMAND

running command...

$ l1x-cli-beta (--version)
@l1x/l1x-cli-beta/1.0.1 linux-x64 node-v18.19.1

$ l1x-cli-beta --help [COMMAND]
USAGE
  $ l1x-cli-beta COMMAND
```

To get help on a specific command, you can use `l1x --help [COMMAND]`. For example, `l1x --help transfer` will provide detailed information about the `transfer` command.

## Common Flags and Arguments

Several commands in the L1X CLI share common flags and arguments. Here's an explanation of some of the most frequently used ones:

- `--endpoint`: Specifies the L1X endpoint URL to connect to. The default value is `https://v2-mainnet-rpc.l1x.foundation`, which points to the L1X mainnet.
- `--from`: Specifies the L1X wallet address from which the transaction or operation should be performed.
- `--fee_limit`: Sets the maximum fee limit (in L1X tokens) that the user is willing to pay for the transaction.
- `--nonce`: Specifies the nonce value to be used for the transaction. If not provided, the CLI will automatically fetch and use the next available nonce for the specified wallet address.

## Accounts and Wallets

The L1X CLI provides several commands for managing accounts and wallets:

- `l1x-cli-beta wallet create`: Creates a new wallet/account by generating a new key pair.
- `l1x-cli-beta wallet import PRIVATEKEY`: Imports a wallet by providing its private key.
- `l1x-cli-beta wallet accounts`: Lists all available accounts in the wallet.
- `l1x-cli-beta wallet default ADDRESS`: Sets the specified address as the default wallet for subsequent commands.
- `l1x-cli-beta account balance [ADDRESS] [--endpoint]`: Retrieves the balance of an L1X wallet.
- `l1x-cli-beta account state [ADDRESS] [--endpoint]`: Retrieves the account state (nonce and balance) of an L1X wallet.

## Smart Contracts

The L1X CLI allows you to deploy and interact with smart contracts on the L1X network:

- `l1x-cli-beta contract deploy CONTRACT_OBJECT_FILE_PATH [--endpoint] [--from] [--fee_limit] [--nonce]`: Deploys an L1X VM Contract Object file to the L1X network.
- `l1x-cli-beta contract init CONTRACT_ADDRESS --args [--endpoint] [--from] [--fee_limit] [--nonce]`: Initializes an L1X VM contract address with the provided arguments.
- `l1x-cli-beta contract call CONTRACT_ADDRESS FUNCTION --args [--endpoint] [--from] [--fee_limit] [--nonce]`: Invokes a state-changing function on an L1X VM contract.
- `l1x-cli-beta contract view CONTRACT_ADDRESS FUNCTION --args [--endpoint] [--from]`: Calls a read-only function on an L1X VM contract.

Example usage:

```bash
# Deploy a contract
l1x-cli-beta contract deploy path/to/contract.obj

# Initialize a contract
l1x-cli-beta contract init 0x1234567890abcdef --args '{"value": 42}'

# Call a contract function
l1x-cli-beta contract call 0x1234567890abcdef myFunction --args '{"arg1": "value1", "arg2": 123}'

# Call a read-only contract function
l1x-cli-beta contract view 0x1234567890abcdef getValueFunction --args '{}'
```

## Transactions

The L1X CLI provides commands for performing transactions on the L1X network:

- `l1x-cli-beta transfer TO_ADDRESS AMOUNT [--nonce] [--from] [--fee_limit] [--endpoint]`: Transfers L1X tokens to another wallet address.
- `l1x-cli-beta tx receipt TX_HASH [--endpoint]`: Fetches the receipt of a transaction specified by its hash.
- `l1x-cli-beta tx events TX_HASH [--endpoint]`: Fetches the events emitted by a transaction specified by its hash.

## Additional Commands

- `l1x-cli-beta autocomplete [SHELL] [-r]`: Displays autocomplete installation instructions for the specified shell (e.g., `zsh`, `bash`, `powershell`).
- `l1x-cli-beta help [COMMAND]`: Displays help information for the specified command or the CLI in general.
- `l1x-cli-beta update [CHANNEL] [-a] [--force] [-i | -v <value>]`: Updates the L1X CLI to the latest version or a specific version/channel.

## Examples

Here are some examples of using the L1X CLI:

```bash
# Create a new wallet
l1x-cli-beta wallet create

# Import an existing wallet
l1x-cli-beta wallet import 0xABCDEF...

# Set the default wallet
l1x-cli-beta wallet default 0x1234567890abcdef

# Check the balance of a wallet
l1x-cli-beta account balance 0x1234567890abcdef

# Transfer 1 L1X token
l1x-cli-beta transfer 0x9876543210fedcba 1

# Deploy a contract
l1x-cli-beta contract deploy path/to/contract.obj --from 0x1234567890abcdef

# Call a contract function
l1x-cli-beta contract call 0x1234567890abcdef myFunction --args '{"arg1": "value1", "arg2": 123}' --from 0x1234567890abcdef

# Get transaction receipt
l1x-cli-beta tx receipt 0x9876543210fedcba
```

For more information and detailed usage instructions, please refer to the individual command help by running `l1x-cli-beta --help [COMMAND]`.
