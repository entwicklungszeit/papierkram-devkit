import { Module } from '@nestjs/common'
import { PapierkramApiConfig } from './papierkram-api-config.service'
import { PapierkramTimeEntryCreateOperationClient } from './papierkram-time-entry-create-operation-client.service'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { PapierkramTimeEntryImporter } from './papierkram-time-entry-importer.service'
import { PapierkramTimeEntryUpdateOperationClient } from './papierkram-time-entry-update-operation-client.service'
import { PapierkramTimeEntryDeleteOperationClient } from './papierkram-time-entry-archive-operation-client.service'
import { PapierkramTimeEntryOperationClientToken } from './papierkram-time-entry-operation-client.token'

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  providers: [
    PapierkramApiConfig,
    PapierkramTimeEntryImporter,
    PapierkramTimeEntryCreateOperationClient,
    PapierkramTimeEntryUpdateOperationClient,
    PapierkramTimeEntryDeleteOperationClient,
    {
      provide: PapierkramTimeEntryOperationClientToken,
      useFactory: (createClient, updateClient, archiveClient) => [
        createClient,
        updateClient,
        archiveClient
      ],
      inject: [
        PapierkramTimeEntryCreateOperationClient,
        PapierkramTimeEntryUpdateOperationClient,
        PapierkramTimeEntryDeleteOperationClient
      ]
    }
  ],
  exports: [
    PapierkramTimeEntryImporter,
    PapierkramTimeEntryOperationClientToken
  ]
})
export class PapierkramTimeEntryModule {}
