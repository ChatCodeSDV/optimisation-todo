import { JSONSchemaType } from 'ajv'

export interface CreateTodoInput {
  title: string
  description?: string
}

export const createTodoSchema: JSONSchemaType<CreateTodoInput> = {
  type: 'object',
  properties: {
    title: { type: 'string', nullable: false },
    description: { type: 'string', nullable: true }
  },
  required: ['title'],
  additionalProperties: false
}
