import { Hono } from "hono";

//工作原理
// webhook 扩展最多可监听四个可配置的事件/钩子，这些事件/钩子将触发对配置的 url 的 POST 请求。
export const webhook = new Hono()
  .post("/save", async (c) => {
    const json = await c.req.json();
    console.log(json);
    if (c.req.header("token") !== "459824aaffa928e05f5b1caec411ae5f") {
      return c.text("认证失败");
    }
    // console.log(c.req.);
    return c.json({
      message: "suceess",
    });
  })
  .get("/", (c) => {
    return c.json({
      message: "suceess",
    });
  });
