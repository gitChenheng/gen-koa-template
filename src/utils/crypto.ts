import crypto from "crypto";
import {JWT_SECRET} from "@/src/constants";
import jwt from "jsonwebtoken";

export const hash_sha256 = (content: string) => {
  const hash = crypto.createHash("sha256");
  hash.update(content, 'utf8');
  return hash.digest('hex');
}

export const aes_crypto = () => {}

export const rsa_crypto = () => {}

export const jwtSign = async (infos) => {
  return await jwt.sign(infos, JWT_SECRET, {expiresIn: "1d"});
}
