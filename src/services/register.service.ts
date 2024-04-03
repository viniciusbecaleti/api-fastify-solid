import { UsersRepository } from '@/repositories/users.repository'
import { User } from '@prisma/client'
import { hash } from 'bcryptjs'

import { UserAlredyExistsError } from './errors/user-already-exists.error'

interface RegisterServiceRequest {
  name: string
  email: string
  password: string
}

interface RegisterServiceResponse {
  user: User
}

export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterServiceRequest): Promise<RegisterServiceResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlredyExistsError()
    }

    const hashedPassword = await hash(password, 6)

    const createdUser = await this.usersRepository.create({
      name,
      email,
      hashed_password: hashedPassword,
    })

    return {
      user: createdUser,
    }
  }
}
