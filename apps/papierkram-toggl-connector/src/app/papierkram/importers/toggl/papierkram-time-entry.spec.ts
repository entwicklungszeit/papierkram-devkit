import { expect, test } from 'vitest'

export type TogglTimeEntry = {
  id: number
  description: string
  start: string
  stop: string
}

export type PapierkramTogglMeta = {
  toggl: { timeEntry: Pick<TogglTimeEntry, 'id'> }
}

export type PapierkramTimeEntry = {
  id: number
  comments: string
  started_at: string
  ended_at: string
}

export type PapierkramTimeEntryImportedFromToggl = PapierkramTimeEntry & {
  meta: PapierkramTogglMeta
}

test(`Given papierkram time entry
      When being imported from toggl
      Then it contains the toggl time entry id`, () => {
  const togglTimeEntryId = 1
  const toggleImportComment: { meta: PapierkramTogglMeta } = {
    meta: { toggl: { timeEntry: { id: togglTimeEntryId } } }
  }
  const comments = `My comment ${JSON.stringify(toggleImportComment)}`

  const timeEntry = createPapierkramTimeEntry({
    id: 1,
    comments,
    started_at: '',
    ended_at: ''
  })
  const importedTimeEntry =
    createPapierkramTimeEntryWithTogglImportInformation(timeEntry)

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
    createPapierkramTimeEntryWithTogglImportInformation(timeEntry)

  expect(importedTimeEntry).toBeNull()
})

export function createPapierkramTimeEntry(
  props: PapierkramTimeEntry
): PapierkramTimeEntry {
  return { ...props }
}

export function createPapierkramTimeEntryWithTogglImportInformation(
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

function jsonFromString(text: string) {
  const regex = /[{[]{1}([,:{}[\]0-9.\-+Eaeflnr-u \n\r\t]|".*?")+[}\]]{1}/gis
  const matches = text.match(regex)
  return Object.assign({}, ...(matches?.map(m => JSON.parse(m)) || []))
}

function hasOwnProperty<X, Y extends PropertyKey>(
  candidate: X,
  propertyKey: Y
): candidate is X & Record<Y, unknown> {
  if (typeof candidate !== 'object') {
    return false
  }

  return Object.prototype.hasOwnProperty.call(candidate, propertyKey)
}
