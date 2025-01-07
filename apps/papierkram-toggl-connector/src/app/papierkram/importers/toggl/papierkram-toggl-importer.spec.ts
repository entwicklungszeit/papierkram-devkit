import { test, expect } from 'vitest'
import {
  createPapierkramTimeEntry,
  createPapierkramTimeEntryWithTogglImportInformation,
  PapierkramTimeEntry,
  PapierkramTimeEntryImportedFromToggl,
  PapierkramTogglMeta,
  TogglTimeEntry
} from './papierkram-time-entry.spec'
import { differenceInSeconds, format, isSameDay, parseISO } from 'date-fns'

test(`Given a list of imported papierkram time entries
      When have no matching toggl time entry
      Then the papierkram time entry should be flagged as to be archived`, () => {
  const toggleTimeEntryId = 8921379
  const toggleImportComment: { meta: PapierkramTogglMeta } = {
    meta: { toggl: { timeEntry: { id: toggleTimeEntryId } } }
  }

  const papierkramTimeEntries = [
    createPapierkramTimeEntry({
      id: 1,
      comments: JSON.stringify(toggleImportComment),
      started_at: '2024-11-22T15:15:00.000+01:00',
      ended_at: '2024-11-22T15:15:00.000+01:00'
    })
  ]

  const papierkramTimeEntryImportedFromToggl = papierkramTimeEntries
    .map(createPapierkramTimeEntryWithTogglImportInformation)
    .filter(timeEntry => timeEntry !== null)

  const togglTimeEntries = [
    createTogglTimeEntry({
      id: -1,
      description: '',
      start: '2024-11-22T15:15:00.000+01:00',
      stop: '2024-11-22T15:15:00.000+01:00'
    })
  ]

  const [archiveOperation] = buildPapierkramImportOperations(
    papierkramTimeEntryImportedFromToggl,
    togglTimeEntries
  )

  expect(archiveOperation.type).toBe('archive')
})

test(`Given a list of toggl time entries
      When no matching papierkram time entry exists
      Then the papierkram time entry should be flagged as to be created`, () => {
  const toggleTimeEntryId = 8921379
  const toggleImportMeta: { meta: PapierkramTogglMeta } = {
    meta: { toggl: { timeEntry: { id: toggleTimeEntryId } } }
  }
  const expectedTogglMetaComment = JSON.stringify(toggleImportMeta)
  const papierkramTimeEntries: PapierkramTimeEntry[] = []

  const papierkramTimeEntryImportedFromToggl = papierkramTimeEntries
    .map(createPapierkramTimeEntryWithTogglImportInformation)
    .filter(timeEntry => !!timeEntry)

  const togglTimeEntries = [
    createTogglTimeEntry({
      id: toggleTimeEntryId,
      description: '',
      start: '2024-11-22T15:15:00.000+01:00',
      stop: '2024-11-22T15:15:00.000+01:00'
    })
  ]

  const [createOperation] = buildPapierkramImportOperations(
    papierkramTimeEntryImportedFromToggl,
    togglTimeEntries
  ) as [PapierkramTimeEntryCreateOperation]

  expect(createOperation.type).toBe('create')
  expect(createOperation.payload.comments).toContain(expectedTogglMetaComment)
})

test(`Given a list of toggl time entries
      When no matching papierkram time entry exists
      And the toggl entry contains a descriptions
      Then the papierkram time entry being created should contain both the import meta data and the descriptions`, () => {
  const toggleTimeEntryId = 8921379
  const toggleImportMeta: { meta: PapierkramTogglMeta } = {
    meta: { toggl: { timeEntry: { id: toggleTimeEntryId } } }
  }
  const expectedTogglMetaComment = JSON.stringify(toggleImportMeta)
  const papierkramTimeEntries: PapierkramTimeEntry[] = []

  const papierkramTimeEntryImportedFromToggl = papierkramTimeEntries
    .map(createPapierkramTimeEntryWithTogglImportInformation)
    .filter(timeEntry => !!timeEntry)

  const togglTimeEntries = [
    createTogglTimeEntry({
      id: toggleTimeEntryId,
      description: 'Worked very hard',
      start: '2024-11-22T15:15:00.000+01:00',
      stop: '2024-11-22T15:15:00.000+01:00'
    })
  ]

  const [createOperation] = buildPapierkramImportOperations(
    papierkramTimeEntryImportedFromToggl,
    togglTimeEntries
  ) as [PapierkramTimeEntryCreateOperation]

  expect(createOperation.payload.comments).toContain(
    `Worked very hard\n\n---\n\n${expectedTogglMetaComment}`
  )
})

