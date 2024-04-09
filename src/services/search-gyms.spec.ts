import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { SearchGymsService } from './search-gyms.service'

let gymRepository: InMemoryGymsRepository
let sut: SearchGymsService

describe('Search Gyms Service', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository()
    sut = new SearchGymsService(gymRepository)
  })

  it('should be able to search gyms', async () => {
    await gymRepository.create({
      title: 'Gym 1',
      latitude: -22,
      longitude: -23,
    })

    await gymRepository.create({
      title: 'Gym 2',
      latitude: -25,
      longitude: -27,
    })

    const { gyms } = await sut.execute({
      query: 'Gym 1',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Gym 1',
      }),
    ])
  })

  it('should be able to search paginated gyms', async () => {
    for (let i = 1; i <= 22; i++) {
      if (i > 20) {
        await gymRepository.create({
          title: `JavaScript ${i}`,
          latitude: -22,
          longitude: -23,
        })

        return
      }

      await gymRepository.create({
        title: `Gym ${i}`,
        latitude: -22,
        longitude: -23,
      })
    }

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript 21',
      }),
      expect.objectContaining({
        title: 'JavaScript 22',
      }),
    ])
  })
})
