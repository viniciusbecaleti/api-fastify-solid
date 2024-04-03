import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'
import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'

import { UserAlredyExistsError } from './errors/user-already-exists.error'
import { RegisterService } from './register.service'

describe('Register Service', () => {
  it('should hash user password upon registration', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(inMemoryUsersRepository)

    const password = '123456'

    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password,
    })

    const isPasswordCorrectlyHashed = await compare(
      password,
      user.hashed_password,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(inMemoryUsersRepository)

    const email = 'john@doe.com'

    await registerService.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    await expect(() =>
      registerService.execute({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlredyExistsError)
  })

  it('should be able to register', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(inMemoryUsersRepository)

    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
})
