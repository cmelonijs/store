import { generateAccessToken, paypal } from "../lib/paypal";

// TEST TO GENERATE ACCESS TOKEN FROM PAYPAL
test("generates token from paypal", async () => {
  const tokenResponse = await generateAccessToken();

  console.log("tokenResponse", tokenResponse);

  expect(typeof tokenResponse).toBe("string");

  expect(tokenResponse.length).toBeGreaterThan(0);
});

// TEST TO GENERATE A PAYPAL ORDER
test("creates a paypal order", async () => {
  const price = 10.0;

  const orderResponse = await paypal.createOrder(price);

  console.log("order response", orderResponse);

  expect(orderResponse).toHaveProperty("id");
  expect(orderResponse).toHaveProperty("status");
  expect(orderResponse.status).toBe("CREATED");
});

// TEST CAPTURE PAYMENT WITH A MOCK ORDER
test("simulate capturing a payment from an order", async () => {
  const orderId = "100";

  const mockCapturePayment = jest
    .spyOn(paypal, "capturePayment")
    .mockResolvedValue({
      status: "COMPLETED",
    });

  const captureResponse = await paypal.capturePayment(orderId);

  expect(captureResponse).toHaveProperty("status", "COMPLETED");

  mockCapturePayment.mockRestore();
});
