import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'

import { TogglTimeEntry } from './types/toggl-time-entry'
import { TogglApiConfig } from './toggl-api-config.service'
import { TimeFrame } from '../utils/time-frame'
import { toDateOnly } from '../utils/to-date-only'

@Injectable()
export class TogglReadClient {
  private logger = new Logger(TogglReadClient.name)

  constructor(
    private readonly httpClient: HttpService,
    private readonly config: TogglApiConfig
  ) {}

  async readTimeEntries(timeFrame: TimeFrame): Promise<TogglTimeEntry[]> {
    const { from, to } = toDateOnly(timeFrame)

    try {
      const response = await this.httpClient.axiosRef.get<TogglTimeEntry[]>(
        `${this.config.apiUrl}/me/time_entries?start_date=${from}&end_date=${to}`,
        {
          auth: {
            username: this.config.username,
            password: this.config.password
          }
        }
      )

      return response.data
    } catch (error) {
      this.logger.error(error)
      return []
    }
  }
}
