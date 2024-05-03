import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import {UsersRepository} from '../domain/repository/users.repository'
import {AppErrorException, formatResponse} from '../utils'
import {AuthLoginUseCases} from '../domain/use-cases/authLogin.use-cases'
import {ValidateRequestCore} from '../domain/use-cases/validateRequest.core'
import {LoginSchema, LoginTypes} from '../shared'
import {DynamoDbAdapter} from '@adapter/dynamodb/dynamodb.adapter'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = ValidateRequestCore.execute<LoginTypes>(LoginSchema, event)
    const databaseAdapter = new DynamoDbAdapter(process.env.TABLE_NAME ?? '', 'id')
    const repository = new UsersRepository(databaseAdapter)
    const loginCore = new AuthLoginUseCases(repository)

    const userAccess = await loginCore.execute(body.username, body.password)

    return formatResponse(200, {
      message: 'Acesso realizado com sucesso',
      userAccess
    })
  } catch (err) {
    console.error(err)

    if (err instanceof AppErrorException) {
      return formatResponse(err.statusCode, {
        message: err.message
      })
    }
    return formatResponse(500, {
      message: 'Erro inesperado!'
    })
  }
}
