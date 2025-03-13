"use client";

import { Product } from "@/types";
import { useRouter } from "next/navigation";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { productDefaultValues } from "@/lib/constants";
import { Form } from "../ui/form";
//  if (!res.success) {
//    toast.error(res.message);

//    return;
//  }

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: "Create" | "Update";
  product?: Product;
  productId?: string;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver: zodResolver(
      type === "Create" ? insertProductSchema : updateProductSchema
    ),
    defaultValues:
      product && type === "Update" ? product : productDefaultValues,
  });

  return (
    <Form {...form}>
      <form className="space-y-4">
        <div className="flex flex-col md:flex-row gap-5">
          {/* Name */}
          {/* Slug */}
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          {/* Cateogry */}
          {/* Brand */}
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          {/* Price */}
          {/* Stock */}
        </div>
        <div className="upload-field flex flex-col md:flex-row gap-5">
          {/* Images */}
        </div>
        <div className="upload-field">Upload field</div>
        <div>{/* Description */}</div>
        <div>{/* Submit */}</div>
      </form>
    </Form>
  );
};

export default ProductForm;
