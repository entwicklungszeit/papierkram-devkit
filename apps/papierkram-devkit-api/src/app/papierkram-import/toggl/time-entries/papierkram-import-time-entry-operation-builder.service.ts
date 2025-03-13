import { Injectable } from '@nestjs/common'
import { TogglTimeEntry } from '@toggl/api'
import { PapierkramTimeEntry, PapierkramImportOperation } from '@papierkram/api'
import { determinePapierkramImportOperations } from './determine-papierkram-import-operations'
import { parseTogglMetaFromPapierkramTimeEntryComments } from './parse-toggl-meta-from-papierkram-time-entry.comments'

@Injectable()
export class PapierkramTimeEntryOperationBuilder {
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
