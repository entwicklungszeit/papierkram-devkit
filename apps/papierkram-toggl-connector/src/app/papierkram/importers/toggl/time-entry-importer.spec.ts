import { expect, test } from 'vitest'

type TimeEntryFromPapierkram = {
  id: number
  comments: string
  togglTimeEntryId?: number
}

test(`Given papierkram time entry
      When being imported from toggl
      Then it contains the toggl time entry id`, () => {
  const togglTimeEntryId = 1
  const toggleImportComment = { toggl: { timeEntryId: togglTimeEntryId } }
  const comments = `My comment ${JSON.stringify(toggleImportComment)}`
  const timeEntry = createTimeEntryFromPapierkram({ id: 1, comments })

  expect(timeEntry.togglTimeEntryId).toBe(togglTimeEntryId)
})

test(`Given papierkram time entry
      When not being imported from toggl
      Then it does not contain a toggl time entry id`, () => {
  const comments = 'My comment'
  const timeEntry = createTimeEntryFromPapierkram({ id: 1, comments })

  expect(timeEntry.togglTimeEntryId).toBeUndefined()
})

function createTimeEntryFromPapierkram(props: {
  id: number
  comments: string
}): TimeEntryFromPapierkram {
  const meta = jsonFromString(props.comments)

  return containsTogglTimeEntryId(meta)
    ? {
        ...props,
        togglTimeEntryId: meta.toggl.timeEntryId,
      }
    : { ...props }
}

function containsTogglTimeEntryId(
  candidate: unknown
): candidate is { toggl: { timeEntryId: number } } {
  return (
    !!candidate &&
    Object.prototype.hasOwnProperty.call(
      candidate?.['toggl'] || {},
      'timeEntryId'
    ) &&
    !isNaN(candidate['toggl']['timeEntryId'])
  )
}

function jsonFromString(str) {
  const regex = /[{[]{1}([,:{}[\]0-9.\-+Eaeflnr-u \n\r\t]|".*?")+[}\]]{1}/gis
  const matches = str.match(regex)
  return Object.assign({}, ...(matches?.map((m) => JSON.parse(m)) || []))
}
