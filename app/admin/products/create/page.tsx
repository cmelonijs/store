import ProductForm from "@/components/admin/product-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a product",
};

const CreateProductPage = () => {
  return (
    <>
      <h2 className="h2-bold">Create a Product</h2>
      <ProductForm type="Create" />
    </>
  );
};

export default CreateProductPage;
