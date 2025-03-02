import { Injectable } from '@nestjs/common'
import { TogglTimeEntry } from './importers/toggl/types/toggl-time-entry'
import { PapierkramTimeEntry } from './types/papierkram-time-entry'
import { PapierkramImportOperation } from './types/papierkram-import-operation'
import { determinePapierkramImportOperations } from './importers/toggl/determine-papierkram-import-operations'
import { parseTogglMetaFromPapierkramTimeEntryComments } from './importers/toggl/parse-toggl-meta-from-papierkram-time-entry.comments'

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
