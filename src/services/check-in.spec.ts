import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins.repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'
import { Prisma } from '@prisma/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { CheckInService } from './check-in.service'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInService

describe('Check Ins Service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInService(checkInsRepository, gymsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const gym = await gymsRepository.create({
      title: 'Gym 01',
      latitude: new Prisma.Decimal(-22.3091596),
      longitude: new Prisma.Decimal(-46.95137),
      description: '',
      phone: '',
    })

    const { checkIn } = await sut.execute({
      gymId: gym.id,
      userId: 'user-01',
      userLatitude: -22.3091596,
      userLongitude: -46.95137,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to a check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const gym = await gymsRepository.create({
      title: 'Gym 01',
      latitude: new Prisma.Decimal(-22.3091596),
      longitude: new Prisma.Decimal(-46.95137),
      description: '',
      phone: '',
    })

    await sut.execute({
      gymId: gym.id,
      userId: 'user-01',
      userLatitude: -22.3091596,
      userLongitude: -46.95137,
    })

    await expect(() =>
      sut.execute({
        gymId: gym.id,
        userId: 'user-01',
        userLatitude: -22.3091596,
        userLongitude: -46.95137,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to a check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const gym = await gymsRepository.create({
      title: 'Gym 01',
      latitude: new Prisma.Decimal(-22.3091596),
      longitude: new Prisma.Decimal(-46.95137),
      description: '',
      phone: '',
    })

    await sut.execute({
      gymId: gym.id,
      userId: 'user-01',
      userLatitude: -22.3091596,
      userLongitude: -46.95137,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: gym.id,
      userId: 'user-01',
      userLatitude: -22.3091596,
      userLongitude: -46.95137,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    const gym = await gymsRepository.create({
      title: 'Gym 01',
      latitude: new Prisma.Decimal(-22.1924287),
      longitude: new Prisma.Decimal(-46.7574322),
      description: '',
      phone: '',
    })

    await expect(() =>
      sut.execute({
        gymId: gym.id,
        userId: 'user-01',
        userLatitude: -22.3091596,
        userLongitude: -46.95137,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
