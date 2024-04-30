import { MaxDistanceError } from '@/services/errors/max-distance-error'
import { MaxNumberOfCheckInsError } from '@/services/errors/max-number-of-check-ins-error'
import { ResourceNotFoundError } from '@/services/errors/resource-not-found-error'
import { makeCheckInService } from '@/services/factories/make-check-in-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function checkInController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const checkInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const checkInBodySchema = z.object({
    userLatitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    userLongitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { gymId } = checkInParamsSchema.parse(request.params)

  const { userLatitude, userLongitude } = checkInBodySchema.parse(request.body)

  const userId = request.user.sub

  try {
    const checkInService = makeCheckInService()

    await checkInService.execute({
      gymId,
      userId,
      userLatitude,
      userLongitude,
    })

    return reply.status(201).send()
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: err.message,
      })
    }

    if (err instanceof MaxDistanceError) {
      return reply.status(400).send({
        message: err.message,
      })
    }

    if (err instanceof MaxNumberOfCheckInsError) {
      return reply.status(400).send({
        message: err.message,
      })
    }

    throw err
  }
}
