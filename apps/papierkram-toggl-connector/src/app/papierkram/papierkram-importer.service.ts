import { Injectable } from '@nestjs/common'
import { PapierkramImportOperation } from './types/papierkram-import-operation'

@Injectable()
export class PapierkramImporter {
  async import(importOperations: PapierkramImportOperation[]) {
    return Promise.resolve()
  }
}
