import { Repository } from '@sensenet/client-core'
import { schema } from './schema'

export const testRepository = new Repository(
  {
    schemas: schema,
  },
  jest.fn(() => {
    return {
      ok: true,
      json: jest.fn(),
    }
  }) as any,
)
