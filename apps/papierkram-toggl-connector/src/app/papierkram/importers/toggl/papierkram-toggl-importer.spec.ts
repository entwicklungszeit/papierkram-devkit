import { test, expect } from 'vitest'
import {
  createPapierkramTimeEntry,
  createPapierkramTimeEntryWithTogglImportInformation,
  PapierkramTimeEntry,
  PapierkramTimeEntryImportedFromToggl,
  PapierkramTogglMeta,
  TogglTimeEntry
} from './papierkram-time-entry.spec'

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
      started_at: '',
      ended_at: ''
    })
  ]

  const papierkramTimeEntryImportedFromToggl = papierkramTimeEntries
    .map(createPapierkramTimeEntryWithTogglImportInformation)
    .filter(timeEntry => !!timeEntry)

  const togglTimeEntries = [
    createTogglTimeEntry({ id: -1, description: '', start: '', stop: '' })
  ]

  const [archiveOperation] = createPapierkramImportOperations(
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
      start: '',
      stop: ''
    })
  ]

  const [createOperation] = createPapierkramImportOperations(
    papierkramTimeEntryImportedFromToggl,
    togglTimeEntries
  )

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
      start: '',
      stop: ''
    })
  ]

  const [createOperation] = createPapierkramImportOperations(
    papierkramTimeEntryImportedFromToggl,
    togglTimeEntries
  )

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
      started_at: '',
      ended_at: ''
    })
  ]

  const papierkramTimeEntryImportedFromToggl = papierkramTimeEntries
    .map(createPapierkramTimeEntryWithTogglImportInformation)
    .filter(timeEntry => !!timeEntry)

  const togglTimeEntries = [
    createTogglTimeEntry({
      id: toggleTimeEntryId,
      description: 'Worked very hard',
      start: '',
      stop: ''
    })
  ]

  const [createOperation] = createPapierkramImportOperations(
    papierkramTimeEntryImportedFromToggl,
    togglTimeEntries
  )

  expect(createOperation.type).toBe('update')
  expect(createOperation.payload.started_at_time).toBe('???')
})

export function createTogglTimeEntry(props: TogglTimeEntry) {
  return { ...props }
}

export type PapierkramImportOperation = {
  type: 'create' | 'update' | 'archive'
  payload: Partial<PapierkramTimeEntry>
}

export function createPapierkramImportOperations(
  papierkram: PapierkramTimeEntryImportedFromToggl[],
  toggl: TogglTimeEntry[]
): PapierkramImportOperation[] {
  // Find time entries in papierkram that has been deleted in toggle to archive them.
  const archiveOperations = papierkram
    .filter(
      papierkramTimeEntry =>
        !toggl.some(
          togglTimeEntry =>
            togglTimeEntry.id === papierkramTimeEntry.meta.toggl.timeEntry.id
        )
    )
    .map(timeEntry =>
      createPapierkramImportOperation({
        type: 'archive',
        payload: { id: timeEntry.id }
      })
    )

  // Find toggl time entries that need to be created in papierkram
  const createOperations = toggl
    .filter(
      togglTimeEntry =>
        !papierkram.some(
          papierkramTimeEntry =>
            papierkramTimeEntry.meta.toggl.timeEntry.id == togglTimeEntry.id
        )
    )
    .map(createPapierkramCreateOperation)

  return [...archiveOperations, ...createOperations]
}

function createPapierkramCreateOperation(
  props: TogglTimeEntry
): PapierkramImportOperation {
  const meta = {
    meta: <PapierkramTogglMeta>{ toggl: { timeEntry: { id: props.id } } }
  }
  const comments = props.description
    ? `${props.description}\n\n---\n\n${JSON.stringify(meta)}`
    : JSON.stringify(meta)

  return {
    type: 'create',
    payload: { comments }
  }
}

function createPapierkramImportOperation(
  props: PapierkramImportOperation
): PapierkramImportOperation {
  return { ...props }
}
