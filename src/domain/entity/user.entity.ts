import {CreateUsers, UnmarshallingUser} from '@shared/types'
import {Entity} from '../common/entity'
import {EncryptPassword} from '@adapter/encryptPassword/encrypt-password.adapter'
import {SchemaEnum} from '@shared/schemas'
export class User extends Entity<CreateUsers> {
  private constructor({id, dtCreated, dtUpdated, ...props}: CreateUsers) {
    super(props, id, dtCreated, dtUpdated)
  }

  public static createUser(props: CreateUsers) {
    const encryptPassword = new EncryptPassword()
    const {passwordEncrypted, salt} = encryptPassword.encrypt(props.password)
    const userProps: CreateUsers = {
      email: props.email,
      username: props.username,
      firstName: props.firstName,
      isActive: props.isActive ?? false,
      password: passwordEncrypted,
      salt,
      isPasswordChange: props.isPasswordChange ?? false,
      lastName: props.lastName
    }
    const instance = new User(userProps)
    instance.validate(SchemaEnum.CREATE_USER)

    return instance
  }
  public toCreateDto() {
    return {
      ...this.props,
      id: this.id,
      dtCreated: this.created,
      dtUpdated: this.updated
    }
  }

  public toDto() {}
  public comparePassword(inputPassword: string) {
    const encryptPassword = new EncryptPassword()
    const isValidated = encryptPassword.desEncrypt(inputPassword, this.props.password, this.props.salt)

    return isValidated
  }

  public static toDomain(raw: UnmarshallingUser) {
    const instance = new User(raw)
    return instance
  }
}
