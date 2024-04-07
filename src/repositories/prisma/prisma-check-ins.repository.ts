import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins.repository'
import dayjs from 'dayjs'

export class PrismaUsersRepository implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const createdCheckIn = await prisma.checkIn.create({
      data,
    })

    return createdCheckIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    return null
  }
}
