import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins.repository'

export class PrismaUsersRepository implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const createdCheckIn = await prisma.checkIn.create({
      data,
    })

    return createdCheckIn
  }
}
