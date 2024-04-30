import { makeGetUserMetricsService } from '@/services/factories/make-get-user-metrics-service'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getUserMetricsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub

  const getUserMetrics = makeGetUserMetricsService()

  const { checkInsCount } = await getUserMetrics.execute({
    userId,
  })

  return reply.status(200).send({
    checkInsCount,
  })
}
