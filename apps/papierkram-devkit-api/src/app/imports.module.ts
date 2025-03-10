import { Module } from '@nestjs/common'
import { TogglApiModule } from '@toggl/api'
import { PapierkramTimeEntryModule } from '@papierkram/api'
import { ImportsController } from './imports.controller'

@Module({
  imports: [PapierkramTimeEntryModule, TogglApiModule],
  controllers: [ImportsController]
})
export class ImportsModule {}
