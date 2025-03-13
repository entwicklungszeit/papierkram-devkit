import { Module } from '@nestjs/common'

import { PapierkramTimeEntryModule } from '@papierkram/api'
import { TogglApiModule } from '@toggl/api'

import { PapierkramImportTimeEntryController } from './papierkram-import-time-entry.controller'
import { PapierkramTimeEntryOperationBuilder } from './papierkram-import-time-entry-operation-builder.service'

@Module({
  imports: [PapierkramTimeEntryModule, TogglApiModule],
  providers: [PapierkramTimeEntryOperationBuilder],
  exports: [PapierkramTimeEntryOperationBuilder],
  controllers: [PapierkramImportTimeEntryController]
})
export class PapierkramImportTimeEntryModule {}
