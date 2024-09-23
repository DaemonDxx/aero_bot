import * as Joi from 'joi';

export const configSchema = Joi.object({
  TG_BOT_TOKEN: Joi.string().required(),
  GRPC_SERVER_URL: Joi.string().required(),
  BOT_PG_SESSION_HOST: Joi.string().required(),
  BOT_PG_SESSION_PORT: Joi.number().port().required(),
  BOT_PG_SESSION_USER: Joi.string().required(),
  BOT_PG_SESSION_PASSWORD: Joi.string().required(),
  BOT_PG_SESSION_DB: Joi.string().required(),
  KAFKA_BROKER: Joi.string().uri().required(),
  KAFKA_TOPIC: Joi.string(),
});
