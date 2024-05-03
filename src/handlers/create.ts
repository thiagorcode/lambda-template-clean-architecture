import {destr} from 'destr'
import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import {UsersTypes} from './../shared/types/users.types'
import {UsersRepository} from '../domain/repository/users.repository'
import {CreateUseCases} from '../domain/use-cases/create.use-cases'
import {AppErrorException, formatResponse} from '../utils'
import {DynamoDbAdapter} from '@adapter/dynamodb/dynamodb.adapter'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      throw new AppErrorException(400, 'Body not found!')
    }
    const body = destr<UsersTypes>(event.body)
    const databaseAdapter = new DynamoDbAdapter(process.env.TABLE_NAME ?? '', 'id')
    const repository = new UsersRepository(databaseAdapter)
    const createUserUseCases = new CreateUseCases(repository)

    await createUserUseCases.execute(body)
    return formatResponse(200, {
      message: 'Usuário criado com sucesso!'
    })
  } catch (err) {
    console.error(err)

    if (err instanceof AppErrorException) {
      return formatResponse(err.statusCode, {
        message: err.message
      })
    }
    return formatResponse(500, {
      message: 'Erro inesperado',
      err
    })
  }
}
