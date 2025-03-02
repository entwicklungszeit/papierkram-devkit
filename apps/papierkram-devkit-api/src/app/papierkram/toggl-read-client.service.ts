import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'
import { TimeFrame } from '../utils/time-frame'
import { TogglTimeEntry } from './importers/toggl/types/toggl-time-entry'
import { formatDate } from 'date-fns'
import { AxiosResponse } from 'axios'

function toDateOnly(timeFrame: TimeFrame) {
  return {
    from: formatDate(timeFrame.from, 'yyyy-MM-dd'),
    to: formatDate(timeFrame.to, 'yyyy-MM-dd')
  }
}

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
    this.logger.log(this.config.get('toggl_api_url'))
    return this.httpClient.axiosRef.get(
      `${this.options.apiUrl}/me/time_entries?from=${from}&to=${to}`,
      {
        auth: {
          username: this.options.username,
          password: this.options.password
        }
      }
    )
  }
}
