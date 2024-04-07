import { GymsRepository } from '@/repositories/gyms-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { CreateGymService } from './create-gym.service'

let gymRepository: GymsRepository
let sut: CreateGymService

describe('Create Gym Service', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository()
    sut = new CreateGymService(gymRepository)
  })

  it('should be able to create a gym', async () => {
    const { gym } = await sut.execute({
      title: 'Gym 01',
      latitude: -22.0,
      longitude: -47.0,
      phone: '123456789',
      description: 'Gym 01 description',
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
