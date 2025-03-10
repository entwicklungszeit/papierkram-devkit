import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PapierkramImportOperationBuilder, TogglReadClient } from '@toggl/api'
import { PapierkramReadClient } from '@papierkram/api'
import { ImportsController } from './imports.controller'
import { PapierkramTimeEntryModule } from './papierkram-api/time-entry/papierkram-time-entry.module'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [ConfigModule.forRoot(), HttpModule, PapierkramTimeEntryModule],
  controllers: [ImportsController],
  providers: [
    TogglReadClient,
    PapierkramReadClient,
    PapierkramImportOperationBuilder
  ]
})
export class ImportsModule {}
