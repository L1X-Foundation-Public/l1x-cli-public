import {Args, Command, Flags} from '@oclif/core'
import ConfigService from '../../services/ConfigService.js'
import { L1XProvider } from '@l1x/l1x-wallet-sdk'

export default class TxReceipt extends Command {
  static override args = {
    tx_hash: Args.string({description: 'L1X TX Hash',required: true}),
  }

  static override description = 'Fetches the receipt of a transaction specified by its hash.'

  static override examples = [
    '<%= config.bin %> <%= command.id %> <tx_hash>',
  ]

  static override flags = {
    endpoint: Flags.string({description: 'L1X Endpoint',default: ConfigService.defaultL1XEndpoint})
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(TxReceipt)

    const endpoint = flags.endpoint;
    const txHash = args.tx_hash.toLowerCase();

    let l1xProvider = new L1XProvider({
      endpoint: endpoint,
      clusterType:"mainnet"
    });
    
    
    try
    {
      let txReceipt = await l1xProvider.core.getTransactionReceipt({
        hash: txHash
      });

      this.log("Transaction Receipt: ");
      this.log(`-----------------------------------------------------------------------`);

      this.logJson(txReceipt);
    }
    catch(error){
      throw new Error('An error occurred while fetching transaction receipt. Please try again.');
    }

  }
}
