import {DynamoDBAdapterInterface} from '@adapter/dynamodb/dynamodb-adapter.interface'
import {UsersTypes} from '@shared/types'
import {UsersRepositoryInterface} from './interface/usersRepository.interface'
import {User} from '@domain/entity/user.entity'

export class UsersRepository implements UsersRepositoryInterface {
  constructor(private databaseAdapter: DynamoDBAdapterInterface) {}

  async createUser(data: User) {
    await this.databaseAdapter.add<UsersTypes>(data.toCreateDto())
  }

  async findById(id: string) {
    return await this.databaseAdapter.get<UsersTypes>(id)
  }

  async findByUsername(username: string) {
    const response = await this.databaseAdapter.query<UsersTypes>(username, [
      {
        attributeName: 'username',
        operator: 'EQ',
        value: username
      }
    ])
    return response[0]
  }

  async findAll() {
    return await this.databaseAdapter.scan<UsersTypes[]>()
  }
}
