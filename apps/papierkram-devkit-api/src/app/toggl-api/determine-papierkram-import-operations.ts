import { PapierkramTimeEntryImportedFromToggl } from './types/papierkram-time-entry-imported-from-toggl'
import { TogglTimeEntry } from './types/toggl-time-entry'
import {
  PapierkramImportOperation,
  PapierkramTimeEntryArchiveOperation,
  PapierkramTimeEntryCreateOperation,
  PapierkramTimeEntryUpdateOperation
} from '../papierkram-api/types/papierkram-import-operation'
import { differenceInSeconds, format, isSameDay, parseISO } from 'date-fns'
import { PapierkramTimeEntryUpdateDto } from '../papierkram-api/types/papierkram-time-entry-update.dto'
import { createPapierkramTimeEntryComments } from './create-papierkram-time-entry-comments'

export function determinePapierkramImportOperations(
  papierkram: PapierkramTimeEntryImportedFromToggl[],
  toggl: TogglTimeEntry[]
): PapierkramImportOperation[] {
  // Find time entries in papierkram-api that has been deleted in toggle to archive them.
  const archiveOperations: PapierkramTimeEntryArchiveOperation[] = papierkram
    .filter(
      papierkramTimeEntry =>
        !toggl.some(
          togglTimeEntry =>
            togglTimeEntry.id === papierkramTimeEntry.meta.toggl.timeEntry.id
        )
    )
    .map(papierkramTimeEntry => ({
      type: 'archive' as const,
      timeEntryId: papierkramTimeEntry.id
    }))

  // Find toggl time entries that need to be created in papierkram-api
  const createOperations: PapierkramTimeEntryCreateOperation[] = toggl
    .filter(
      togglTimeEntry =>
        !papierkram.some(
          papierkramTimeEntry =>
            papierkramTimeEntry.meta.toggl.timeEntry.id == togglTimeEntry.id
        )
    )
    .map(togglTimeEntry => {
      const start = parseISO(togglTimeEntry.start)
      const end = parseISO(togglTimeEntry.stop)

      return {
        type: 'create' as const,
        payload: {
          entry_date: format(start, 'yyyy-MM-dd'),
          started_at_time: format(start, 'HH:mm'),
          ended_at_time: format(end, 'HH:mm'),
          comments: createPapierkramTimeEntryComments(togglTimeEntry)
        }
      }
    })

  // Find toggl time entries that need to be updated in papierkram-api
  const updateOperations: PapierkramTimeEntryUpdateOperation[] = toggl
    .map(togglTimeEntry => {
      const papierkramTimeEntry = papierkram.find(
        papierkramTimeEntry =>
          papierkramTimeEntry.meta.toggl.timeEntry.id == togglTimeEntry.id
      )

      return {
        timeEntryPair: {
          toggl: togglTimeEntry,
          papierkram: papierkramTimeEntry
        }
      }
    })
    .filter(
      (
        value
      ): value is {
        timeEntryPair: {
          toggl: TogglTimeEntry
          papierkram: PapierkramTimeEntryImportedFromToggl
        }
      } => !!value.timeEntryPair.papierkram
    )
    .map(({ timeEntryPair }) => {
      const updateRecord: Partial<
        Record<keyof PapierkramTimeEntryUpdateDto, string>
      > = {}
      const papierkramStartedAt = parseISO(timeEntryPair.papierkram.started_at)
      const togglStartedAt = parseISO(timeEntryPair.toggl.start)

      const startDifference = differenceInSeconds(
        papierkramStartedAt,
        togglStartedAt
      )

      const papierkramEndedAt = parseISO(timeEntryPair.papierkram.ended_at)
      const togglEndedAt = parseISO(timeEntryPair.toggl.stop)

      const endDifference = differenceInSeconds(papierkramEndedAt, togglEndedAt)

      if (startDifference !== 0) {
        updateRecord.started_at_time = format(togglStartedAt, 'HH:mm')
      }

      if (endDifference !== 0) {
        updateRecord.ended_at_time = format(togglEndedAt, 'HH:mm')
      }

      if (!isSameDay(papierkramStartedAt, togglStartedAt)) {
        updateRecord.entry_date = format(togglStartedAt, 'yyyy-MM-dd')
      }

      const comments = createPapierkramTimeEntryComments(timeEntryPair.toggl)
      if (comments !== timeEntryPair.papierkram.comments) {
        updateRecord.comments = comments
      }

      return startDifference !== 0 ||
        endDifference !== 0 ||
        !isSameDay(papierkramStartedAt, togglStartedAt) ||
        comments !== timeEntryPair.papierkram.comments
        ? {
            type: 'update' as const,
            timeEntryId: timeEntryPair.papierkram.id,
            payload: updateRecord
          }
        : null
    })
    .filter(operation => !!operation)

  return [...archiveOperations, ...createOperations, ...updateOperations]
}
