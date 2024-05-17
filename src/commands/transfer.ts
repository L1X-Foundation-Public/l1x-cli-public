import {Args, Command, Flags} from '@oclif/core'
import ConfigService from '../services/ConfigService.js'
import WalletService from '../services/WalletService.js'
import { L1XProvider} from "@l1x/l1x-wallet-sdk"
import { addZeroPrefix, removeZeroPrefix } from '../utils/address.js'
import { retryTransaction } from '../utils/tx.js'

export default class Transfer extends Command {
  static override args = {
    to_address: Args.string({description: 'Receiver L1X Wallet Address', required: true}),
    amount: Args.string({description: 'Amount of L1X tokens to be sent (e.g., 1 L1X)',required: true}),
  }

  static override description = 'Transfer L1X tokens to another wallet'
  static override examples = [
    '<%= config.bin %> <%= command.id %> <to_address> <amount>',
  ]

  static override flags = {
    nonce: Flags.string({description:"Nonce to be used for the transaction"}),
    from: Flags.string({description: 'Sender L1X Wallet Address'}),
    fee_limit : Flags.string({description: 'Maximum fee allowed for the transaction', default: ConfigService.defaultFeeLimit}),
    endpoint: Flags.string({description: 'L1X Endpoint',default: ConfigService.defaultL1XEndpoint})
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Transfer)

    let toAddress = args.to_address;
    let amount = parseFloat(args.amount);
    let amountDecimalized:number = 0;

    let nonce = parseInt(flags.nonce || "0");
    let fromAddress = addZeroPrefix(flags.from || "");
    let endpoint = flags.endpoint;
    let feeLimit = parseFloat(flags.fee_limit);

    let senderPrivateKey = null;

    let l1xProvider = new L1XProvider({
      endpoint: endpoint,
      clusterType:"mainnet"
    })

    // Check if to_address is valid
    if(!WalletService.isValidAddress(toAddress)){
      throw new Error('Invalid receiver L1X wallet address');
    }
    
    // Check if amount is valid
    if(isNaN(nonce) || nonce < 0){
      throw new Error('Invalid Nonce');
    }

    if(fromAddress.length > 0 && !WalletService.isValidAddress(fromAddress)){
      throw new Error('Invalid Sender L1X Wallet Address');
    }

    // Check if amount is valid
    if(isNaN(amount) || amount <= 0){
      throw new Error('Invalid Amount, Must be greater than 0');
    }


    // Check if fee_limit is valid
    if(isNaN(feeLimit) || feeLimit <= 0){
      throw new Error('Invalid Fee Limit, Must be greater than 0');
    }

     

    // Convert to decimalized amount and floor it
    amountDecimalized = (amount * (10 ** ConfigService.defaultL1XDecimal));
    amountDecimalized = Math.floor(amountDecimalized);


    // Check if from is empty and get default wallet
    if(fromAddress.length == 0){
      let defaultResponse = await WalletService.getDefaultWallet();
      if(defaultResponse.hasError){
        throw new Error(defaultResponse.message);
      }

      let walletResponse = await WalletService.getWalletByAddress(defaultResponse.data);
      if(walletResponse.hasError){
        throw new Error("Unable to get wallet by address, Please import wallet first");
      }

      // Set Private Key
      senderPrivateKey = walletResponse.data.privateKey;


      fromAddress = defaultResponse.data;

      this.log("Using Default Wallet Address: " + fromAddress);
    }
    else
    {
      // Check if from address is present is wallet store
      let walletResponse = await WalletService.getWalletByAddress(fromAddress);
      if(walletResponse.hasError){
        throw new Error("Unable to get wallet by address, Please import wallet first");
      }

      // Set Private Key
      senderPrivateKey = walletResponse.data.privateKey;
    }


    // Check if from is valid
    if(!WalletService.isValidAddress(fromAddress)){
      throw new Error('Invalid Sender L1X Wallet Address');
    }


    // Check Balance of Sender
    try
    {
      const accountStateResponse = await l1xProvider.core.getAccountState({
        address: removeZeroPrefix(fromAddress)
      });

      if(parseInt(accountStateResponse.account_state.balance) < amountDecimalized){
        throw new Error('Insufficient Balance');
      }
    }
    catch(error){
      throw new Error('Error occured while checking balance for adderess '+fromAddress+', Please try again');
    }



    // Check if nonce is zero, fallback to default
    if(nonce == 0){
      
      try
      {
        let currentNonce = await l1xProvider.core.getCurrentNonce({
          address: removeZeroPrefix(fromAddress)
        });
  
        // Increment nonce
        nonce = currentNonce + 1;
      }
      catch(error){
        throw new Error('Error occured while getting nonce, Please try again');
      }
    }


    this.log(`Transferring ${amount} L1X to ${toAddress}, using endpoint ${endpoint}`);
    this.log(`-----------------------------------------------------------------------`);
    try
    {
      const transferPayload = await l1xProvider.core.getSignedPayloadForTransfer({
        receipient_address: removeZeroPrefix(toAddress),
        value: amountDecimalized,
        nonce: nonce,
        private_key: removeZeroPrefix(senderPrivateKey),
        fee_limit: feeLimit
      });
      

      const transferHash = await l1xProvider.core.broadcastTransaction(transferPayload);
      this.log(`Transfer Hash: ${transferHash.hash}`);
      
      let _response = await retryTransaction(async () => {
          return l1xProvider.core.getTransactionReceipt({
              hash: transferHash.hash
          });
      },5);

      this.log(`-----------------------------------------------------------------------`);
      this.log(" Transaction Receipt: ");
      this.log(`-----------------------------------------------------------------------`);
      this.logJson(_response);


    }
    catch(error:any){
      this.log(error.message);
      throw new Error('Error occured while transferring L1X');
    }

  }
}
