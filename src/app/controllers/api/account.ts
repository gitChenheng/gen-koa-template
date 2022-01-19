import {Body, Controller, RequestMapping, RequestMethod, RequestPrefix} from "@/src/decorators";
import JSONResult from "@util/JSONResult";
import {logger} from "@util/log4/log4Util";
import {userLogin, userRegister} from "@service/userSer";

@Controller
@RequestPrefix('/account')
export default class Account{
  
  @RequestMapping('/register', RequestMethod.POST)
  async register(
    @Body('name', {require: true, max: 20, min: 2}) name: string,
    @Body('pwd', {require: true}) pwd: string,
  ){
    try {
      const res = await userRegister(name, pwd);
      if(!res){
        return JSONResult.err(null, `name already exist`);
      }
      return JSONResult.ok();
    }catch (e){
      logger.error(JSON.stringify(e));
    }
  }
  
  @RequestMapping('/login', RequestMethod.POST)
  async login(
    @Body('name', {require: true, max: 20, min: 2}) name: string,
    @Body('pwd', {require: true}) pwd: string,
  ){
    try {
      const res = await userLogin(name, pwd);
      if(!res)
        return JSONResult.err(null, `name or pwd wrong, or the account does not exist`);
      return JSONResult.ok(res);
    }catch (e){
      logger.error(JSON.stringify(e));
    }
  }
  
  @RequestMapping('/testToken', RequestMethod.POST)
  async testToken(){
    return JSONResult.ok();
  }
  
}
