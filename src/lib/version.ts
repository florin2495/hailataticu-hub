import pkg from "../../package.json";

/** Version of the build that is running (bundled at build time; bumped before every push to main). */
export const APP_VERSION: string = pkg.version;
