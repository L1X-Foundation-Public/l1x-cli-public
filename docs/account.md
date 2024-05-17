`l1x account`
=============

Get L1X Account Balance, Nonce and State

* [`l1x account balance [ADDRESS]`](#l1x-account-balance-address)
* [`l1x account state [ADDRESS]`](#l1x-account-state-address)

## `l1x account balance [ADDRESS]`

Gets L1X Wallet Balance

```
USAGE
  $ l1x account balance [ADDRESS] [-e <value>]

ARGUMENTS
  ADDRESS  L1X Wallet Address

FLAGS
  -e, --endpoint=<value>  [default: https://v2-mainnet-rpc.l1x.foundation] L1X Endpoint

DESCRIPTION
  Gets L1X Wallet Balance

EXAMPLES
  $ l1x account balance
```

_See code: [src/commands/account/balance.ts](https://github.com/L1X-Foundation/l1x-cli/blob/v1.0.1/src/commands/account/balance.ts)_

## `l1x account state [ADDRESS]`

Gets L1X Wallet Account State

```
USAGE
  $ l1x account state [ADDRESS] [-e <value>]

ARGUMENTS
  ADDRESS  L1X Wallet Address

FLAGS
  -e, --endpoint=<value>  [default: https://v2-mainnet-rpc.l1x.foundation] L1X Endpoint

DESCRIPTION
  Gets L1X Wallet Account State

EXAMPLES
  $ l1x account state
```

_See code: [src/commands/account/state.ts](https://github.com/L1X-Foundation/l1x-cli/blob/v1.0.1/src/commands/account/state.ts)_
