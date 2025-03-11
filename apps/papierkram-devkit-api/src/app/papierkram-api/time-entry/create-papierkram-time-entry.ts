import { PapierkramTimeEntry } from '../types/papierkram-time-entry'

export function createPapierkramTimeEntry(
  props: PapierkramTimeEntry
): PapierkramTimeEntry {
  return { ...props }
}
