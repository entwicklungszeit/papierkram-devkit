import { PapierkramTimeEntry } from '@papierkram/api'
import { PapierkramTimeEntryImportedFromToggl } from './types/papierkram-time-entry-imported-from-toggl'
import { jsonFromString } from '../../../utils/json-from-string'
import { hasOwnProperty } from '../../../utils/has-own-property'

export function parseTogglMetaFromPapierkramTimeEntryComments(
  timeEntry: PapierkramTimeEntry
): PapierkramTimeEntryImportedFromToggl | null {
  const candidate = jsonFromString(timeEntry.comments)

  if (!containsTogglImportInformation(candidate)) {
    return null
  }

  return { ...timeEntry, meta: candidate.meta }
}

function containsTogglImportInformation(
  candidate: unknown
): candidate is PapierkramTimeEntryImportedFromToggl {
  if (typeof candidate !== 'object') {
    return false
  }

  return (
    hasOwnProperty(candidate, 'meta') &&
    hasOwnProperty(candidate.meta, 'toggl') &&
    hasOwnProperty(candidate.meta.toggl, 'timeEntry')
  )
}
