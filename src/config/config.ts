import dev from "./config-dev";
import prod from "./config-prod";
import {logger} from "@util/log4/log4Util";
import {ENV_PROD} from "@/src/constants";

const env = process.env.NODE_ENV;
logger.info(`current env is ${env}`);

const config = env === ENV_PROD ? prod : dev;

export default config;
