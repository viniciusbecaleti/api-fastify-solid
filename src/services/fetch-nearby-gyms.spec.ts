import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { FetchNearbyGymsService } from './fetch-nearby-gyms.service'

let gymRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsService

describe('Find Nearby Gyms Service', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsService(gymRepository)
  })

  it('should be able to search gyms between 10km', async () => {
    await gymRepository.create({
      title: 'Gym 1',
      latitude: -22.3350489,
      longitude: -46.9498513,
    })

    await gymRepository.create({
      title: 'Gym 2',
      latitude: -22.347586,
      longitude: -46.949299,
    })

    await gymRepository.create({
      title: 'Gym 3',
      latitude: -22.4288106,
      longitude: -46.8274913,
    })

    const { gyms } = await sut.execute({
      userLatitude: -22.3091596,
      userLongitude: -46.95137,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Gym 1' }),
      expect.objectContaining({ title: 'Gym 2' }),
    ])
  })
})
