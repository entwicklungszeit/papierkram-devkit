import { TogglTimeEntry } from '../../../toggl-api/types/toggl-time-entry'

export type TogglMetaForPapierkram = {
  toggl: { timeEntry: Pick<TogglTimeEntry, 'id'> }
}
