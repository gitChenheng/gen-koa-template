import 'reflect-metadata';
import Router from "koa-router";

export enum DType{
  CTRL = "Controller",
}
export enum MetaProperty{
  Routes = "Routes",
  RequestPrefix = "RequestPrefix",
  Args = "Args",
}

export function ReadOnly(target, name, descriptor){
  descriptor.writable = false;
  return descriptor;
}

export function Controller(target){
  target.type = DType.CTRL;
}

export function RequestPrefix(prefix: string = ""){
  return function (target): void {
    Reflect.defineMetadata(MetaProperty.RequestPrefix, prefix, target);
  }
}

export enum RequestMethod {
  GET = 'get',
  POST = 'post',
  DELETE = 'delete',
  ALL = 'all',
  PUT = 'put',
  HEAD = 'head',
  PATCH = 'patch',
}
type Middleware = Router.IMiddleware;
export function RequestMapping(
  path: string,
  methodType: RequestMethod = RequestMethod.GET,
  middleware?: Middleware[] | Middleware,
): any {
  return function (target, propertyKey: string): void {
    /**
     * 如果装饰于类的public方法，target为类的实例化对象，target.constructor为类的构造方法
     * 如果装饰于类的static方法上，target为类的普通函数方法
     */
    if (!Reflect.hasMetadata(MetaProperty.Routes, target.constructor)) {
      Reflect.defineMetadata(
        MetaProperty.Routes,
        [],
        target.constructor
      );
    }
    let mds = Array.isArray(middleware) ? middleware : [middleware];
    mds = mds.filter(item => item !== undefined);
    const routes = Reflect.getMetadata(MetaProperty.Routes, target.constructor);
    routes.push({path, methodType, propertyKey, mds});
  }
}


export function body_fn(ctx, argKey?: string){
  const body = ctx.request.body || {};
  if (typeof argKey === 'string') return body[argKey];
  return body;
}
export function param_fn(ctx, argKey?: string){
  const query = ctx.query || {};
  if (typeof argKey === 'string') return query[argKey];
  return query;
}
export const createArgDecorator = (fn: (ctx, ...args: any[]) => any) => {
  return (arg, options?) => {
    return (target, propertyKey: string, argIndex: number) => {
      if(!Reflect.getMetadata(MetaProperty.Args, target.constructor, propertyKey)){
        Reflect.defineMetadata(MetaProperty.Args, [], target.constructor, propertyKey);
      }
      const ArgsArr = Reflect.getMetadata(MetaProperty.Args, target.constructor, propertyKey);
      ArgsArr.push({
        fn,
        arg,
        options: options || {},
        argIndex
      });
    }
  }
}
export const Body = createArgDecorator(body_fn);
export const Param = createArgDecorator(param_fn);
