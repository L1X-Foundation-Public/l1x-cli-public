`l1x tx`
========

Get L1X Transaction Receipt and Events for Given Hash

* [`l1x tx events TX_HASH`](#l1x-tx-events-tx_hash)
* [`l1x tx receipt TX_HASH`](#l1x-tx-receipt-tx_hash)

## `l1x tx events TX_HASH`

Fetches the receipt of a transaction (specified by its hash)

```
USAGE
  $ l1x tx events TX_HASH [--endpoint <value>]

ARGUMENTS
  TX_HASH  L1X TX Hash

FLAGS
  --endpoint=<value>  [default: https://v2-mainnet-rpc.l1x.foundation] L1X Endpoint

DESCRIPTION
  Fetches the receipt of a transaction (specified by its hash)

EXAMPLES
  $ l1x tx events
```

_See code: [src/commands/tx/events.ts](https://github.com/L1X-Foundation/l1x-cli/blob/v1.0.1/src/commands/tx/events.ts)_

## `l1x tx receipt TX_HASH`

Fetches the receipt of a transaction (specified by its hash)

```
USAGE
  $ l1x tx receipt TX_HASH [--endpoint <value>]

ARGUMENTS
  TX_HASH  L1X TX Hash

FLAGS
  --endpoint=<value>  [default: https://v2-mainnet-rpc.l1x.foundation] L1X Endpoint

DESCRIPTION
  Fetches the receipt of a transaction (specified by its hash)

EXAMPLES
  $ l1x tx receipt
```

_See code: [src/commands/tx/receipt.ts](https://github.com/L1X-Foundation/l1x-cli/blob/v1.0.1/src/commands/tx/receipt.ts)_
