import { UsersRepository } from '@/repositories/users.repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserProfileService } from './get-user-profile.service'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: UsersRepository
let sut: GetUserProfileService

describe('Get User Profile Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileService(usersRepository)
  })

  it('should be able to get a user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      hashed_password: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.id).toEqual(createdUser.id)
  })

  it('should not be able to get a user profile with not exists', async () => {
    await expect(() =>
      sut.execute({
        userId: 'user-not-exists',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
