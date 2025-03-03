import { Injectable } from '@nestjs/common'
import { TogglTimeEntry } from './types/toggl-time-entry'
import { PapierkramTimeEntry } from '../papierkram-api/types/papierkram-time-entry'
import { PapierkramImportOperation } from '../papierkram-api/types/papierkram-import-operation'
import { determinePapierkramImportOperations } from './determine-papierkram-import-operations'
import { parseTogglMetaFromPapierkramTimeEntryComments } from './parse-toggl-meta-from-papierkram-time-entry.comments'

@Injectable()
export class PapierkramImportOperationBuilder {
  buildWithToggl(props: {
    togglTimeEntries: TogglTimeEntry[]
    papierkramTimeEntries: PapierkramTimeEntry[]
  }): PapierkramImportOperation[] {
    const papierkramTimeEntriesImportedFromToggl = props.papierkramTimeEntries
      .map(parseTogglMetaFromPapierkramTimeEntryComments)
      .filter(timeEntry => !!timeEntry)

    return determinePapierkramImportOperations(
      papierkramTimeEntriesImportedFromToggl,
      props.togglTimeEntries
    )
  }
}
