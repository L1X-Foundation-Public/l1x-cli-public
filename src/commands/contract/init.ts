import {Args, Command, Flags} from '@oclif/core'
import ConfigService from '../../services/ConfigService.js'
import { L1XProvider } from '@l1x/l1x-wallet-sdk'
import { addZeroPrefix, removeZeroPrefix } from '../../utils/address.js';
import WalletService from '../../services/WalletService.js';
import { retryTransaction } from '../../utils/tx.js';

export default class ContractInit extends Command {
  static override args = {
    contract_address: Args.string({description: 'L1X VM Base Contract Address', required: true}),
  }

  static override description = 'Initialize an L1X VM Contract Address.'

  static override examples = [
    '<%= config.bin %> <%= command.id %> <contract_address>',
  ]

  static override flags = {
    args: Flags.string({description:"JSON Arguments to pass to contract" , required:true, default:"{}"}),
    endpoint: Flags.string({description: 'L1X Endpoint',default: ConfigService.defaultL1XEndpoint}),
    from: Flags.string({description: 'L1X Wallet Address'}),
    fee_limit : Flags.string({description: 'Maximum fee allowed for the transaction', default: ConfigService.defaultFeeLimit}),
    nonce: Flags.string({description:"Nonce value for the transaction"}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(ContractInit)

    let nonce = parseInt(flags.nonce || "0");
    let fromAddress = addZeroPrefix(flags.from || "");
    let endpoint = flags.endpoint;
    let feeLimit = parseFloat(flags.fee_limit);
    let initArgs = flags.args || "{}";
    



    let baseContractAddress = args.contract_address;
    let senderPrivateKey = null;

    // Create L1X Provider
    const l1xProvider = new L1XProvider({
      endpoint: endpoint,
      clusterType:"mainnet"
    });

    // Parse Arguments
    try
    {
      initArgs = JSON.parse(initArgs);
    }
    catch(error){
      throw new Error("Invalid JSON Arguments");
    }



    // Check if amount is valid
    if(isNaN(nonce) || nonce < 0){
      throw new Error('Invalid Nonce');
    }

    // Check if from_address is valid
    if(fromAddress.length > 0 && !WalletService.isValidAddress(fromAddress)){
      throw new Error('Invalid Sender L1X Wallet Address');
    }

    // Check if contract address is valid
    if(!WalletService.isValidAddress(baseContractAddress)){
      throw new Error('Invalid Base Contract Address');
    }
    
    // Check if fee_limit is valid
    if(isNaN(feeLimit) || feeLimit <= 0){
      throw new Error('Invalid Fee Limit, Must be greater than 0');
    }

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




    
    this.log(`Initializing Contract from=${fromAddress}, nonce=${nonce}, fee_limit=${feeLimit}, endpoint=${endpoint}`);
    this.log(`-----------------------------------------------------------------------`);

    try
    {
      // Intialize Contract
      const _initResponse = await l1xProvider.vm.init({
        attrib:{
          base_contract_address: baseContractAddress,
          arguments: initArgs
        },
        private_key: removeZeroPrefix(senderPrivateKey),
        // nonce: nonce, TODO: Add Support for nonce in Contract > Init
        fee_limit: feeLimit
      });



      let _txResponse = await retryTransaction(async () => {
          return l1xProvider.core.getTransactionReceipt({
              hash: _initResponse.hash
          });
      },5);

      
      // Log Transaction Receipt
      this.log("Transaction Receipt:");
      this.log(`-----------------------------------------------------------------------`);
      this.logJson(_txResponse);

      // Log Successful Initialization
      this.log("Contract Initialized Successfully:");
      this.log(`-----------------------------------------------------------------------`);
      this.logJson(_initResponse);
    }
    catch(error:any){
      throw new Error('Error occured while initializing contract, Please try again');
    }

  }
}
