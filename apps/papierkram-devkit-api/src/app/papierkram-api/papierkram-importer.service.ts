import { Injectable } from '@nestjs/common'
import {
  PapierkramImportOperation,
  PapierkramTimeEntryCreateOperation
} from './types/papierkram-import-operation'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'

@Injectable()
export class PapierkramImporter {
  private options = {
    apiUrl: '',
    apiToken: '',
    projectId: '',
    userId: 0,
    taskId: 0
  }

  constructor(private config: ConfigService, private httpClient: HttpService) {
    this.options.apiUrl = this.config.get<string>('papierkram_api_url') ?? ''
    this.options.apiToken =
      this.config.get<string>('papierkram_api_token') ?? ''
    this.options.projectId =
      this.config.get<string>('papierkram_project_id') ?? ''
    this.options.userId = +(this.config.get<string>('papierkram_user_id') ?? 0)
    this.options.taskId = +(this.config.get<number>('papierkram_task_id') ?? 0)
  }

  async import(importOperations: PapierkramImportOperation[]) {
    const createOperations = importOperations.filter(
      (operation): operation is PapierkramTimeEntryCreateOperation =>
        operation.type === 'create'
    )

    for (const operation of createOperations) {
      await this.httpClient.axiosRef.post(
        `${this.options.apiUrl}/tracker/time_entries`,
        {
          ...operation.payload,
          task: {
            id: this.options.taskId
          },
          user: {
            id: this.options.userId
          }
        },
        {
          headers: {
            Accept: 'application/json', // without papierkram-api yields 406 Not Acceptable
            Authorization: `Bearer ${this.options.apiToken}`
          }
        }
      )
    }
  }
}
