import { FastifyInstance } from "fastify";
import { Knex } from "knex"

declare module "fastify" {
  export interface FastifyInstance {
    knex: Knex;
  }
}
