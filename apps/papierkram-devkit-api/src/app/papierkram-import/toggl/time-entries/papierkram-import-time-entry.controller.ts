import { Body, Controller, Logger, Post } from '@nestjs/common'
import {
  PapierkramTimeEntryImporter,
  PapierkramTimeEntryReadClient
} from '@papierkram/api'
import { TogglReadClient } from '@toggl/api'

import { ResultAsync } from 'typescript-functional-extensions'
import { TimeFrame } from '../../../utils/time-frame'
import { PapierkramTimeEntryOperationBuilder } from './papierkram-import-time-entry-operation-builder.service'

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
    return ResultAsync.combine({
      papierkramTimeEntries:
        this.papierkramReadClient.readTimeEntries(timeFrame),
      togglTimeEntries: this.togglReadClient.readTimeEntries(timeFrame)
    })
      .tap(() =>
        this.logger.log(
          `Import time entries from ${timeFrame.from} - ${timeFrame.to}`
        )
      )
      .map(({ papierkramTimeEntries, togglTimeEntries }) =>
        this.importOperationBuilder.buildWithToggl({
          togglTimeEntries,
          papierkramTimeEntries
        })
      )
      .tap(async importOperations => {
        for (const operation of importOperations) {
          try {
            await this.importer.execute(operation)
          } catch (error) {
            this.logger.error(error)
          }
        }
      })
      .tap(importOperations =>
        this.logger.log(
          `${importOperations.length} time entries successfully imported`
        )
      )
      .toPromise()
  }
}
