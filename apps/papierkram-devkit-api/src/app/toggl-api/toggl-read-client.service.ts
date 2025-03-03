import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'
import { TimeFrame } from '../utils/time-frame'
import { TogglTimeEntry } from './types/toggl-time-entry'
import { AxiosResponse } from 'axios'
import { toDateOnly } from '../utils/to-date-only'

@Injectable()
export class TogglReadClient {
  private logger = new Logger(TogglReadClient.name)
  private options = {
    apiUrl: '',
    username: '',
    password: '',
    projectId: ''
  }

  constructor(
    private readonly config: ConfigService,
    private readonly httpClient: HttpService
  ) {
    this.options.apiUrl = this.config.get<string>('toggl_api_url') ?? ''
    this.options.username = this.config.get<string>('toggl_api_token') ?? ''
    this.options.password =
      this.config.get<string>('toggl_api_token_label') ?? ''
    this.options.projectId = this.config.get<string>('toggl_project_id') ?? ''
  }

  readTimeEntries(
    timeFrame: TimeFrame
  ): Promise<AxiosResponse<TogglTimeEntry[]>> {
    const { from, to } = toDateOnly(timeFrame)

    return this.httpClient.axiosRef.get(
      `${this.options.apiUrl}/me/time_entries?start_date=${from}&end_date=${to}`,
      {
        auth: {
          username: this.options.username,
          password: this.options.password
        }
      }
    )
  }
}
