import { makeFetchUserCheckInHistoryService } from '@/services/factories/make-fetch-user-check-in-history-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchUserCheckInHistoryController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchUserCheckInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = fetchUserCheckInHistoryQuerySchema.parse(request.query)

  const userId = request.user.sub

  const fetchUserCheckInHistoryService = makeFetchUserCheckInHistoryService()

  const { checkIns } = await fetchUserCheckInHistoryService.execute({
    userId,
    page,
  })

  return reply.status(201).send({
    checkIns,
  })
}
