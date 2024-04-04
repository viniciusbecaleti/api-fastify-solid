import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'
import { compare } from 'bcryptjs'
import { describe, expect, it, beforeEach } from 'vitest'

import { UserAlredyExistsError } from './errors/user-already-exists.error'
import { RegisterService } from './register.service'

let userRepository: InMemoryUsersRepository
let sut: RegisterService

describe('Register Service', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new RegisterService(userRepository)
  })

  it('should hash user password upon registration', async () => {
    const password = '123456'

    const { user } = await sut.execute({
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
    const email = 'john@doe.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlredyExistsError)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
})
