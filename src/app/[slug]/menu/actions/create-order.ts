"use server";

import { db } from "@/lib/prisma";
import { ConsumptionMethod } from "@prisma/client";
import { removeCpfPunctuation } from "../helpers/cpf";

interface CreateOrderInput {
  customerName: string;
  customerCpf: string;
  customerEmail: string;
  customerEndereco: string;
  products: Array<{
    id: string;
    quantity: number;
  }>;
  consumptionMethod: ConsumptionMethod;
  slug: string;
}
export const createOrder = async (input: CreateOrderInput) => {
  const restaurant = await db.restaurant.findUnique({
    where: {
      slug: input.slug,
    },
  });
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }
  const productsWithPrices = await db.product.findMany({
    where: {
      id: {
        in: input.products.map((product) => product.id),
      },
    },
  });
  const productsWithPricesAndQuantities = input.products.map((product) => ({
    quantity: product.quantity,
    productId: product.id,
    price: productsWithPrices.find((p) => p.id === product.id)!.price,
  }));
  await db.order.create({
    data: {
      status: "PENDING",
      customerName: input.customerName,
      customerCpf: removeCpfPunctuation(input.customerCpf),
      customerEmail: input.customerEmail,
      customerEndereco: input.customerEndereco,
      orderProducts: {
        createMany: {
          data: productsWithPricesAndQuantities,
        },
      },
      total: productsWithPricesAndQuantities.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0,
      ),
      consumptionMethod: input.consumptionMethod,
      restaurantId: restaurant.id,
    },
  });
};
