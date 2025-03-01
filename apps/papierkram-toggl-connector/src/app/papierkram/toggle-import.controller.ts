import { Controller, Post } from '@nestjs/common'
import { TogglTimeEntry } from './importers/toggl/types/toggl-time-entry'
import { PapierkramTimeEntry } from './types/papierkram-time-entry'
import { PapierkramImportOperation } from './types/papierkram-import-operation'

type TimeFrame = {
  from: Date
  to: Date
}

class TogglReadClient {
  readTimeEntries(timeFrame: TimeFrame): Promise<TogglTimeEntry[]> {
    return Promise.resolve([])
  }
}
class PapierkramReadClient {
  readTimeEntries(timeFrame: TimeFrame): Promise<PapierkramTimeEntry[]> {
    return Promise.resolve([])
  }
}

class PapierkramImportClient {
  import({
    togglTimeEntries,
    papierkramTimeEntries
  }: {
    togglTimeEntries: TogglTimeEntry[]
    papierkramTimeEntries: PapierkramTimeEntry[]
  }): Promise<void> {
    // Iterate through operations
    // Execute correct API call based on the given operation
    return Promise.resolve()
  }
}

@Controller('toggle-imports')
export class ToggleImportController {
  constructor(
    private readonly togglReadClient: TogglReadClient,
    private readonly papierkramReadClient: PapierkramReadClient,
    private readonly papierkramImportClient: PapierkramImportClient
  ) {}

  @Post()
  async import(timeFrame: TimeFrame) {
    const [togglTimeEntries, papierkramTimeEntries] = await Promise.all([
      this.togglReadClient.readTimeEntries(timeFrame),
      this.papierkramReadClient.readTimeEntries(timeFrame)
    ])

    await this.papierkramImportClient.import({
      togglTimeEntries,
      papierkramTimeEntries
    })

    // 1. load time entries from both platforms
    // 1.1 Yield error if timeEntries could not be loaded
    // 2 Determine import operations
    // 3 Execute import
  }
}
