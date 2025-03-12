import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { HttpModule } from '@nestjs/axios'

import { TogglReadClient } from './toggl-read-client.service'
import { PapierkramImportOperationBuilder } from '../papierkram-import/toggl/papierkram-import-operation-builder.service'

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  providers: [TogglReadClient, PapierkramImportOperationBuilder],
  exports: [TogglReadClient, PapierkramImportOperationBuilder]
})
export class TogglApiModule {}
