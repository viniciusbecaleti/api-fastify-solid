import { Environment } from 'vitest'

export default <Environment>{
  name: 'prisma',
  async setup() {
    console.log('Setting up Prisma environment')

    return {
      teardown() {},
    }
  },
  transformMode: 'ssr',
}
