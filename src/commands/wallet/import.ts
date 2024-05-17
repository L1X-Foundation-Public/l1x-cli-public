import {Args, Command, Flags} from '@oclif/core'
import Wallet from 'ethereumjs-wallet'
import WalletService, { L1XWalletType } from '../../services/WalletService.js'
import { removeZeroPrefix } from '../../utils/address.js'

export default class WalletImport extends Command {
  static override args = {
    // file: Args.string({description: 'file to read'}),
    privateKey: Args.string({description: 'The private key to import in hex format.', required: true })
  }

  static override description = 'Import a wallet by providing its private key.'

  static override examples = [
    '<%= config.bin %> <%= command.id %> <privateKey>',
  ]

  static override flags = {
    // flag with no value (-f, --force)
    // force: Flags.boolean({char: 'f'}),
    // flag with a value (-n, --name=VALUE)
    // privateKey: Flags.string({description: 'The private key to import in hex format.', required: true, }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(WalletImport)

    // Check if private key length is valid
    const privateKey = removeZeroPrefix(args.privateKey);
    
    if(privateKey.length != 64){
      // this.logToStderr("Invalid Private Key Length");
      // return;
      throw new Error("Invalid Private Key Length");
    }

    
    // Import Wallet
    
    let wallet:L1XWalletType = WalletService.getWalletByPrivateKey(privateKey);
    let _response = await WalletService.addWallet(wallet);

    // Log Response
    if(_response.hasError){
      // this.logToStderr(_response.message);
      throw new Error(_response.message);
    }
    else
    {
      this.log("Wallet Imported Successfully");
      this.logJson({
        address: wallet.address,
        privateKey: wallet.privateKey
      });
    }
    

  }

}
