import { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { createProductHandler } from "../../controller/product";
import { $ref } from "../../schema/product";
import {
  GetProductParamsInput,
  ProductType,
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

      console.log(`Fetching product( ${id} )...`);

      const product = await fastify.knex.from('product');
      console.log(product);

      reply.code(200).send({
        id,
        title: "super product",
        price: 1000,
        content: "some content",
        type: ProductType.game,
        salesStartsAt: new Date(),
        salesEndsAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
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
    handler: createProductHandler,
  });
}

export default product;
