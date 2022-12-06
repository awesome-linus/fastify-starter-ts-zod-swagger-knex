import { v4 as uuidv4 } from "uuid";
import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateProductInput,
} from "../schema/product";

export const createProductHandler = async (
  request: FastifyRequest<{ Body: CreateProductInput }>,
  reply: FastifyReply
) => {
  const id = uuidv4();
  const createdAt = new Date();
  const updatedAt = new Date();

  console.log("Product created.");

  reply.code(201).send({
    id,
    title: request.body.title,
    price: request.body.price,
    content: request.body.content,
    type: request.body.type,
    salesStartsAt: request.body.salesStartsAt,
    salesEndsAt: request.body.salesEndsAt,
    createdAt,
    updatedAt,
  });
};
