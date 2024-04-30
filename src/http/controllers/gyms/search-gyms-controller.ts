import { makeSearchGymsService } from '@/services/factories/make-search-gyms-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function searchGymsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const searchGymsBodySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { q, page } = searchGymsBodySchema.parse(request.query)

  const searchGymsService = makeSearchGymsService()

  const { gyms } = await searchGymsService.execute({
    query: q,
    page,
  })

  return reply.status(201).send({
    gyms,
  })
}
