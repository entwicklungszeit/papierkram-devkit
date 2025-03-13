import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class TogglApiConfig {
  readonly apiUrl: string = ''
  readonly username: string = ''
  readonly password: string = ''
  readonly projectId: string = ''

  constructor(private config: ConfigService) {
    this.apiUrl = this.config.get<string>('toggl_api_url') ?? ''
    this.username = this.config.get<string>('toggl_api_token') ?? ''
    this.password = this.config.get<string>('toggl_api_token_label') ?? ''
    this.projectId = this.config.get<string>('toggl_project_id') ?? ''
  }
}
