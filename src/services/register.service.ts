import { UsersRepository } from '@/repositories/users.repository'
import { hash } from 'bcryptjs'

import { UserAlredyExistsError } from './errors/user-already-exists.error'

interface RegisterServiceRequest {
  name: string
  email: string
  password: string
}

export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterServiceRequest) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlredyExistsError()
    }

    const hashedPassword = await hash(password, 6)

    await this.usersRepository.create({
      name,
      email,
      hashed_password: hashedPassword,
    })
  }
}
