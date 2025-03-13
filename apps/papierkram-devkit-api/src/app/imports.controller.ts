import { Body, Controller, Logger, Post } from '@nestjs/common'
import {
  PapierkramTimeEntryReadClient,
  PapierkramTimeEntryImporter
} from '@papierkram/api'
import { PapierkramImportOperationBuilder } from '@papierkram/import'
import { TogglReadClient } from '@toggl/api'
import { TimeFrame } from './utils/time-frame'

@Controller('imports')
export class ImportsController {
  private logger = new Logger('ImportsController')

  constructor(
    private readonly togglReadClient: TogglReadClient,
    private readonly papierkramReadClient: PapierkramTimeEntryReadClient,
    private readonly importOperationBuilder: PapierkramImportOperationBuilder,
    private readonly importer: PapierkramTimeEntryImporter
  ) {}

  @Post('toggl')
  async import(@Body() timeFrame: TimeFrame) {
    const [togglTimeEntries, papierkramTimeEntries] = await Promise.all([
      this.togglReadClient.readTimeEntries(timeFrame),
      this.papierkramReadClient.readTimeEntries(timeFrame)
    ])

    const importOperations = this.importOperationBuilder.buildWithToggl({
      togglTimeEntries,
      papierkramTimeEntries
    })

    for (const operation of importOperations) {
      try {
        await this.importer.execute(operation)
      } catch (error) {
        this.logger.error(error)
      }
    }

    this.logger.log(
      `${importOperations.length} time entries successfully imported`
    )
  }
}
