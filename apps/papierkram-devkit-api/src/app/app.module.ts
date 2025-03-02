import { Module } from '@nestjs/common'
import { PapierkramModule } from './papierkram/papierkram.module'

@Module({
  imports: [PapierkramModule]
})
export class AppModule {}
