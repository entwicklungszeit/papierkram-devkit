import { Injectable } from '@nestjs/common'
import { TimeFrame } from '../utils/time-frame'
import { PapierkramTimeEntry } from './types/papierkram-time-entry'
import { AxiosResponse } from 'axios'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { toDateOnly } from '../utils/to-date-only'

@Injectable()
export class PapierkramReadClient {
  private options = {
    apiUrl: '',
    apiToken: '',
    projectId: '',
    userId: '',
    taskId: ''
  }

  constructor(private config: ConfigService, private httpClient: HttpService) {
    this.options.apiUrl = this.config.get<string>('papierkram_api_url') ?? ''
    this.options.apiToken =
      this.config.get<string>('papierkram_api_token') ?? ''
    this.options.projectId =
      this.config.get<string>('papierkram_project_id') ?? ''
    this.options.userId = this.config.get<string>('papierkram_user_id') ?? ''
    this.options.taskId = this.config.get<string>('papierkram_task_id') ?? ''
  }
  async readTimeEntries(timeFrame: TimeFrame): Promise<PapierkramTimeEntry[]> {
    const { from, to } = toDateOnly(timeFrame)
    const response = await this.httpClient.axiosRef.get<{
      entries: PapierkramTimeEntry[]
    }>(
      `${this.options.apiUrl}/tracker/time_entries?project_id=${this.options.projectId}&start_time_range_start=${from}&start_time_range_end=${to}`,
      {
        headers: {
          Accept: 'application/json', // without papierkram-api yields 406 Not Acceptable
          Authorization: `Bearer ${this.options.apiToken}`
        }
      }
    )

    return response.data.entries
  }
}
