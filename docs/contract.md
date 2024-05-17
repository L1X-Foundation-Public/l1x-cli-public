`l1x contract`
==============

Deploy , Initialize , Call Function , View Function on L1XVM Contract

* [`l1x contract call CONTRACT_ADDRESS FUNCTION`](#l1x-contract-call-contract_address-function)
* [`l1x contract deploy CONTRACT_OBJECT_FILE_PATH`](#l1x-contract-deploy-contract_object_file_path)
* [`l1x contract init CONTRACT_ADDRESS`](#l1x-contract-init-contract_address)
* [`l1x contract view CONTRACT_ADDRESS FUNCTION`](#l1x-contract-view-contract_address-function)

## `l1x contract call CONTRACT_ADDRESS FUNCTION`

Calls State Changing Function on L1X VM Contract

```
USAGE
  $ l1x contract call CONTRACT_ADDRESS FUNCTION --args <value> [--endpoint <value>] [--from <value>] [--fee_limit
    <value>] [--nonce <value>]

ARGUMENTS
  CONTRACT_ADDRESS  L1X VM Contract Address
  FUNCTION          Contract Function to be called

FLAGS
  --args=<value>       (required) [default: {}] JSON Arguments to pass to contract
  --endpoint=<value>   [default: https://v2-mainnet-rpc.l1x.foundation] L1X Endpoint
  --fee_limit=<value>  [default: 1] Fee Limit
  --from=<value>       L1X Wallet Address
  --nonce=<value>      Nonce

DESCRIPTION
  Calls State Changing Function on L1X VM Contract

EXAMPLES
  $ l1x contract call
```

_See code: [src/commands/contract/call.ts](https://github.com/L1X-Foundation/l1x-cli/blob/v1.0.1/src/commands/contract/call.ts)_

## `l1x contract deploy CONTRACT_OBJECT_FILE_PATH`

Deploys L1X VM Contract Object file to L1X Network

```
USAGE
  $ l1x contract deploy CONTRACT_OBJECT_FILE_PATH [--endpoint <value>] [--from <value>] [--fee_limit <value>]
    [--nonce <value>]

ARGUMENTS
  CONTRACT_OBJECT_FILE_PATH  L1X VM Contract File Path

FLAGS
  --endpoint=<value>   [default: https://v2-mainnet-rpc.l1x.foundation] L1X Endpoint
  --fee_limit=<value>  [default: 1] Fee Limit for the deployment
  --from=<value>       Deployer L1X Wallet Address
  --nonce=<value>      Nonce to be used for deployment

DESCRIPTION
  Deploys L1X VM Contract Object file to L1X Network

EXAMPLES
  $ l1x contract deploy
```

_See code: [src/commands/contract/deploy.ts](https://github.com/L1X-Foundation/l1x-cli/blob/v1.0.1/src/commands/contract/deploy.ts)_

## `l1x contract init CONTRACT_ADDRESS`

Initializes L1X VM Contract Address

```
USAGE
  $ l1x contract init CONTRACT_ADDRESS --args <value> [--endpoint <value>] [--from <value>] [--fee_limit <value>]
    [--nonce <value>]

ARGUMENTS
  CONTRACT_ADDRESS  L1X VM Base Contract Address

FLAGS
  --args=<value>       (required) [default: {}] JSON Arguments to pass to contract
  --endpoint=<value>   [default: https://v2-mainnet-rpc.l1x.foundation] L1X Endpoint
  --fee_limit=<value>  [default: 1] Fee Limit
  --from=<value>       L1X Wallet Address
  --nonce=<value>      Nonce

DESCRIPTION
  Initializes L1X VM Contract Address

EXAMPLES
  $ l1x contract init
```

_See code: [src/commands/contract/init.ts](https://github.com/L1X-Foundation/l1x-cli/blob/v1.0.1/src/commands/contract/init.ts)_

## `l1x contract view CONTRACT_ADDRESS FUNCTION`

Calls Readonly Function on L1X VM Contract

```
USAGE
  $ l1x contract view CONTRACT_ADDRESS FUNCTION --args <value> [--endpoint <value>] [--from <value>]

ARGUMENTS
  CONTRACT_ADDRESS  L1X VM Contract Address
  FUNCTION          Contract Function to be called

FLAGS
  --args=<value>      (required) [default: {}] JSON Arguments to pass to contract
  --endpoint=<value>  [default: https://v2-mainnet-rpc.l1x.foundation] L1X Endpoint
  --from=<value>      L1X Wallet Address

DESCRIPTION
  Calls Readonly Function on L1X VM Contract

EXAMPLES
  $ l1x contract view
```

_See code: [src/commands/contract/view.ts](https://github.com/L1X-Foundation/l1x-cli/blob/v1.0.1/src/commands/contract/view.ts)_
