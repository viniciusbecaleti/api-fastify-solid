import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins.repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { ValidateCheckInService } from './validate-check-in.service'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInService

describe('Validate Check In Service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInService(checkInsRepository)
  })

  it('should be able to validate a check in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-01',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).not.toBe(null)
  })

  it('should not be able to validate a nonexistent check in', async () => {
    await expect(
      sut.execute({
        checkInId: 'nonexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
