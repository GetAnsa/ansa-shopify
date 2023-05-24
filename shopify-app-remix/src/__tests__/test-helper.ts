import crypto from "crypto";

import fetchMock, { MockParams } from "jest-fetch-mock";
import { LATEST_API_VERSION } from "@shopify/shopify-api";
import { MemorySessionStorage } from "@shopify/shopify-app-session-storage-memory";

import { shopifyApp, ShopifyApp } from "../index";
import { AppConfigParams } from "../config-types";

// eslint-disable-next-line import/no-mutable-exports
export let testConfig: AppConfigParams & {
  api: {
    apiKey: string;
    apiSecretKey: string;
    scopes: string[];
    apiVersion: string;
  };
};
// eslint-disable-next-line import/no-mutable-exports
export let shopify: ShopifyApp;

export const SHOPIFY_HOST = "totally-real-host.myshopify.io";
export const BASE64_HOST = Buffer.from(SHOPIFY_HOST).toString("base64");
export const TEST_SHOP = "test-shop.myshopify.io";
export const TEST_WEBHOOK_ID = "1234567890";

beforeEach(() => {
  testConfig = {
    api: {
      apiKey: "testApiKey",
      apiSecretKey: "testApiSecretKey",
      scopes: ["testScope"],
      apiVersion: LATEST_API_VERSION,
      hostName: "my-test-app.myshopify.io",
      logger: {
        log: jest.fn(),
      },
    },
    sessionStorage: new MemorySessionStorage(),
  };

  shopify = shopifyApp(testConfig);
});

// TODO: Everything after this point is a copy of shopify-app-express and should be moved into a shared internal package
// Not logging as issue. Will be taken care of in: https://github.com/orgs/Shopify/projects/6899/views/1?pane=issue&itemId=27471073
export type MockBody =
  | string
  | {
      [key: string]: any;
    };

export function mockShopifyResponse(body: MockBody, init?: MockParams) {
  fetchMock.mockResponse(
    typeof body === "string" ? body : JSON.stringify(body),
    init
  );
}

export function mockShopifyResponses(
  ...responses: ([MockBody] | [MockBody, MockParams])[]
) {
  const parsedResponses: [string, MockParams][] = responses.map(
    ([body, init]) => {
      const bodyString = typeof body === "string" ? body : JSON.stringify(body);

      return init ? [bodyString, init] : [bodyString, {}];
    }
  );

  fetchMock.mockResponses(...parsedResponses);
}

export function createTestHmac(secretKey: string, body: string): string {
  return crypto
    .createHmac("sha256", secretKey)
    .update(body, "utf8")
    .digest("base64");
}