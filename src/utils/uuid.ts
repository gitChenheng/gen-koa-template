import { v4 as uuidv4 } from "uuid";
import uniqId from "uniqid";

export function newUuid(){
  return uuidv4();
}

export function newUniqId(){
  return uniqId();
}
