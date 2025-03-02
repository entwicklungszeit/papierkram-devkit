import { expect, test } from 'vitest'
import { PapierkramTimeEntry } from '../../types/papierkram-time-entry'
import { TogglTimeEntry } from './types/toggl-time-entry'
import { TogglMetaForPapierkram } from './types/toggl-meta-for-papierkram'
import { createPapierkramTimeEntry } from '../../types/create-papierkram-time-entry'
import { parseTogglMetaFromPapierkramTimeEntryComments } from './parse-toggl-meta-from-papierkram-time-entry.comments'
import { createTogglTimeEntry } from './create-toggl-time-entry'
import {
  PapierkramTimeEntryCreateOperation,
  PapierkramTimeEntryUpdateOperation
} from '../../types/papierkram-import-operation'
import { determinePapierkramImportOperations } from './determine-papierkram-import-operations'

test(`Given a list of imported papierkram time entries
      When have no matching toggl time entry
      Then the papierkram time entry should be flagged as to be archived`, () => {
  const toggleTimeEntryId = 8921379
  const toggleImportComment: { meta: TogglMetaForPapierkram } = {
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
    .map(parseTogglMetaFromPapierkramTimeEntryComments)
    .filter(timeEntry => timeEntry !== null)

  const togglTimeEntries = [
    createTogglTimeEntry({
      id: -1,
      description: '',
      start: '2024-11-22T15:15:00.000+01:00',
      stop: '2024-11-22T15:15:00.000+01:00'
    })
  ]

  const [archiveOperation] = determinePapierkramImportOperations(
    papierkramTimeEntryImportedFromToggl,
    togglTimeEntries
  )

  expect(archiveOperation.type).toBe('archive')
})

test(`Given a list of toggl time entries
      When no matching papierkram time entry exists
      Then the papierkram time entry should be flagged as to be created`, () => {
  const toggleTimeEntryId = 8921379
  const toggleImportMeta: { meta: TogglMetaForPapierkram } = {
    meta: { toggl: { timeEntry: { id: toggleTimeEntryId } } }
  }
  const expectedTogglMetaComment = JSON.stringify(toggleImportMeta)
  const papierkramTimeEntries: PapierkramTimeEntry[] = []

  const papierkramTimeEntryImportedFromToggl = papierkramTimeEntries
    .map(parseTogglMetaFromPapierkramTimeEntryComments)
    .filter(timeEntry => !!timeEntry)

  const togglTimeEntries = [
    createTogglTimeEntry({
      id: toggleTimeEntryId,
      description: '',
      start: '2024-11-22T15:15:00.000+01:00',
      stop: '2024-11-22T15:15:00.000+01:00'
    })
  ]

  const [createOperation] = determinePapierkramImportOperations(
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
  const toggleImportMeta: { meta: TogglMetaForPapierkram } = {
    meta: { toggl: { timeEntry: { id: toggleTimeEntryId } } }
  }
  const expectedTogglMetaComment = JSON.stringify(toggleImportMeta)
  const papierkramTimeEntries: PapierkramTimeEntry[] = []

  const papierkramTimeEntryImportedFromToggl = papierkramTimeEntries
    .map(parseTogglMetaFromPapierkramTimeEntryComments)
    .filter(timeEntry => !!timeEntry)

  const togglTimeEntries = [
    createTogglTimeEntry({
      id: toggleTimeEntryId,
      description: 'Worked very hard',
      start: '2024-11-22T15:15:00.000+01:00',
      stop: '2024-11-22T15:15:00.000+01:00'
    })
  ]

  const [createOperation] = determinePapierkramImportOperations(
    papierkramTimeEntryImportedFromToggl,
    togglTimeEntries
  ) as [PapierkramTimeEntryCreateOperation]

  expect(createOperation.payload.comments).toContain(
    `Worked very hard\n\n---\n\n${expectedTogglMetaComment}`
  )
})

test(`Given a list of toggl time entries
      When no matching papierkram time entry exists
      And nothing has changed
      Then no operation should be built`, () => {
  const toggleTimeEntryId = 8921379
  const toggleImportComment: { meta: TogglMetaForPapierkram } = {
    meta: { toggl: { timeEntry: { id: toggleTimeEntryId } } }
  }

  const papierkramTimeEntries = [
    createPapierkramTimeEntry({
      id: 1,
      comments: JSON.stringify(toggleImportComment),
      started_at: '2024-11-22T15:00:00.000+01:00',
      ended_at: '2024-11-22T15:00:00.000+01:00'
    })
  ]

  const papierkramTimeEntryImportedFromToggl = papierkramTimeEntries
    .map(parseTogglMetaFromPapierkramTimeEntryComments)
    .filter(timeEntry => !!timeEntry)

  const togglTimeEntries = [
    createTogglTimeEntry({
      id: toggleTimeEntryId,
      description: '',
      start: '2024-11-22T15:00:00.000+01:00',
      stop: '2024-11-22T15:00:00.000+01:00'
    })
  ]

  const operations = determinePapierkramImportOperations(
    papierkramTimeEntryImportedFromToggl,
    togglTimeEntries
  ) as [PapierkramTimeEntryCreateOperation]

  expect(operations).toHaveLength(0)
})

test(`Given a list of toggl time entries
      When a matching papierkram time entry exists
      And the start dates are not equal
      Then the papierkram time entry should be marked as to be updated
      And contain the updated start`, () => {
  const toggleTimeEntryId = 8921379
  const toggleImportComment: { meta: TogglMetaForPapierkram } = {
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
    .map(parseTogglMetaFromPapierkramTimeEntryComments)
    .filter(timeEntry => !!timeEntry)

  const togglTimeEntries = [
    createTogglTimeEntry({
      id: toggleTimeEntryId,
      description: 'Worked very hard',
      start: '2024-11-22T13:00:00.000+00Z',
      stop: '2024-11-22T15:00:00.000+00Z'
    })
  ]

  const [updateOperation] = determinePapierkramImportOperations(
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
  const toggleImportComment: { meta: TogglMetaForPapierkram } = {
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
    .map(parseTogglMetaFromPapierkramTimeEntryComments)
    .filter(timeEntry => !!timeEntry)

  const togglTimeEntries = [
    createTogglTimeEntry({
      id: toggleTimeEntryId,
      description: 'Worked very hard',
      start: '2024-11-22T14:00:00.000+00Z',
      stop: '2024-11-22T16:00:00.000+00Z'
    })
  ]

  const [updateOperation] = determinePapierkramImportOperations(
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
  const toggleImportComment: { meta: TogglMetaForPapierkram } = {
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
    .map(parseTogglMetaFromPapierkramTimeEntryComments)
    .filter(timeEntry => !!timeEntry)

  const togglTimeEntries = [
    createTogglTimeEntry({
      id: toggleTimeEntryId,
      description: 'Worked very hard',
      start: '2024-11-21T14:00:00.000+00Z',
      stop: '2024-11-21T15:00:00.000+00Z'
    })
  ]

  const [updateOperation] = determinePapierkramImportOperations(
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
  const toggleImportComment: { meta: TogglMetaForPapierkram } = {
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
    .map(parseTogglMetaFromPapierkramTimeEntryComments)
    .filter(timeEntry => !!timeEntry)

  const togglTimeEntries = [
    createTogglTimeEntry({
      id: toggleTimeEntryId,
      description: 'Hi, this is my comment with an addition',
      start: '2024-11-22T14:00:00.000+00Z',
      stop: '2024-11-22T15:00:00.000+00Z'
    })
  ]

  const [updateOperation] = determinePapierkramImportOperations(
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

test(`Given a list of toggl time entries
  When a matching papierkram time entry exists
  And the matching toggle time entry has no comment
  Then the papierkram time entry should be marked as to be created
  And contain the id of the toggl time entry`, () => {
  const toggleTimeEntryId = 8921379
  const toggleImportComment: { meta: TogglMetaForPapierkram } = {
    meta: { toggl: { timeEntry: { id: toggleTimeEntryId } } }
  }

  const togglTimeEntries = [
    createTogglTimeEntry({
      id: toggleTimeEntryId,
      description: '',
      start: '2024-11-22T14:00:00.000+00Z',
      stop: '2024-11-22T15:00:00.000+00Z'
    })
  ]

  const [updateOperation] = determinePapierkramImportOperations(
    [],
    togglTimeEntries
  ) as [PapierkramTimeEntryUpdateOperation]

  expect(updateOperation.payload.comments).toBe(
    `\n\n---\n\n${JSON.stringify(toggleImportComment)}`
  )
})
