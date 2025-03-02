import { Module } from '@nestjs/common'
import { PapierkramModule } from './papierkram/papierkram.module'
import { AppService } from './app.service'

@Module({
  imports: [PapierkramModule],
  providers: [AppService]
})
export class AppModule {
  constructor(private appService: AppService) {
    this.appService.do()
  }
}
