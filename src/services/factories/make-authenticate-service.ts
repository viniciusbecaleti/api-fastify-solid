import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository'

import { AuthenticateService } from '../authenticate.service'

export function MakeAuthenticateService() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const authenticateService = new AuthenticateService(prismaUsersRepository)

  return authenticateService
}
