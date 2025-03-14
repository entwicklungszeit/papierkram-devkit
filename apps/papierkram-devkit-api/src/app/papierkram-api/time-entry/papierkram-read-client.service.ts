import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'

import { PapierkramTimeEntry } from '../types/papierkram-time-entry'
import { PapierkramApiConfig } from './papierkram-api-config.service'
import { TimeFrame } from '../../utils/time-frame'
import { toDateOnly } from '../../utils/to-date-only'

@Injectable()
export class PapierkramTimeEntryReadClient {
  private logger = new Logger('PapierkramTimeEntryReadClient')

  constructor(
    private httpClient: HttpService,
    private config: PapierkramApiConfig
  ) {}

  async readTimeEntries(timeFrame: TimeFrame): Promise<PapierkramTimeEntry[]> {
    const { from, to } = toDateOnly(timeFrame)

    try {
      const response = await this.httpClient.axiosRef.get<{
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

      if (response.data.hasMore)
        throw new Error(
          'Not Supported, yet - Not all time entries could be loaded within one request. Please shrink the time range to get fewer results in order to be able to compare time entries safely.'
        )

      return response.data.entries
    } catch (error) {
      this.logger.error(error)
      return []
    }
  }
}
