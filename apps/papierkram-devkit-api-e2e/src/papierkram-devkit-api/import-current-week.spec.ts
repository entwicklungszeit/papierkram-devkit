import axios from 'axios'
import { endOfDay, startOfWeek } from 'date-fns'

describe('Import time entries form toggl', () => {
  it('yields created if an import ran successful', async () => {
    const monday = 1
    const endOfToday = endOfDay(new Date())

    const thisWeek = {
      from: startOfWeek(new Date(), { weekStartsOn: monday }),
      to: endOfToday
    }

    const response = await axios.post(
      `http://localhost:3000/api/imports/toggl`,
      thisWeek,
      { headers: { 'Content-Type': 'application/json' } }
    )

    expect(response.status).toBe(201)
  }, 60_000)
})
