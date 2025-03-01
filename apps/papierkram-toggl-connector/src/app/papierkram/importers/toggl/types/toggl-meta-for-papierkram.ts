import { TogglTimeEntry } from './toggl-time-entry'

export type TogglMetaForPapierkram = {
  toggl: { timeEntry: Pick<TogglTimeEntry, 'id'> }
}
