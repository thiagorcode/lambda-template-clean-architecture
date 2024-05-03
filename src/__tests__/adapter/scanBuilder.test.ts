import {FilterExpression} from '../../adapter/dynamodb/types'
import {FilterBuilder} from '../../adapter/dynamodb/filterBuilder'

describe('ScanBuilder', () => {
  it('Should return params ', () => {
    const filter: FilterExpression[] = [
      {
        attributeName: 'username',
        operator: 'EQ',
        value: 'johndoe12'
      }
    ]
    const result = FilterBuilder.build(filter)
    expect(result).toEqual({
      expressionAttributeNames: {'#attr0': 'username'},
      expressionAttributeValues: {':val0': {value: {S: 'johndoe12'}}},
      filterExpression: '#attr0 = :val0'
    })
  })
})
