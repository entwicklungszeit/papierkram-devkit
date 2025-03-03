import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { HttpModule } from '@nestjs/axios'
import { PapierkramImportOperationBuilder, TogglReadClient } from '@toggl/api'
import { PapierkramImporter, PapierkramReadClient } from '@papierkram/api'
import { ImportsController } from './imports.controller'

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [ImportsController],
  providers: [
    TogglReadClient,
    PapierkramImporter,
    PapierkramReadClient,
    PapierkramImportOperationBuilder
  ]
})
export class ImportsModule {}
