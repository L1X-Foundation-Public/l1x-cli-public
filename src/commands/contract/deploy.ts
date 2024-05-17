import {Args, Command, Flags} from '@oclif/core'
import ConfigService from '../../services/ConfigService.js'
import { readFile } from 'fs/promises';
import { L1XProvider } from '@l1x/l1x-wallet-sdk'
import { addZeroPrefix, removeZeroPrefix } from '../../utils/address.js';
import WalletService from '../../services/WalletService.js';
import { retryTransaction } from '../../utils/tx.js';

export default class ContractDeploy extends Command {
  static override args = {
    contract_object_file_path: Args.string({description: 'Path to the L1X VM Contract Object File', required: true}),
  }

  static override description = 'Deploy an L1X VM Contract Object file to the L1X Network.'

  static override examples = [
    '<%= config.bin %> <%= command.id %> <contract_object_file_path>',
  ]

  static override flags = {
    endpoint: Flags.string({description: 'L1X Endpoint',default: ConfigService.defaultL1XEndpoint}),
    from: Flags.string({description: 'Deployer L1X Wallet Address'}),
    fee_limit : Flags.string({description: 'Maximum fee allowed for the deployment', default: ConfigService.defaultFeeLimit}),
    nonce: Flags.string({description:"Nonce value to be used for deployment"}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(ContractDeploy)

    let nonce = parseInt(flags.nonce || "0");
    let fromAddress = addZeroPrefix(flags.from || "");
    let endpoint = flags.endpoint;
    let feeLimit = parseFloat(flags.fee_limit);
    
    let contractBuffer: Buffer;
    let senderPrivateKey = null;

    // Create L1X Provider
    const l1xProvider = new L1XProvider({
      endpoint: endpoint,
      clusterType:"mainnet"
    });

    // Check if amount is valid
    if(isNaN(nonce) || nonce < 0){
      throw new Error('Invalid Nonce');
    }

    // Check if from_address is valid
    if(fromAddress.length > 0 && !WalletService.isValidAddress(fromAddress)){
      throw new Error('Invalid Deployer L1X Wallet Address');
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

    // Get the contract object file path into buffer
    try
    {
      contractBuffer = await readFile(args.contract_object_file_path);
    }
    catch(error){
      throw new Error('Error occured while reading contract object file, Please try again');
    }


    
    this.log(`Deploying Contract from=${fromAddress}, nonce=${nonce}, fee_limit=${feeLimit}, endpoint=${endpoint}`);
    this.log(`-----------------------------------------------------------------------`);

    try
    {
      // Deploy the contract object to L1X Network
      const _deployResult = await l1xProvider.vm.deploy({
        attrib:{
          base_contract_bytes: contractBuffer
        },
        private_key: removeZeroPrefix(senderPrivateKey),
        nonce: nonce,
        fee_limit: feeLimit
      });



      let _response = await retryTransaction(async () => {
          return l1xProvider.core.getTransactionReceipt({
              hash: _deployResult.hash
          });
      },5);

      
      // Log Transaction Receipt
      this.log("Transaction Receipt:");
      this.log(`-----------------------------------------------------------------------`);
      this.logJson(_response);

      // Log Successful Deployment
      this.log("Contract Deployed Successfully:");
      this.log(`-----------------------------------------------------------------------`);
      this.logJson(_deployResult);
    }
    catch(error:any){
      throw new Error('Error occured while deploying contract object, Please try again');
    }

  }
}
