import { Module } from '@nestjs/common'
import { PapierkramImportTimeEntryModule } from '@papierkram/import'

import { HealthController } from './health.controller'

@Module({
  imports: [PapierkramImportTimeEntryModule],
  controllers: [HealthController]
})
export class AppModule {}
