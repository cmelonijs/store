import { generateAccessToken } from "../lib/paypal";

// TEST TO GENERATE ACCESS TOKEN FROM PAYPAL
test("generates token from paypal", async () => {
  const tokenResponse = await generateAccessToken();

  console.log("tokenResponse", tokenResponse);

  expect(typeof tokenResponse).toBe("string");

  expect(tokenResponse.length).toBeGreaterThan(0);
});
