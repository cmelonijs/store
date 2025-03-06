export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "bye";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION || "CarlomJs E-commerce";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCT_LIMIT =
  Number(process.env.LATEST_PRODUCT_LIMIT) || 4;
export const signInDefaultValues = {
  email: "",
  password: "",
};

export const signUpDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const shippingAddressDefaultValue = {
  fullName: "Massimo",
  streetAddress: "Via Cagliari 21",
  city: "Sassari",
  postalCode: "07100",
  country: "Italy",
};
