import { Body, Controller, Logger, Post } from '@nestjs/common'
import {
  PapierkramTimeEntryReadClient,
  PapierkramTimeEntryImporter
} from '@papierkram/api'
import { TogglReadClient } from '@toggl/api'

import { PapierkramTimeEntryOperationBuilder } from './papierkram-import-time-entry-operation-builder.service'
import { TimeFrame } from '../../../utils/time-frame'

@Controller('imports')
export class PapierkramImportTimeEntryController {
  private logger = new Logger('PapierkramImportTimeEntryController')

  constructor(
    private readonly togglReadClient: TogglReadClient,
    private readonly papierkramReadClient: PapierkramTimeEntryReadClient,
    private readonly importOperationBuilder: PapierkramTimeEntryOperationBuilder,
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
