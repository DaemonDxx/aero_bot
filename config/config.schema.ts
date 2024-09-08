import * as Joi from 'joi';

export const configSchema = Joi.object({
  TG_BOT_TOKEN: Joi.string().required(),
  GRPC_SERVER_URL: Joi.string().required()
})