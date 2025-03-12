import { Module } from '@nestjs/common'
import { ImportsModule } from './imports.module'
import { HealthController } from './health.controller'

@Module({
  imports: [ImportsModule],
  controllers: [HealthController]
})
export class AppModule {}
