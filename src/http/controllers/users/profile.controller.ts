import { ResourceNotFoundError } from '@/services/errors/resource-not-found-error'
import { makeGetUserProfileService } from '@/services/factories/make-get-user-profile-service'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function profileController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub

  try {
    const getUserProfileService = makeGetUserProfileService()

    const { user } = await getUserProfileService.execute({
      userId,
    })

    return reply.status(200).send({
      profile: {
        ...user,
        hashed_password: undefined,
      },
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(400).send({
        message: err.message,
      })
    }

    throw err
  }
}
