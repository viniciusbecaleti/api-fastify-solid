import { Gym, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import { GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = []

  async create(data: Prisma.GymCreateInput) {
    const createdGym = {
      id: randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(String(data.latitude)),
      longitude: new Prisma.Decimal(String(data.longitude)),
    }

    this.gyms.push(createdGym)

    return createdGym
  }

  async findById(id: string) {
    const gym = this.gyms.find((gym) => gym.id === id)

    if (!gym) {
      return null
    }

    return gym
  }
}
