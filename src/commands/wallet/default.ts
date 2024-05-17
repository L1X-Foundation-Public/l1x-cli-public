import {Args, Command, Flags} from '@oclif/core'
import WalletService from '../../services/WalletService.js'

export default class WalletDefault extends Command {
  static override args = {
    address: Args.string({description: 'The address of the wallet to set as default.', required: true}),
  }

  static override description = 'Set the default wallet for L1X.'

  static override examples = [
    '<%= config.bin %> <%= command.id %> <address>',
  ]

  static override flags = {
    // flag with no value (-f, --force)
    // force: Flags.boolean({char: 'f'}),
    // flag with a value (-n, --name=VALUE)
    // name: Flags.string({char: 'n', description: 'name to print'}),
  }

  public async run(): Promise<void> {
    const {args} = await this.parse(WalletDefault)

    // Validate Wallet Address
    if(!WalletService.isValidAddress(args.address)){
      throw new Error('Invalid Wallet Address');
    }


    let defautResponse = await WalletService.setDefaultWallet(args.address);
    if(defautResponse.hasError){
      throw new Error(defautResponse.message);
    }

    this.log(`Default Wallet set to ${args.address}`);
  }
}
