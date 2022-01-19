import devConf from "./dev.json";
import prodConf from "./prod.json";
import { configure, getLogger } from "log4js";
import {ENV_PROD} from "@/src/constants";

const logger = getLogger();
// logger.level = 'trace';
// logger.trace('trace')
// logger.debug('debug')
// logger.info('info');
// logger.warn('warn')
// logger.error('error')
// logger.fatal('fatal')

configure(process.env.NODE_ENV === ENV_PROD ? prodConf : devConf);

export {
  logger
}
