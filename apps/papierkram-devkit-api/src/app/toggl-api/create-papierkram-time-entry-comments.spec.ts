import { createTogglTimeEntry } from './create-toggl-time-entry'
import { createPapierkramTimeEntryComments } from './create-papierkram-time-entry-comments'

test(`Given a Toggl Time Entry without description
      When an ID is specified
      Then it is written in the comment`, () => {
  const id = 8329
  const togglTimeEntry = createTogglTimeEntry({
    id,
    description: '',
    start: '',
    stop: ''
  })

  const comments = createPapierkramTimeEntryComments(togglTimeEntry)

  expect(comments).toContain(`${id}`)
})

test(`Given a Toggl Time Entry with description
      When an ID is specified
      Then it is written in the comment`, () => {
  const id = 8329
  const togglTimeEntry = createTogglTimeEntry({
    id,
    description: 'published new release',
    start: '',
    stop: ''
  })

  const comments = createPapierkramTimeEntryComments(togglTimeEntry)

  expect(comments).toContain(`${id}`)
})

test(`Given a Toggl Time Entry
      When no ID is specified
      When no description is specified
      Then the comment is empty`, () => {
  const togglTimeEntry = createTogglTimeEntry({
    id: null as unknown as number,
    description: '',
    start: '',
    stop: ''
  })

  const comments = createPapierkramTimeEntryComments(togglTimeEntry)

  expect(comments).toBe('')
})

test(`Given a Toggl Time Entry
      When the description is undefined
      Then the the comment does not contained "undefined" as text`, () => {
  const togglTimeEntry = createTogglTimeEntry({
    id: 1,
    description: undefined as unknown as string,
    start: '',
    stop: ''
  })

  const comments = createPapierkramTimeEntryComments(togglTimeEntry)

  expect(comments).not.toContain('undefined')
})
