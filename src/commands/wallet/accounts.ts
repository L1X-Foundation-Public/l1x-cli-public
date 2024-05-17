import {Args, Command, Flags} from '@oclif/core'
import WalletService, { L1XWalletType } from '../../services/WalletService.js'

export default class WalletAccounts extends Command {
  static override args = {
    // file: Args.string({description: 'file to read'}),
  }

  static override description = 'List all available accounts in the wallet'

  static override examples = [
    // '<%= config.bin %> <%= command.id %>',
  ]

  static override flags = {
    // flag with no value (-f, --force)
    // force: Flags.boolean({char: 'f'}),
    // flag with a value (-n, --name=VALUE)
    // name: Flags.string({char: 'n', description: 'name to print'}),
  }

  public async run(): Promise<void> {
    
    let walletStore = await WalletService.getAllWallets();

    if(walletStore.hasError){
      throw new Error(walletStore.message);
    }

    if(walletStore.data.length === 0){
      throw new Error('No wallet found. Please create a wallet first.');
    }
      
    this.log('Available accounts in the wallet:');
    this.log('---------------------------------');

    for(let wallet of walletStore.data){

      
      this.log(`Account Private Key: ${wallet.privateKey}`);
      this.log(`Account Address: ${wallet.address}`);
      this.log('---------------------------------');
    }
    
  }
}
