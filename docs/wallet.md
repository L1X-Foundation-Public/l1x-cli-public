`l1x wallet`
============

Create, Import , Set Default , View L1X Wallet Address

* [`l1x wallet accounts`](#l1x-wallet-accounts)
* [`l1x wallet create`](#l1x-wallet-create)
* [`l1x wallet default ADDRESS`](#l1x-wallet-default-address)
* [`l1x wallet import`](#l1x-wallet-import)

## `l1x wallet accounts`

List all available accounts in the wallet

```
USAGE
  $ l1x wallet accounts

DESCRIPTION
  List all available accounts in the wallet
```

_See code: [src/commands/wallet/accounts.ts](https://github.com/L1X-Foundation/l1x-cli/blob/v1.0.1/src/commands/wallet/accounts.ts)_

## `l1x wallet create`

Create a new wallet/account (Generate KeyPair Only)

```
USAGE
  $ l1x wallet create

DESCRIPTION
  Create a new wallet/account (Generate KeyPair Only)

EXAMPLES
  $ l1x wallet create
```

_See code: [src/commands/wallet/create.ts](https://github.com/L1X-Foundation/l1x-cli/blob/v1.0.1/src/commands/wallet/create.ts)_

## `l1x wallet default ADDRESS`

Set Default Wallet for L1X

```
USAGE
  $ l1x wallet default ADDRESS

ARGUMENTS
  ADDRESS  Wallet Address

DESCRIPTION
  Set Default Wallet for L1X

EXAMPLES
  $ l1x wallet default
```

_See code: [src/commands/wallet/default.ts](https://github.com/L1X-Foundation/l1x-cli/blob/v1.0.1/src/commands/wallet/default.ts)_

## `l1x wallet import`

Import a wallet by private key

```
USAGE
  $ l1x wallet import --privateKey <value>

FLAGS
  --privateKey=<value>  (required) Private Key to import in hex format

DESCRIPTION
  Import a wallet by private key

EXAMPLES
  $ l1x wallet import
```

_See code: [src/commands/wallet/import.ts](https://github.com/L1X-Foundation/l1x-cli/blob/v1.0.1/src/commands/wallet/import.ts)_
