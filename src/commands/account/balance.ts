import {Args, Command, Flags} from '@oclif/core'
import WalletService from '../../services/WalletService.js'
import ConfigService from '../../services/ConfigService.js'
import { L1XProvider} from "@l1x/l1x-wallet-sdk"

export default class AccountBalance extends Command {
  static override args = {
    address: Args.string({description: 'L1X Wallet Address'}),
  }

  static override description = 'Retrieve the balance of an L1X Wallet.'

  static override examples = [
    '<%= config.bin %> <%= command.id %> <address>',
  ]

  static override flags = {
    endpoint: Flags.string({description: 'L1X Endpoint',default: ConfigService.defaultL1XEndpoint}),
    // flag with no value (-f, --force)
    // force: Flags.boolean({char: 'f'}),
    // flag with a value (-n, --name=VALUE)
    // name: Flags.string({char: 'n', description: 'name to print'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(AccountBalance)

    let walletAddress: string = args.address == null ? "" : args.address;


    // Get Default Wallet
    if(walletAddress.length == 0){
      let defaultResponse = await WalletService.getDefaultWallet();
      if(defaultResponse.hasError){
        throw new Error(defaultResponse.message);
      }
      walletAddress = defaultResponse.data;
    }


    // Validate Wallet Address,
    if(!WalletService.isValidAddress(walletAddress)){
      throw new Error('Invalid Wallet Address');
    }

    // Remove 0x from address
    walletAddress = walletAddress.replace("0x", "");

    this.log(`Retrieving balance for wallet ${walletAddress}, using endpoint ${flags.endpoint}`);
    this.log(`-----------------------------------------------------------------------`);
    try
    {
      const l1xProvider = new L1XProvider({
        endpoint: flags.endpoint,
        clusterType:"mainnet"
      });
      
      const accountStateResponse = await l1xProvider.core.getAccountState({
        address: walletAddress
      });
      
      this.log(`Balance (in nL1X): ${accountStateResponse.account_state.balance}`);
      this.log(`Balance (Formatted): ${accountStateResponse.account_state.balance_formatted}`);
    }
    catch(error:any){
      throw new Error('Error occured while retrieving balance');
    }


    
  }
}
