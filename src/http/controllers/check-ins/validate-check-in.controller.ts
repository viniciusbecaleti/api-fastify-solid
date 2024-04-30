import { LateCheckInValidationError } from '@/services/errors/late-check-in-validate-error'
import { ResourceNotFoundError } from '@/services/errors/resource-not-found-error'
import { makeValidateCheckInService } from '@/services/factories/make-validate-check-in-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function validateCheckInController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validateCheckInParamsSchema.parse(request.params)

  try {
    const validateCheckInService = makeValidateCheckInService()

    await validateCheckInService.execute({
      checkInId,
    })

    return reply.status(200).send()
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: err.message,
      })
    }

    if (err instanceof LateCheckInValidationError) {
      return reply.status(400).send({
        message: err.message,
      })
    }

    throw err
  }
}
