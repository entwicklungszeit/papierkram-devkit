import { Test } from '@nestjs/testing'
import { PapierkramTimeEntryModule } from './papierkram-time-entry.module'
import { PapierkramTimeEntryImporter } from './papierkram-time-entry-importer.service'
import { PapierkramTimeEntryOperationClientToken } from './papierkram-time-entry-operation-client.token'
import { PapierkramTimeEntryOperationClient } from './papierkram-time-entry-operation-client'

describe(PapierkramTimeEntryImporter.name, () => {
  it('injects needed clients', async () => {
    const module = await Test.createTestingModule({
      imports: [PapierkramTimeEntryModule]
    }).compile()

    const clients = module.get<PapierkramTimeEntryOperationClient[]>(
      PapierkramTimeEntryOperationClientToken
    )

    expect(clients).toHaveLength(3)
  })

  it('raises an error if no suitable client could be executed', async () => {
    const module = await Test.createTestingModule({
      imports: [PapierkramTimeEntryModule]
    })
      .overrideProvider(PapierkramTimeEntryOperationClientToken)
      .useValue([])
      .compile()

    const importer = module.get(PapierkramTimeEntryImporter)

    await expect(() => importer.execute(null as any)).rejects.toThrow(
      'No suitable client has been executed'
    )
  })

  it('succeeds when a client has been executed successful', async () => {
    const module = await Test.createTestingModule({
      imports: [PapierkramTimeEntryModule]
    })
      .overrideProvider(PapierkramTimeEntryOperationClientToken)
      .useValue([
        { execute: () => Promise.reject('I fail') },
        { execute: () => Promise.resolve('I succeed') }
      ])
      .compile()

    const importer = module.get(PapierkramTimeEntryImporter)

    await expect(importer.execute(null as any)).resolves.not.toThrow()
  })
})
