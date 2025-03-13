"use server";

import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import { PAGE_SIZE } from "../constants";
import { LATEST_PRODUCT_LIMIT } from "../constants";
import { revalidatePath } from "next/cache";

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

// get all products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
}) {
  const data = await prisma.product.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// delete product
export async function deleteProduct(id: string) {
  try {
    const productExists = await prisma.product.findFirst({
      where: {
        id: id,
      },
    });

    if (!productExists) throw new Error("Pruuc is not found");

    await prisma.product.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: formatError(err),
    };
  }
}
