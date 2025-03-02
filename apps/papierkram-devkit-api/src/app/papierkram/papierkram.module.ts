import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { HttpModule } from '@nestjs/axios'
import { TogglImportController } from './toggl-import.controller'
import { PapierkramImporter } from './papierkram-importer.service'
import { TogglReadClient } from './toggl-read-client.service'
import { PapierkramReadClient } from './papierkram-read-client.service'
import { PapierkramImportOperationBuilder } from './papierkram-import-operation-builder.service'

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [TogglImportController],
  providers: [
    TogglReadClient,
    PapierkramImporter,
    PapierkramReadClient,
    PapierkramImportOperationBuilder
  ]
})
export class PapierkramModule {}
