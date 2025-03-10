import { Inject, Injectable } from '@nestjs/common'
import { PapierkramTimeEntryOperationClient } from './papierkram-time-entry-operation-client'
import { PapierkramTimeEntryOperationClientToken } from './papierkram-time-entry-operation-client.token'
import { PapierkramImportOperation } from '@papierkram/api'

/*
 *  Strategy Pattern Exploration
 *  This service implements the strategy pattern.
 *  However, this is considered a nice try but is not the perfect solution.
 *  Goal: Embrace NestJS's IoC to resolve the needed strategy
 *  Implementation:
 *  - This service iterates over the provided services and executes them
 *  - If a service is not suitable it rejects (Promise.reject)
 *  Design-Problem
 *  - Using Promise.reject might work but now it is hard to distinguish if a network error or a insufficient service was the reason
 *  Outlook
 *  - We could use the Result-Pattern to have a better glimpse why an `execute`-call failed
 *  - We could explore the implementation of a chain of responsibility
 */
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
