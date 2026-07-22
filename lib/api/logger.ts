import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

const LOG_DIR = path.join(process.cwd(), "logs");

const logFormat = winston.format.combine(
   winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
   winston.format.simple()
);

const globalForLogger = globalThis as unknown as {
   logger: winston.Logger | undefined;
};

function createWinstonLogger() {
   const instance = winston.createLogger({
      level: process.env.NODE_ENV === "development" ? "debug" : "info",
      format: logFormat,
      transports: [
         new DailyRotateFile({
            dirname: LOG_DIR,
            filename: "combined-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "14d",
            level: "info",
         }),
         new DailyRotateFile({
            dirname: LOG_DIR,
            filename: "error-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "30d",
            level: "error",
         }),
      ],
   });

   if (process.env.NODE_ENV !== "production") {
      instance.add(
         new winston.transports.Console({
            format: winston.format.combine(
               winston.format.colorize(),
               winston.format.printf(({ timestamp, level, message }) => {
                  return `[${timestamp}] ${level}: ${message}`;
               })
            ),
         })
      );
   }

   return instance;
}

export const logger = globalForLogger.logger ?? createWinstonLogger();

if (process.env.NODE_ENV !== "production") {
   globalForLogger.logger = logger;
}
