import { Injectable } from '@nestjs/common'
import { TimeFrame } from '../utils/time-frame'
import { PapierkramTimeEntry } from './types/papierkram-time-entry'

@Injectable()
export class PapierkramReadClient {
  readTimeEntries(timeFrame: TimeFrame): Promise<PapierkramTimeEntry[]> {
    return Promise.resolve([])
  }
}
