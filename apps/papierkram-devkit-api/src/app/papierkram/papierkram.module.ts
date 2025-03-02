import { Module } from '@nestjs/common'
import { TogglImportController } from './toggl-import.controller'
import { PapierkramImporter } from './papierkram-importer.service'
import { TogglReadClient } from './toggl-read-client.service'
import { PapierkramReadClient } from './papierkram-read-client.service'
import { PapierkramImportOperationBuilder } from './papierkram-import-operation-builder.service'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [TogglImportController],
  providers: [
    TogglReadClient,
    PapierkramImporter,
    PapierkramReadClient,
    PapierkramImportOperationBuilder
  ]
})
export class PapierkramModule {}
