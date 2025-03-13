import { Inject, Injectable, Logger } from '@nestjs/common'
import { PapierkramImportOperation } from '@papierkram/api'

import { PapierkramTimeEntryOperationClientToken } from './papierkram-time-entry-operation-client.token'
import { PapierkramTimeEntryOperationClient } from './papierkram-time-entry-operation-client'
import { PapierkramImportOperationError } from './papierkram-import-operation.error'

@Injectable()
export class PapierkramTimeEntryImporter
  implements PapierkramTimeEntryOperationClient
{
  private logger = new Logger('PapierkramTimeEntryOperationClient')

  constructor(
    @Inject(PapierkramTimeEntryOperationClientToken)
    private clients: PapierkramTimeEntryOperationClient[]
  ) {}

  async execute(operation: PapierkramImportOperation): Promise<void> {
    for (const client of this.clients) {
      try {
        await client.execute(operation)
        return
      } catch (error: unknown) {
        if (
          error instanceof PapierkramImportOperationError &&
          error.reason == 'not suitable'
        ) {
          /* tolerate that client is not suitable and try the next one */
        } else {
          this.logger.error(error)
        }
      }
    }

    return Promise.reject(
      new Error('No suitable TimeEntryOperationClient has been executed')
    )
  }
}
