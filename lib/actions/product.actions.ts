"use server";

import { prisma } from "@/db/prisma";
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCT_LIMIT } from "../constants";

// get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCT_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
  });

  //   return data;
  return convertToPlainObject(data);
}

// get signle product by slug

export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}