test(`Given a list of toggl time entries
      When a matching papierkram time entry exists
      And the start dates are not equal
      Then the papierkram time entry should be marked as to be updated
      And contain the updated start`, () => {
  const toggleTimeEntryId = 8921379
  const toggleImportComment: { meta: PapierkramTogglMeta } = {
    meta: { toggl: { timeEntry: { id: toggleTimeEntryId } } }
  }

  const papierkramTimeEntries = [
    createPapierkramTimeEntry({
      id: 1,

      comments: JSON.stringify(toggleImportComment),
      started_at: '2024-11-22T15:00:00.000+01:00',
      ended_at: '2024-11-22T16:00:00.000+01:00'
    })
  ]

  const papierkramTimeEntryImportedFromToggl = papierkramTimeEntries
    .map(createPapierkramTimeEntryWithTogglImportInformation)
    .filter(timeEntry => !!timeEntry)

  const togglTimeEntries = [
    createTogglTimeEntry({
      id: toggleTimeEntryId,
      description: 'Worked very hard',
      start: '2024-11-22T13:00:00.000+00Z',
      stop: '2024-11-22T15:00:00.000+00Z'
    })
  ]

  const [updateOperation] = buildPapierkramImportOperations(
    papierkramTimeEntryImportedFromToggl,
    togglTimeEntries
  ) as [PapierkramTimeEntryUpdateOperation]

  expect(updateOperation.type).toBe('update')
  expect(updateOperation.payload.started_at_time).toBe('14:00')
})

test(`Given a list of toggl time entries
      When a matching papierkram time entry exists
      And the end dates are not equal
      Then the papierkram time entry should be marked as to be updated
      And contain the updated end`, () => {
  const toggleTimeEntryId = 8921379
  const toggleImportComment: { meta: PapierkramTogglMeta } = {
    meta: { toggl: { timeEntry: { id: toggleTimeEntryId } } }
  }

  const papierkramTimeEntries = [
    createPapierkramTimeEntry({
      id: 1,

      comments: JSON.stringify(toggleImportComment),
      started_at: '2024-11-22T15:00:00.000+01:00',
      ended_at: '2024-11-22T16:00:00.000+01:00'
    })
  ]

  const papierkramTimeEntryImportedFromToggl = papierkramTimeEntries
    .map(createPapierkramTimeEntryWithTogglImportInformation)
    .filter(timeEntry => !!timeEntry)

  const togglTimeEntries = [
    createTogglTimeEntry({
      id: toggleTimeEntryId,
      description: 'Worked very hard',
      start: '2024-11-22T14:00:00.000+00Z',
      stop: '2024-11-22T16:00:00.000+00Z'
    })
  ]

  const [updateOperation] = buildPapierkramImportOperations(
    papierkramTimeEntryImportedFromToggl,
    togglTimeEntries
  ) as [PapierkramTimeEntryUpdateOperation]

  expect(updateOperation.type).toBe('update')
  expect(updateOperation.payload.started_at_time).toBeUndefined()
  expect(updateOperation.payload.ended_at_time).toBe('17:00')
})

