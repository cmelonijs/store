"use server";

import { CartItem } from "@/types";
import { cookies } from "next/headers";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

// calculate cart prices
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => {
      return acc + Number(item.price) * item.qty;
    }, 0)
  );

  const shippingPrice = round2(itemsPrice < 100 ? 1 : 10);

  const taxPrice = round2(0.22 * itemsPrice);

  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    // get the cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    // get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // get cart
    const cart = await getMyCart();

    // parse and validate item
    const item = cartItemSchema.parse(data);

    // find item in the db
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) throw new Error("Product not found");

    if (!cart) {
      // create new cart object

      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      // add item to database
      await prisma.cart.create({
        data: newCart,
      });

      // revalidate product page
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} added to the cart`,
      };
    } else {
      // check if item is already in the cart
      const existsItem = (cart.items as CartItem[]).find(
        (prod) => prod.productId === item.productId
      );

      if (existsItem) {
        // check the stock
        if (product.stock < existsItem.qty + 1) {
          throw new Error("Not enough stock");
        }

        // increase the quantity
        (cart.items as CartItem[]).find(
          (prod) => prod.productId === item.productId
        )!.qty = existsItem.qty + 1;
      } else {
        // check stock
        if (product.stock < 1) throw new Error("Not enough stock");

        // add item to cart items
        cart.items.push(item);
      }

      // add item to database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${
          existsItem ? "updated in" : "added to"
        } cart`,
      };
    }
  } catch (err) {
    return {
      success: false,
      message: formatError(err),
    };
  }
}

export async function getMyCart() {
  // get the cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart session not found");

  // get session and user ID
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  // convert decimals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
  });
}

export async function removeItemFormCart(productId: string) {
  try {
    // get the cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    // get product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });

    if (!product) throw new Error("Product not found");

    // get user cart
    const cart = await getMyCart();

    if (!cart) throw new Error("Cart not found");

    // check for item
    const exist = (cart.items as CartItem[]).find(
      (prod) => prod.productId === productId
    );

    if (!exist) throw new Error("Item not found");

    // check if only one in qty
    if (exist.qty === 1) {
      //remove from cart
      cart.items = (cart.items as CartItem[]).filter(
        (prod) => prod.productId !== exist.productId
      );
    } else {
      // decrease qty by one
      (cart.items as CartItem[]).find(
        (prod) => prod.productId === productId
      )!.qty = exist.qty - 1;
    }

    // update the cart in the db
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[]),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} was removed from cart`,
    };
  } catch (err) {
    return {
      success: false,
      message: formatError(err),
    };
  }
}
