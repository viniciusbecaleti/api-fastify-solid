import { GymsRepository } from '@/repositories/gyms-repository'
import { Gym } from '@prisma/client'

interface CreateGymServiceRequest {
  title: string
  description: string | null
  phone: string | null
  longitude: number
  latitude: number
}

interface CreateGymServiceResponse {
  gym: Gym
}

export class CreateGymService {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    title,
    description,
    phone,
    longitude,
    latitude,
  }: CreateGymServiceRequest): Promise<CreateGymServiceResponse> {
    const createdGym = await this.gymsRepository.create({
      title,
      description,
      phone,
      longitude,
      latitude,
    })

    return {
      gym: createdGym,
    }
  }
}
