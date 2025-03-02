import { expect, test } from 'vitest'
import { TogglMetaForPapierkram } from './types/toggl-meta-for-papierkram'
import { createPapierkramTimeEntry } from '../../types/create-papierkram-time-entry'
import { parseTogglMetaFromPapierkramTimeEntryComments } from './parse-toggl-meta-from-papierkram-time-entry.comments'

test(`Given papierkram time entry
      When being imported from toggl
      Then it contains the toggl time entry id`, () => {
  const togglTimeEntryId = 1
  const toggleMeta: { meta: TogglMetaForPapierkram } = {
    meta: { toggl: { timeEntry: { id: togglTimeEntryId } } }
  }
  const comments = `My comment ${JSON.stringify(toggleMeta)}`

  const papierkramTimeEntryContainingTogglMetaInItsComment =
    createPapierkramTimeEntry({
      id: 1,
      comments,
      started_at: '',
      ended_at: ''
    })

  const importedTimeEntry = parseTogglMetaFromPapierkramTimeEntryComments(
    papierkramTimeEntryContainingTogglMetaInItsComment
  )

  expect(importedTimeEntry?.meta.toggl.timeEntry.id).toBe(togglTimeEntryId)
})

test(`Given papierkram time entry
      When not being imported from toggl
      Then it does not contain a toggl time entry id`, () => {
  const comments = 'My comment'
  const timeEntry = createPapierkramTimeEntry({
    id: 1,
    comments,
    started_at: '',
    ended_at: ''
  })
  const importedTimeEntry =
    parseTogglMetaFromPapierkramTimeEntryComments(timeEntry)

  expect(importedTimeEntry).toBeNull()
})