test(`Given a list of toggl time entries
  When a matching papierkram time entry exists
  And the days are not equal
  Then the papierkram time entry should be marked as to be updated
  And contain the updated end`, () => {
  const toggleTimeEntryId = 8921379
  const toggleImportComment: { meta: PapierkramTogglMeta } = {
    meta: { toggl: { timeEntry: { id: toggleTimeEntryId } } }
  }

  const papierkramTimeEntries = [
    createPapierkramTimeEntry({
      id: 1,

      comments: JSON.stringify(toggleImportComment),
      started_at: '2024-11-22T15:00:00.000+01:00',
      ended_at: '2024-11-22T16:00:00.000+01:00'
    })
  ]

  const papierkramTimeEntryImportedFromToggl = papierkramTimeEntries
    .map(createPapierkramTimeEntryWithTogglImportInformation)
    .filter(timeEntry => !!timeEntry)

  const togglTimeEntries = [
    createTogglTimeEntry({
      id: toggleTimeEntryId,
      description: 'Worked very hard',
      start: '2024-11-21T14:00:00.000+00Z',
      stop: '2024-11-21T15:00:00.000+00Z'
    })
  ]

  const [updateOperation] = buildPapierkramImportOperations(
    papierkramTimeEntryImportedFromToggl,
    togglTimeEntries
  ) as [PapierkramTimeEntryUpdateOperation]

  expect(updateOperation.type).toBe('update')
  expect(updateOperation.payload.entry_date).toBe('2024-11-21')
  expect(updateOperation.payload.started_at_time).toBe('15:00')
  expect(updateOperation.payload.ended_at_time).toBe('16:00')
})

test(`Given a list of toggl time entries
  When a matching papierkram time entry exists
  And the comments do not match anymore
  Then the papierkram time entry should be marked as to be updated
  And contain the updated comment`, () => {
  const toggleTimeEntryId = 8921379
  const toggleImportComment: { meta: PapierkramTogglMeta } = {
    meta: { toggl: { timeEntry: { id: toggleTimeEntryId } } }
  }

  const papierkramTimeEntries = [
    createPapierkramTimeEntry({
      id: 1,

      comments: `Hi, this is my comment\n\n--\n\n${JSON.stringify(
        toggleImportComment
      )}`,
      started_at: '2024-11-22T15:00:00.000+01:00',
      ended_at: '2024-11-22T16:00:00.000+01:00'
    })
  ]

  const papierkramTimeEntryImportedFromToggl = papierkramTimeEntries
    .map(createPapierkramTimeEntryWithTogglImportInformation)
    .filter(timeEntry => !!timeEntry)

  const togglTimeEntries = [
    createTogglTimeEntry({
      id: toggleTimeEntryId,
      description: 'Hi, this is my comment with an addition',
      start: '2024-11-22T14:00:00.000+00Z',
      stop: '2024-11-22T15:00:00.000+00Z'
    })
  ]

  const [updateOperation] = buildPapierkramImportOperations(
    papierkramTimeEntryImportedFromToggl,
    togglTimeEntries
  ) as [PapierkramTimeEntryUpdateOperation]

  expect(updateOperation).toStrictEqual({
    type: 'update',
    timeEntryId: 1,
    payload: {
      comments: `Hi, this is my comment with an addition\n\n---\n\n${JSON.stringify(
        toggleImportComment
      )}`
    }
  })
})

export function createTogglTimeEntry(props: TogglTimeEntry) {
  return { ...props }
}

export type PapierkramImportOperation =
  | PapierkramTimeEntryCreateOperation
  | PapierkramTimeEntryUpdateOperation
  | PapierkramTimeEntryArchiveOperation

function createPapierkramTimeEntryComments(props: TogglTimeEntry): string {
  const meta = {
    meta: <PapierkramTogglMeta>{ toggl: { timeEntry: { id: props.id } } }
  }

  return props.description
    ? `${props.description}\n\n---\n\n${JSON.stringify(meta)}`
    : JSON.stringify(meta)
}

type PapierkramTimeEntryCreateOperation = {
  type: 'create'
  payload: PapierkramTimeEntryCreateDto
}

type PapierkramTimeEntryUpdateOperation = {
  type: 'update'
  timeEntryId: number
  payload: PapierkramTimeEntryUpdateDto
}

type PapierkramTimeEntryArchiveOperation = {
  type: 'archive'
  timeEntryId: number
}

type PapierkramTimeEntryCreateDto = {
  entry_date: string
  started_at_time: string
  ended_at_time: string
  comments: string
}

type PapierkramTimeEntryUpdateDto = Partial<PapierkramTimeEntryCreateDto>

export function buildPapierkramImportOperations(
  papierkram: PapierkramTimeEntryImportedFromToggl[],
  toggl: TogglTimeEntry[]
): PapierkramImportOperation[] {
  // Find time entries in papierkram that has been deleted in toggle to archive them.
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

  // Find toggl time entries that need to be created in papierkram
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

  // Find toggl time entries that need to be updated in papierkram
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
