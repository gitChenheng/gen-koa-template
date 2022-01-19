import * as userDao from "@repository/userDao";
import {uncodeUtf16, utf16toEntities} from "@util/util";
import {hash_sha256, jwtSign} from "@util/crypto";
import RedisIo from "@/src/app/redis";
import {existName} from "@repository/userDao";

export const userRegister = async (_name, _pwd) => {
  const count = await existName(_name);
  if(count)
    return false;
  await createUser({
    username: _name,
    pwd: hash_sha256(_pwd),
  })
  return true;
}

export const userLogin = async (_name, _pwd) => {
  const username = utf16toEntities(_name);
  const pwd = hash_sha256(_pwd);
  const user = await userDao.findOne({username, pwd});
  if(user){
    const userInfo = {
      name: uncodeUtf16(username),
      id: user.id,
      uid: user.uid,
    }
    const token = await jwtSign(userInfo);
    await RedisIo.set(token, JSON.stringify(userInfo));
    return token;
  }else{
    return false;
  }
}

export const createUser = async(_item) => {
  return await userDao.createUser(_item);
}

export const findUserById = async (id: number) => {
  return await userDao.findUserById(id);
}

export const updateUserById = async (_item, id) => {
  await userDao.updateUser(_item, {id});
}

export const destroyUserById = async (id) => {
  return await userDao.destroyUser(id);
}
