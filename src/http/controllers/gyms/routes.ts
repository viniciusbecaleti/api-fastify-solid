import { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { createGymController } from './create-gym.controller'
import { searchGymsController } from './search-gyms-controller'
import { fetchNearbyGymsController } from './fetch-nearby-gyms-controller'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/gyms', createGymController)
  app.get('/gyms/search', searchGymsController)
  app.get('/gyms/nearby', fetchNearbyGymsController)
}
