import { Inject, Injectable } from '@nestjs/common'
import { PapierkramTimeEntryOperationClient } from './papierkram-time-entry-operation-client'
import { PapierkramTimeEntryOperationClientToken } from './papierkram-time-entry-operation-client.token'
import { PapierkramImportOperation } from '@papierkram/api'

@Injectable()
export class PapierkramTimeEntryImporter
  implements PapierkramTimeEntryOperationClient
{
  constructor(
    @Inject(PapierkramTimeEntryOperationClientToken)
    private clients: PapierkramTimeEntryOperationClient[]
  ) {}

  async execute(operation: PapierkramImportOperation): Promise<void> {
    for (const client of this.client()) {
      try {
        await client.execute(operation)
        return
      } catch {
        // try next client on error
      }
    }

    return Promise.reject(new Error('No suitable client has been executed'))
  }

  private *client() {
    for (const client of this.clients) {
      yield client
    }
  }
}
