import Redis from "ioredis";
import config from "@config/config";

export default class RedisIo{
  static redisInst: Redis = null;
  static createRedis(){
    this.redisInst = new Redis(config);
  }
  static getInstance(): Redis{
    if(!this.redisInst){
      this.createRedis();
    }
    return this.redisInst;
  }
  static async set(key, value, time?){
    await this.redisInst.set(key, value);
    await this.redisInst.expire(key, time || 2 * 24 * 60 * 60);//2d
  }
  static async get(key){
    return await this.redisInst.get(key);
  }
  static async scan(key){
    // await this.redisInst.scan()
  }
}
