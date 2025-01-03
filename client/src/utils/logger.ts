// utils/logger.ts
const createProductionLogger = () => {
  if (process.env.NODE_ENV === "production") {
    return {
      log: () => {},
      info: () => {},
      warn: () => {},
      error: () => {},
      debug: () => {},
      trace: () => {},
    };
  }
  return console;
};

export const logger = createProductionLogger();
