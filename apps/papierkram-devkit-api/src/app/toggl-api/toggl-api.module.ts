import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { HttpModule } from '@nestjs/axios'

import { TogglApiConfig } from './toggl-api-config.service'
import { TogglReadClient } from './toggl-read-client.service'

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  providers: [TogglReadClient, TogglApiConfig],
  exports: [TogglReadClient]
})
export class TogglApiModule {}
