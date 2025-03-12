import { Module } from '@nestjs/common'
import { TogglApiModule } from '@toggl/api'
import { PapierkramTimeEntryModule } from '@papierkram/api'
import { PapierkramImportModule } from '@papierkram/import'

import { ImportsController } from './imports.controller'

@Module({
  imports: [PapierkramTimeEntryModule, TogglApiModule, PapierkramImportModule],
  controllers: [ImportsController]
})
export class ImportsModule {}
