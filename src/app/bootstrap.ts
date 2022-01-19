import Koa from "koa";
import path from "path";
import helmet from "koa-helmet";
import serve from "koa-static";
import {cors, verify} from "@middleware/interceptor";
import koaBody from "koa-body";
import bodyParser from "koa-bodyparser";
import router from "@/src/app/route";
import {logger} from "@util/log4/log4Util";
import config from "@config/config";
import DB from "@/src/app/db";
import RedisIo from "@/src/app/redis";

export default class Bootstrap{
  constructor() {
    this.dbServer();
    this.redisServer();
    this.httpServer();
  }
  
  httpServer(){
    const serverMiddlewares = [
      helmet(),
      serve(path.join(process.cwd(), "/public/"), {maxage: 12 * 30 * 24 * 3600 * 1000}),
      cors(),
      verify(),
      koaBody({multipart: true, formidable: {maxFileSize: 1000 * 1024 * 1024}}),//10M
      bodyParser(),
      router.routes(),
      router.allowedMethods(),
    ];
    const App = new Koa();
    serverMiddlewares.forEach(_cb => {
      App.use(_cb);
    });
    App.listen(
      config.httpserver.port,
      () => {logger.trace(`httpserver start at port:${config.httpserver.port}`)}
    );
  }
  
  dbServer(){
    DB.createDatabase();
  }
  
  redisServer(){
    RedisIo.createRedis();
  }
  
}
