`l1x transfer`
==============

Send L1X from Default or Imported L1X Wallet Address

* [`l1x transfer TO_ADDRESS AMOUNT`](#l1x-transfer-to_address-amount)

## `l1x transfer TO_ADDRESS AMOUNT`

Transfer L1X Tokens

```
USAGE
  $ l1x transfer TO_ADDRESS AMOUNT [--nonce <value>] [--from <value>] [--fee_limit <value>] [--endpoint
    <value>]

ARGUMENTS
  TO_ADDRESS  Receiver L1X Wallet Address
  AMOUNT      L1X Amount to be sent (ex. 1 L1X)

FLAGS
  --endpoint=<value>   [default: https://v2-mainnet-rpc.l1x.foundation] L1X Endpoint
  --fee_limit=<value>  [default: 1] Fee Limit for the transaction
  --from=<value>       Sender L1X Wallet Address
  --nonce=<value>      TX Nonce to be used for Tx

DESCRIPTION
  Transfer L1X Tokens

EXAMPLES
  $ l1x transfer
```

_See code: [src/commands/transfer.ts](https://github.com/L1X-Foundation/l1x-cli/blob/v1.0.1/src/commands/transfer.ts)_
