import { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { $ref } from "../../schema/product";
import {
  GetProductParamsInput,
  CreateProductInput,
} from "../../schema/product";

const product: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/:id', {
    schema: {
      params: $ref("getProductParamsSchema"),
      querystring: $ref("getProductQuerySchema"),
      response: {
        200: {
          ...$ref("productResponseSchema"),
          description: "取得成功",
        },
      },
      tags: ["Product"],
    },
    handler: async function (
      request: FastifyRequest<{ Params: GetProductParamsInput }>,
      reply: FastifyReply
    ) { 
      const id = request.params.id;
      const product = await fastify
        .knex('product')
        .where({ id })
        .first();

      reply.code(200).send({
        id,
        title: product?.title,
        price: product?.price,
        content: product?.content,
        type: product?.type,
        salesStartsAt: product?.salesStartsAt,
        salesEndsAt: product?.salesEndsAt,
        createdAt: product?.createdAt,
        updatedAt: product?.updatedAt,
      });

    }
  })

  fastify.post("/", {
    schema: {
      body: $ref("createProductBodySchema"),
      response: {
        201: { ...$ref("productResponseSchema"), description: "登録完了" },
      },
      tags: ["Product"],
    },
    handler: async function (
      request: FastifyRequest<{ Body: CreateProductInput }>,
      reply: FastifyReply
    ) { 
      const defaultFields = {
        createdAt: fastify.knex.fn.now(),
        updatedAt: fastify.knex.fn.now(),
      };
      const [ id ] = await fastify.knex("product").insert({
        title: request.body.title, 
        price: request.body.price,
        content: request.body.content || "",
        type: request.body.type, 
        salesStartsAt: request.body.salesStartsAt, 
        salesEndsAt: request.body.salesEndsAt,
        ...defaultFields,
      });

      const product = await fastify
        .knex("product")
        .where({ id })
        .first();

      reply.code(201).send({
        id,
        title: product?.title,
        price: product?.price,
        content: product?.content,
        type: product?.type,
        salesStartsAt: product?.salesStartsAt,
        salesEndsAt: product?.salesEndsAt,
        createdAt: product?.createdAt,
        updatedAt: product?.updatedAt,
      });
    }
  });
}

export default product;
