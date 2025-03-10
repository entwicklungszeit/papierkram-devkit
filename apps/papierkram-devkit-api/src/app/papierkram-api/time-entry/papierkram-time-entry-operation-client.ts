import { PapierkramImportOperation } from '@papierkram/api'

export interface PapierkramTimeEntryOperationClient {
  execute(operation: PapierkramImportOperation): Promise<void>
}
