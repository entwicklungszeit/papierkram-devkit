import { Controller, Post } from '@nestjs/common'
import { TimeFrame } from '../utils/time-frame'
import { PapierkramImporter } from './papierkram-importer.service'
import { PapierkramImportOperationBuilder } from './papierkram-import-operation-builder.service'
import { PapierkramReadClient } from './papierkram-read-client.service'
import { TogglReadClient } from './toggl-read-client.service'

@Controller('toggl-imports')
export class TogglImportController {
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
