import { SchemaEnum, usersSchema } from '@shared/schemas'
import { ZodError } from 'zod'

export class SchemaValidator {
  public static validate(typeSchema: SchemaEnum, data: unknown) {
    let schema = null
    // TODO: Melhorar a lógica de seleção de schemas
    switch (typeSchema) {
      case SchemaEnum.CREATE_USER:
        schema = usersSchema
        break

      default:
        break
    }
    try {
      if (!schema) throw new Error('Schema not exist')
      return schema.parse(data)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(`Erro de validação: ${error.errors.map((e) => e.message).join(', ')}`)
      }
      throw error
    }
  }
}
