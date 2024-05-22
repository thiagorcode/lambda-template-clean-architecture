import jwt from 'jsonwebtoken'
import {UsersRepositoryInterface} from '../repository/interface/usersRepository.interface'
import {AppErrorException} from '../../utils'
import {User} from '@domain/entity/user.entity'

export class AuthLoginUseCases {
  constructor(private repository: UsersRepositoryInterface) {}

  async execute(username: string, password: string) {
    console.info('init validateAuth service')
    const dataUser = await this.repository.findByUsername(username)

    if (!dataUser) {
      console.error('user invalid')
      throw new AppErrorException(400, 'Usuário ou senha incorretos!')
    }
    const user = User.toDomain(dataUser)
    const isMatchPassword = user.comparePassword(password)
    if (!isMatchPassword) {
      console.error('password invalid')
      throw new AppErrorException(400, 'Usuário ou senha incorretos!')
    }

    // TODO: Aplicar injeção
    const jwtSecret = 'teste1234'
    const jwtToken = jwt.sign(
      {
        userId: dataUser.id,
        email: dataUser.email
      },
      jwtSecret,
      {expiresIn: '36h'}
    )
    return {
      token: jwtToken,
      id: dataUser.id,
      email: dataUser.email,
      username: dataUser.username
    }
  }
}
