import {Args, Command, Flags} from '@oclif/core'
import ConfigService from '../../services/ConfigService.js'
import { readFile } from 'fs/promises';
import { L1XProvider } from '@l1x/l1x-wallet-sdk'
import { addZeroPrefix, removeZeroPrefix } from '../../utils/address.js';
import WalletService from '../../services/WalletService.js';
import { retryTransaction } from '../../utils/tx.js';

export default class ContractView extends Command {
  static override args = {
    contract_address: Args.string({description: 'L1X VM Contract Address', required: true}),
    function: Args.string({description: 'Contract Function to be called', required: true}),
  }

  static override description = 'Calls a Readonly Function on an L1X VM Contract.'

  static override examples = [
    '<%= config.bin %> <%= command.id %> <contract_address> <function>',
  ]

  static override flags = {
    args: Flags.string({description:"JSON Arguments to pass to contract" , required:true, default:"{}"}),
    endpoint: Flags.string({description: 'L1X Endpoint',default: ConfigService.defaultL1XEndpoint}),
    from: Flags.string({description: 'L1X Wallet Address'})
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(ContractView)

    let fromAddress = addZeroPrefix(flags.from || "");
    let endpoint = flags.endpoint;
    let viewArgs = flags.args || "{}";
    



    let contractAddress = args.contract_address;
    let contractFunction = args.function;
    let senderPrivateKey = null;

    // Create L1X Provider
    const l1xProvider = new L1XProvider({
      endpoint: endpoint,
      clusterType:"mainnet"
    });

    // Parse Arguments
    try
    {
        viewArgs = JSON.parse(viewArgs);
    }
    catch(error){
      throw new Error("Invalid JSON Arguments");
    }


    // Check if from_address is valid
    if(fromAddress.length > 0 && !WalletService.isValidAddress(fromAddress)){
      throw new Error('Invalid Sender L1X Wallet Address');
    }

    // Check if contract address is valid
    if(!WalletService.isValidAddress(contractAddress)){
      throw new Error('Invalid Contract Address');
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


    try
    {
      // Intialize Contrac
      const readOnlyResponse = await l1xProvider.vm.makeReadOnlyCall({
            attrib:{
                contract_address: contractAddress,
                function: contractFunction,
                arguments: viewArgs
            }
        });

      this.log("Response: ");
      this.log(`-----------------------------------------------------------------------`);

      this.logJson(readOnlyResponse);
    }
    catch(error:any){
        this.log("Error: ", error.message);
      throw new Error('Error occured while calling contract function, Please try again');
    }

  }
}
