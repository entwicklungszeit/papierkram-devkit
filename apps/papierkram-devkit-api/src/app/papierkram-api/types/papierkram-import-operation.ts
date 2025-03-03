import { PapierkramTimeEntryCreateDto } from './papierkram-time-entry-create.dto'
import { PapierkramTimeEntryUpdateDto } from './papierkram-time-entry-update.dto'

export type PapierkramImportOperation =
  | PapierkramTimeEntryCreateOperation
  | PapierkramTimeEntryUpdateOperation
  | PapierkramTimeEntryArchiveOperation

export type PapierkramTimeEntryCreateOperation = {
  type: 'create'
  payload: PapierkramTimeEntryCreateDto
}

export type PapierkramTimeEntryUpdateOperation = {
  type: 'update'
  timeEntryId: number
  payload: PapierkramTimeEntryUpdateDto
}

export type PapierkramTimeEntryArchiveOperation = {
  type: 'archive'
  timeEntryId: number
}

