import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'

import { TimeFrame } from '../../utils/time-frame'
import { toDateOnly } from '../../utils/to-date-only'
import { PapierkramTimeEntry } from '../types/papierkram-time-entry'
import { PapierkramApiConfig } from './papierkram-api-config.service'

import { AxiosResponse } from 'axios'
import { ResultAsync } from 'typescript-functional-extensions'
@Injectable()
export class PapierkramTimeEntryReadClient {
  private logger = new Logger('PapierkramTimeEntryReadClient')

  constructor(
    private httpClient: HttpService,
    private config: PapierkramApiConfig
  ) {}

  readTimeEntries(timeFrame: TimeFrame): ResultAsync<PapierkramTimeEntry[]> {
    return ResultAsync.from(this.getTimeEntries.apply(this, [timeFrame]))
      .mapError(error =>
        error instanceof Error
          ? error.message
          : '[Papierkram API]: Could not read time entries.'
      )
      .map(response => response.data)
      .ensure(
        response => !response.hasMore,
        'Not Supported, yet - Not all time entries could be loaded within one request. Please shrink the time range to get fewer results in order to be able to compare time entries safely.'
      )
      .map(response => response.entries)
      .tapFailure(reason => this.logger.error(reason))
  }

  private getTimeEntries(timeFrame: TimeFrame): Promise<
    AxiosResponse<{
      entries: PapierkramTimeEntry[]
      hasMore: boolean
    }>
  > {
    const { from, to } = toDateOnly(timeFrame)

    return this.httpClient.axiosRef.get<{
      entries: PapierkramTimeEntry[]
      hasMore: boolean
    }>(`${this.config.apiUrl}/tracker/time_entries`, {
      params: {
        projectId: this.config.projectId,
        start_time_range_start: from,
        start_time_range_end: to
      },
      headers: {
        Accept: 'application/json', // without papierkram-api yields 406 Not Acceptable
        Authorization: `Bearer ${this.config.apiToken}`
      }
    })
  }
}
