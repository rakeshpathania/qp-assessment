import { createLogger, format, transports } from "winston";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
// Status Codes
export const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
  UNPROCESSABLE_ENTITY: 422,
  FORBIDDEN: 403,
  CREATED: 201,
  NO_CONTENT: 204,
} as const;

export interface SuccessResponse<T = Record<string, unknown>> {
  status: string;
  message: string;
  data: T;
}

export const SUCCESS_STATUS = <T>(message: string, data: T = {} as T): SuccessResponse<T> => {
  return {
    status: "success",
    message,
    data,
  };
};

export const SUCCESS_CREATED_STATUS = <T>(message: string, data: T = {} as T): SuccessResponse<T> => {
  return {
    status: "created",
    message,
    data,
  };
};

// Logger Configuration
export const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: "api-service" },
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
});

if (process.env.NODE_ENV !== "dev") {
  [
    { filename: "logs/error.log", level: "error" },
    { filename: "logs/combined.log" },
  ].forEach(({ filename, level }) =>
    logger.add(
      new transports.File({ filename, level, maxsize: 5242880, maxFiles: 5 })
    )
  );
}

// Base Error Class
export class BaseError extends Error {
  public statusCode: number;
  public details: unknown;
  public isOperational: boolean;

  constructor(name: string, statusCode: number, message: string, details: unknown = null) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific Error Classes
export class APIError extends BaseError {
  constructor(message = "Internal Server Error", details: unknown = {}) {
    super("APIError", STATUS_CODES.INTERNAL_ERROR, message, details);
  }
}

export class BadRequestError extends BaseError {
  constructor(message = "Bad request", details: unknown = {}) {
    super("BadRequestError", STATUS_CODES.BAD_REQUEST, message, details);
  }
}

export class ValidationError extends BaseError {
  constructor(message = "Validation Error", details: unknown = {}) {
    super("ValidationError", STATUS_CODES.UNPROCESSABLE_ENTITY, message, details);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message = "Unauthorized", details: unknown = {}) {
    super("UnauthorizedError", STATUS_CODES.UNAUTHORIZED, message, details);
  }
}

export class NotFoundError extends BaseError {
  constructor(message = "Not found", details: unknown = {}) {
    super("NotFoundError", STATUS_CODES.NOT_FOUND, message, details);
  }
}

// Error Handling Middleware
export const handleError = (
  err: BaseError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(err);
  const { statusCode = STATUS_CODES.INTERNAL_ERROR, message, details } = err;
  res.status(statusCode).json({ status: "error", message, details });
};

// Process Handlers
export const initializeErrorHandling = (): void => {
  process.on("uncaughtException", (err) => {
    logger.error("Uncaught Exception:", err);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason) => {
    logger.error(
      "Unhandled Rejection:",
      reason instanceof Error ? reason.stack : JSON.stringify(reason)
    );
    process.exit(1);
  });

  ["SIGTERM", "SIGINT"].forEach((signal) =>
    process.on(signal, () => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      process.exit(0);
    })
  );
};
