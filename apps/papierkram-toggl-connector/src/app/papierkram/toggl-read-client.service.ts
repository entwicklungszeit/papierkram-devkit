import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TimeFrame } from '../utils/time-frame'
import { TogglTimeEntry } from './importers/toggl/types/toggl-time-entry'

@Injectable()
export class TogglReadClient {
  #logger = new Logger(TogglReadClient.name)

  constructor(private readonly config: ConfigService) {
    console.log(config)
  }

  readTimeEntries(timeFrame: TimeFrame): Promise<TogglTimeEntry[]> {
    this.#logger.log(this.config.get('toggl_api_url'))
    return Promise.resolve([])
  }
}
