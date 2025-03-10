import { Injectable } from '@nestjs/common'
import { PapierkramTimeEntryOperationClient } from './papierkram-time-entry-operation-client'
import { PapierkramImportOperation } from '@papierkram/api'
import { HttpService } from '@nestjs/axios'
import { PapierkramApiConfig } from './papierkram-api-config.service'

@Injectable()
export class PapierkramTimeEntryCreateOperationClient
  implements PapierkramTimeEntryOperationClient
{
  constructor(
    private httpClient: HttpService,
    private config: PapierkramApiConfig
  ) {}

  execute(operation: PapierkramImportOperation): Promise<void> {
    if (operation.type !== 'create') return Promise.reject()

    return this.httpClient.axiosRef.post(
      `${this.config.apiUrl}/tracker/time_entries`,
      {
        ...operation.payload,
        task: {
          id: this.config.taskId
        },
        user: {
          id: this.config.userId
        }
      },
      {
        headers: {
          Accept: 'application/json', // without papierkram-api yields 406 Not Acceptable
          Authorization: `Bearer ${this.config.apiToken}`
        }
      }
    )
  }
}
