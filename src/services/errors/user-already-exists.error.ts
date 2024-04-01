export class UserAlredyExistsError extends Error {
  constructor() {
    super('User with this email already exists')
  }
}
