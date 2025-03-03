import { Module } from '@nestjs/common'
import { ImportsModule } from './imports.module'

@Module({
  imports: [ImportsModule]
})
export class AppModule {}
