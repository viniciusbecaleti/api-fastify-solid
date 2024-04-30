import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { checkInController } from './check-in.controller'
import { fetchUserCheckInHistoryController } from './fetch-user-check-in-history.controller'
import { getUserMetricsController } from './get-user-metrics.controller'
import { validateCheckInController } from './validate-check-in.controller'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/gyms/:gymId/check-ins', checkInController)
  app.get('/check-ins/history', fetchUserCheckInHistoryController)
  app.get('/check-ins/metrics', getUserMetricsController)
  app.patch('/check-ins/:checkInId/validate', validateCheckInController)
}
