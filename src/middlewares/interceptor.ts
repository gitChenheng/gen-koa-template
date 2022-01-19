import jwt from "jsonwebtoken";
import {JWT_SECRET, TOKEN_SIGN} from "@/src/constants";
import whitelist from "@config/whitelist";
import RedisIo from "@/src/app/redis";
import {restify} from "@/src/app/route";
import JSONResult from "@util/JSONResult";

/**
 * ctx.set("Access-Control-Allow-Credentials", "false");
 * ctx.set("X-XSS-Protection", "1; mode=block");
 * ctx.set("Content-Security-Policy", "default-src \'self\' code.jquery.com;form-action \'self\'");
 * ctx.set("X-FRAME-OPTIONS", "DENY");
 * */
export const cors = () => {
  return async (ctx, next) => {
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT");
    ctx.set("Access-Control-Allow-Headers", `Content-Type,Accept,x-requested-with,${TOKEN_SIGN}`);
    if (ctx.method === "OPTIONS"){
      ctx.set("Access-Control-Max-Age", 3600 * 24);
      ctx.body = "";
    }
    await next();
  }
}

const urlJudge = (request_url: string) => {
  if (request_url.indexOf("?") > -1){
    const final_request_url = request_url.split("?")[0];
    return !!whitelist.includes(final_request_url);
  }else{
    return !!whitelist.includes(request_url);
  }
}

export const verify = () => {
  return async (ctx, next) => {
    const url = ctx.request.url;
    if(urlJudge(url)){
      await next();
    }else{
      const token = ctx.request.header[TOKEN_SIGN.toLowerCase()];
      const tokenValue = await RedisIo.getInstance().get(token);
      if(tokenValue){
        await next();
      }else{
        await jwt.verify(
          token,
          JWT_SECRET,
          null,
          async (err, decoded) => {
            if(err){
              restify(ctx, JSONResult.unauthorized());
            }else{
              await next();
            }
          }
        )
      }
    }
  }
}
