import { Module } from '@nestjs/common'
import { PapierkramImportOperationBuilder } from './toggl/papierkram-import-operation-builder.service'

@Module({
  providers: [PapierkramImportOperationBuilder],
  exports: [PapierkramImportOperationBuilder]
})
export class PapierkramImportModule {}
