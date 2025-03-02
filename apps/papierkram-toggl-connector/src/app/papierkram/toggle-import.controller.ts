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

class PapierkramImportOperationBuilder {
  buildWithToggl(props: {
    togglTimeEntries: TogglTimeEntry[]
    papierkramTimeEntries: PapierkramTimeEntry[]
  }): PapierkramImportOperation[] {
    return []
  }
}

export class PapierkramImporter {
  async import(importOperations: PapierkramImportOperation[]) {
    return Promise.resolve()
  }
}

@Controller('toggl-imports')
export class ToggleImportController {
  constructor(
    private readonly togglReadClient: TogglReadClient,
    private readonly papierkramReadClient: PapierkramReadClient,
    private readonly importOperationBuilder: PapierkramImportOperationBuilder,
    private readonly importer: PapierkramImporter
  ) {}

  @Post()
  async import(timeFrame: TimeFrame) {
    const [togglTimeEntries, papierkramTimeEntries] = await Promise.all([
      this.togglReadClient.readTimeEntries(timeFrame),
      this.papierkramReadClient.readTimeEntries(timeFrame)
    ])

    const importOperations = this.importOperationBuilder.buildWithToggl({
      togglTimeEntries,
      papierkramTimeEntries
    })

    await this.importer.import(importOperations)
  }
}
