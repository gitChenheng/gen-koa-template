import UserEntity from "@/src/app/models/userEntity";
import {uncodeUtf16, utf16toEntities} from "@/src/utils/util";
import DB from "@/src/app/db";
import {QueryTypes} from "sequelize";
import {hash_sha256} from "@util/crypto";

export const createUser = async (_item) => {
  _item.username = utf16toEntities(_item.username);
  return await UserEntity.create(_item);
}

export const findOne = async (obj) => {
  return await UserEntity.findOne({
    raw: true,
    where: obj,
  })
}

export const findUser = async (conditions: any) => {
  return await UserEntity.findAll({
    raw: true,
    where: conditions
  });
}

export const existName = async (_name) => {
  const username = utf16toEntities(_name);
  const count = await UserEntity.count({
    where: {username}
  });
  return count > 0;
}

export const checkUser = async (_name, _pwd) => {
  const username = utf16toEntities(_name);
  const pwd = hash_sha256(_pwd);
  return await UserEntity.findOne({
    raw: true,
    where: {username, pwd}
  });
}

export const getUserCountByName = async (_name) => {
  const dbCtx = DB.getDBCtx();
  const name = utf16toEntities(_name);
  const count = await dbCtx.query(
    `SELECT count(*) FROM user WHERE username=:name`,
    {
      type: QueryTypes.SELECT,
      plain: false,
      raw: true,
      replacements: {
        name
      }
    }
  );
  return count[0]['count(*)'];
}

export const findUserById = async (id: number) => {
  const object_user = await UserEntity.findOne({
    raw: true,
    where: {id}
  });
  object_user.username = uncodeUtf16(object_user.username);
  return object_user;
}

export const updateUser = async (_item, condition) => {
  await UserEntity.update(
    _item,
    {where: condition}
  );
}

export const destroyUser = async (id) => {
  return await UserEntity.destroy({
    where: {id}
  });
}
