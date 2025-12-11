import { terser } from "rollup-plugin-terser";
import { string } from "rollup-plugin-string";

export default {
  input: "src/index.js",
  output: {
    file: "dist/checkout.js",
    format: "iife",
    name: "PaymentGatewaySDK",
  },
  plugins: [
    string({
      include: "**/*.css"
    }),
    terser()
  ]
};
