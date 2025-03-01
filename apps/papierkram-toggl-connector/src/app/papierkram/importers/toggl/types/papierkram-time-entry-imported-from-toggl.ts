import { PapierkramTimeEntry } from '../../../types/papierkram-time-entry'
import { TogglMetaForPapierkram } from './toggl-meta-for-papierkram'

export type PapierkramTimeEntryImportedFromToggl = PapierkramTimeEntry & {
  meta: TogglMetaForPapierkram
}
