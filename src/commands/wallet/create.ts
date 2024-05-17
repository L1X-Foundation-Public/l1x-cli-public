import {Args, Command, Flags} from '@oclif/core'
import Wallet from 'ethereumjs-wallet'
import WalletService from '../../services/WalletService.js'


export default class WalletCreate extends Command {
  static override args = {
    // file: Args.string({description: 'file to read'}),
  }

  static override description = 'Creates a new wallet/account by generating a new key pair.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static override flags = {
    // flag with no value (-f, --force)
    // force: Flags.boolean({char: 'f'}),
    // flag with a value (-n, --name=VALUE)
    // name: Flags.string({char: 'n', description: 'name to print'}),
  }

  public async run(): Promise<void> {

    const wallet = Wallet.default.generate()
    // const {args, flags} = await this.parse(WalletCreate)

    // Add Wallet
    let _response = await WalletService.addWallet({
      address: wallet.getAddressString(),
      privateKey: wallet.getPrivateKeyString()
    });

    // Log Response
    if(_response.hasError){
      throw new Error(_response.message);
    }
    else
    {
      this.log("Wallet Created Successfully");
      this.logJson({
        address: wallet.getAddressString(),
        privateKey: wallet.getPrivateKeyString()
      });
    }

  }
}
