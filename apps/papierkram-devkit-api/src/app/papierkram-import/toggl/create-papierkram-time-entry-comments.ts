import { TogglTimeEntry } from '@toggl/api'
import { TogglMetaForPapierkram } from './types/toggl-meta-for-papierkram'

export function createPapierkramTimeEntryComments(
  props: Partial<TogglTimeEntry>,
  seperator = '\n\n---\n\n'
): string {
  const meta = {
    meta: <TogglMetaForPapierkram>{ toggl: { timeEntry: { id: props.id } } }
  }

  return !props.description && !props.id
    ? ''
    : `${props.description || ''}${seperator}${JSON.stringify(meta)}`
}
