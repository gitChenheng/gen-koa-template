import Router from "koa-router";
import fs from "fs";
import {body_fn, DType, MetaProperty, param_fn, RequestMethod} from "@/src/decorators";
import JSONResult from "@util/JSONResult";
import {logger} from "@util/log4/log4Util";
import assert from "assert";

/**
 * type可以声明基本类型别名、联合类型、元组
 * interface可以声明合并
 * */
type ResponseBodyProps = {
  code: number;
  data?: any;
  msg: string;
}
interface ResponseProps{
  type?: string;
  status: number;
  body: ResponseBodyProps
}
export const restify = (ctx,res: ResponseProps) => {
  switch (Object.prototype.toString.call(res)){
    case '[object String]':
      ctx.type = 'text/html;charset=utf-8';
      ctx.status = 200;
      ctx.body = res;
      break;
    default:
      ctx.type = res.type || "application/json";
      ctx.status = res.status;
      ctx.body = res.body;
  }
}

const router = new Router();
const targetPath = `${process.cwd()}/src/app/controllers/api/`;
const files = fs.readdirSync(targetPath);
for (const f of files){
  import(`${targetPath}${String(f)}`)
  .then(module => {
    const _ctrl = module.default;
    if(_ctrl?.type && _ctrl.type === DType.CTRL){
      const inst = new _ctrl();
      const requestPrefix = Reflect.getMetadata(MetaProperty.RequestPrefix, _ctrl) || '';
      const routes = Reflect.getMetadata(MetaProperty.Routes, _ctrl);
      routes.forEach((route, index) => {
        logger.trace(
          route.methodType,//get、post
          `/api${requestPrefix}${route.path}`,//url
          route.propertyKey,//classname
        );
        const argsObject = Reflect.getMetadata(MetaProperty.Args, _ctrl, route.propertyKey);
        if(argsObject?.length){
          for (const _it of argsObject){
            if(route.methodType === RequestMethod.GET && _it.fn === body_fn){
              assert.fail(`function: ${route.propertyKey} should use Param decorator instead of Body`);
              return;
            }
            if(route.methodType === RequestMethod.POST && _it.fn === param_fn){
              assert.fail(`function: ${route.propertyKey} should use Body decorator instead of Param`);
              return;
            }
          }
        }
        router[route.methodType](
          `/api${requestPrefix}${route.path}`,
          ...route.mds,
          async (ctx, next) => {
            if(!argsObject){
              const res: ResponseProps = await inst[route.propertyKey]();
              restify(ctx, res);
              return;
            }
            let argValueArr = [];
            for (const _obj of argsObject) {
              const {fn, arg, options, argIndex} = _obj;
              const v = await fn(ctx, arg);
              if(options.require && !v){
                restify(ctx, JSONResult.err(`param '${arg}' is required.`));
                return;
              }
              if(options.max && (v.length>options.max)){
                restify(ctx, JSONResult.err(`data too long for column '${arg}'`));
                return;
              }
              if(options.min && (v.length<options.min)){
                restify(ctx, JSONResult.err(`data too short for column '${arg}'`));
                return;
              }
              argValueArr.push(v);
            }
            const res = await inst[route.propertyKey](...argValueArr.reverse());
            restify(ctx, res);
          }
        );
      })
    }
  })
}

export default router;
