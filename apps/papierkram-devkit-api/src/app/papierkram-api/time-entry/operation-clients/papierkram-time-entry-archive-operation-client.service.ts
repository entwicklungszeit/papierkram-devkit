import { Injectable } from '@nestjs/common'
import { PapierkramTimeEntryOperationClient } from '../papierkram-time-entry-operation-client'
import { PapierkramImportOperation } from '@papierkram/api'
import { HttpService } from '@nestjs/axios'
import { PapierkramApiConfig } from '../papierkram-api-config.service'
import { PapierkramImportOperationError } from '../papierkram-import-operation.error'

@Injectable()
export class PapierkramTimeEntryDeleteOperationClient
  implements PapierkramTimeEntryOperationClient
{
  constructor(
    private httpClient: HttpService,
    private config: PapierkramApiConfig
  ) {}

  execute(operation: PapierkramImportOperation): Promise<void> {
    if (operation.type !== 'archive')
      return Promise.reject(
        PapierkramImportOperationError.create('not suitable')
      )

    return this.httpClient.axiosRef.post(
      `${this.config.apiUrl}/tracker/time_entries/${operation.timeEntryId}`,
      null,
      {
        headers: {
          Accept: 'application/json', // without papierkram-api yields 406 Not Acceptable
          Authorization: `Bearer ${this.config.apiToken}`
        }
      }
    )
  }
}
