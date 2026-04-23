import { data } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.public.appProxy(request);

  return data({
    ok: true,
    message: "Proxy root working",
  });
};
