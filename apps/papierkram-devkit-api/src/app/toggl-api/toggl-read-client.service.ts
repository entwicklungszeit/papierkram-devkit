import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'

import { AxiosResponse } from 'axios'
import { ResultAsync } from 'typescript-functional-extensions'
import { TimeFrame } from '../utils/time-frame'
import { toDateOnly } from '../utils/to-date-only'
import { TogglApiConfig } from './toggl-api-config.service'
import { TogglTimeEntry } from './types/toggl-time-entry'

@Injectable()
export class TogglReadClient {
  private logger = new Logger(TogglReadClient.name)

  constructor(
    private readonly httpClient: HttpService,
    private readonly config: TogglApiConfig
  ) {}

  readTimeEntries(timeFrame: TimeFrame): ResultAsync<TogglTimeEntry[]> {
    return ResultAsync.from(this.getTimeEntries.apply(this, [timeFrame]))
      .mapError(error =>
        error instanceof Error
          ? error.message
          : '[Toggl API]: Could not read time entries.'
      )
      .map(response => response.data)
      .tapFailure(reason => this.logger.error(reason))
  }

  private getTimeEntries(
    timeFrame: TimeFrame
  ): Promise<AxiosResponse<TogglTimeEntry[]>> {
    const { from, to } = toDateOnly(timeFrame)

    return this.httpClient.axiosRef.get<TogglTimeEntry[]>(
      `${this.config.apiUrl}/me/time_entries`,
      {
        params: {
          start_date: from,
          end_date: to
        },
        auth: {
          username: this.config.username,
          password: this.config.password
        }
      }
    )
  }
}
