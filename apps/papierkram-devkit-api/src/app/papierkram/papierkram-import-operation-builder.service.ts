import { Injectable } from '@nestjs/common'
import { TogglTimeEntry } from './importers/toggl/types/toggl-time-entry'
import { PapierkramTimeEntry } from './types/papierkram-time-entry'
import { PapierkramImportOperation } from './types/papierkram-import-operation'

@Injectable()
export class PapierkramImportOperationBuilder {
  buildWithToggl(props: {
    togglTimeEntries: TogglTimeEntry[]
    papierkramTimeEntries: PapierkramTimeEntry[]
  }): PapierkramImportOperation[] {
    return []
  }
}
