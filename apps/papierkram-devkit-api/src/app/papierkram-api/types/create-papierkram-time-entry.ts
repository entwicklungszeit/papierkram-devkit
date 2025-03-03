import { PapierkramTimeEntry } from './papierkram-time-entry'

export function createPapierkramTimeEntry(
  props: PapierkramTimeEntry
): PapierkramTimeEntry {
  return { ...props }
}
