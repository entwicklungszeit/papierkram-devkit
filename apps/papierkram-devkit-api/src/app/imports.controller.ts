import { Body, Controller, Post } from '@nestjs/common'
import { PapierkramReadClient } from '@papierkram/api'
import { PapierkramImportOperationBuilder, TogglReadClient } from '@toggl/api'
import { TimeFrame } from './utils/time-frame'
import { PapierkramTimeEntryImporter } from './papierkram-api/time-entry/papierkram-time-entry-importer.service'

@Controller('imports')
export class ImportsController {
  constructor(
    private readonly togglReadClient: TogglReadClient,
    private readonly papierkramReadClient: PapierkramReadClient,
    private readonly importOperationBuilder: PapierkramImportOperationBuilder,
    private readonly importer: PapierkramTimeEntryImporter
  ) {}

  @Post('toggl')
  async import(@Body() timeFrame: TimeFrame) {
    const [togglResponse, papierkramTimeEntries] = await Promise.all([
      this.togglReadClient.readTimeEntries(timeFrame),
      this.papierkramReadClient.readTimeEntries(timeFrame)
    ])

    const importOperations = this.importOperationBuilder.buildWithToggl({
      togglTimeEntries: togglResponse.data,
      papierkramTimeEntries
    })

    for (const operation of importOperations) {
      await this.importer.execute(operation)
    }
  }
}
