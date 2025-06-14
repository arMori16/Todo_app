import { JwtPayload } from './jwtPayload.type'; // Путь к вашему типу JwtPayload

declare global {
  namespace Express {
    interface User extends JwtPayload {}

  }
}