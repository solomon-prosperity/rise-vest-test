import logger from "pino";
import dayjs from "dayjs";

const log = logger({
  prettyPrint: process.env.NODE_ENV !== "test", // Disable prettyPrint in test environment
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
  level: process.env.NODE_ENV === "test" ? "silent" : "info", // Disable all logging in test environment
});

export default log;
