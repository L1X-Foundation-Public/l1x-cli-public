import {Args, Command, Flags} from '@oclif/core'
import ConfigService from '../../services/ConfigService.js'
import { L1XProvider } from '@l1x/l1x-wallet-sdk'

export default class TxEvents extends Command {
  static override args = {
    tx_hash: Args.string({description: 'L1X TX Hash',required: true}),
  }

  static override description = 'Fetches the events of a transaction specified by its hash.'

  static override examples = [
    '<%= config.bin %> <%= command.id %> <tx_hash>',
  ]

  static override flags = {
    endpoint: Flags.string({description: 'L1X Endpoint',default: ConfigService.defaultL1XEndpoint})
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(TxEvents)

    const endpoint = flags.endpoint;
    const txHash = args.tx_hash.toLowerCase();

    let l1xProvider = new L1XProvider({
      endpoint: endpoint,
      clusterType:"mainnet"
    });
    
    
    try
    {
      let txEvents = await l1xProvider.core.getEvents({
        tx_hash: txHash,
        timestamp: 0
      });

      this.log("Transaction Events: ");
      this.log(`-----------------------------------------------------------------------`);

      this.logJson(txEvents);
    }
    catch(error){
      throw new Error('An error occurred while fetching transaction events. Please try again.');
    }

  }
}
