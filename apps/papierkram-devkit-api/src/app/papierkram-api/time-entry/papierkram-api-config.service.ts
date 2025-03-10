import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class PapierkramApiConfig {
  readonly apiUrl: string = ''
  readonly apiToken: string = ''
  readonly projectId: string = ''
  readonly userId: number = 0
  readonly taskId: number = 0

  constructor(private config: ConfigService) {
    this.apiUrl = this.config.get<string>('papierkram_api_url') ?? ''
    this.apiToken = this.config.get<string>('papierkram_api_token') ?? ''
    this.projectId = this.config.get<string>('papierkram_project_id') ?? ''
    this.userId = +(this.config.get<string>('papierkram_user_id') ?? 0)
    this.taskId = +(this.config.get<number>('papierkram_task_id') ?? 0)
  }
}
