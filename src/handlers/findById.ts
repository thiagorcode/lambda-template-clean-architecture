import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import {UsersRepository} from '../domain/repository/users.repository'
import {AppErrorException, formatResponse} from '../utils'
import {FindByIdUseCases} from '../domain/use-cases/findById.use-cases'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.debug('Event:', event)
    const userId = event.pathParameters?.id
    const repository = new UsersRepository()
    const findByIdCore = new FindByIdUseCases(repository)
    const users = await findByIdCore.execute(userId)

    return formatResponse(200, {
      message: 'Buscas realizada com sucesso!',
      users
    })
  } catch (err) {
    console.error(err)

    if (err instanceof AppErrorException) {
      return formatResponse(err.statusCode, {
        message: err.message
      })
    }
    return formatResponse(500, {
      message: 'some error happened'
    })
  }
}
