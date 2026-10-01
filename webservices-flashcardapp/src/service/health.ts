// import package.json as a whole, the file is 2 folders up from this file.
import packageJson from "../../package.json";

/**
 * 
 * @returns pong
 */
const ping = (): { pong: true } => {
  return { pong: true };
};
/**
 * 
 * @returns name, version, env
 */
const getVersion = (): { name: string; version: string; env: string | undefined } => {
  return {
    name: packageJson.name,
    version: packageJson.version,
    env: process.env.NODE_ENV,
  };
};

export default { ping, getVersion };
