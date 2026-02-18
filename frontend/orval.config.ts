import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: {
      target: "./openapi.json",
    },
    output: {
      target: "./src/api/endpoints",
      schemas: "./src/api/model",
      client: "fetch",
      mode: "tags-split",
      baseUrl: "",
      override: {
        mutator: {
          path: "./src/api/client.ts",
          name: "customFetch",
        },
      },
    },
  },
});
