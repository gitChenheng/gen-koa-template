import "module-alias/register";
import { Sequelize } from "sequelize-typescript";
import config from "@config/config";
import path from "path";

export default class DB{
  private static db_ctx: Sequelize = null;
  public static createDatabase(): void {
    const {database, username, password} = config.mysql;
    this.db_ctx = new Sequelize(database, username, password, {
      dialect: 'mysql',
      define: {
        timestamps: true, //开启时间戳
        paranoid: true, //开启假删除
        underscored: true, //下划线
        charset: "utf8",
        freezeTableName: true //固定表名为单数
      },
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      timezone: "+08:00", //东八时区
      models: [path.join(process.cwd(), "/src/app/models/")]
    });
  }
  
  public static getDBCtx(): Sequelize {
    if(!this.db_ctx)
      this.createDatabase();
    return this.db_ctx;
  }
  
}
