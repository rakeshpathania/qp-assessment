import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { logger, initializeErrorHandling, handleError } from "./utils/errorHandlers.js";
import { AppDataSource } from "./database/dataSource.js";
import groceryRouter from "./routes/groceryRoutes.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
// Load environment variables
dotenv.config();
class Server {
    app;
    port;
    constructor() {
        this.app = express();
        this.port = parseInt(process.env.PORT || "5000", 10);
        this.initializeMiddleware();
        this.initializeRoutes();
        this.errorHandler();
    }
    initializeMiddleware() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        initializeErrorHandling();
    }
    initializeRoutes() {
        this.app.get("/", (_req, res) => {
            res.send("Welcome to the TypeScript Express API!");
        });
        // Initialize admin routes
        this.app.use('/api/grocery', groceryRouter);
        this.app.use('/api/user', userRouter);
        this.app.use('/api/admin', adminRouter);
        this.app.use('/api/order', orderRouter);
    }
    errorHandler() {
        this.app.use(handleError);
    }
    async connectToDatabase() {
        try {
            logger.info("Initializing database connection...");
            await AppDataSource.initialize();
            logger.info("Database connection established successfully.");
        }
        catch (error) {
            logger.error("Database connection failed:", error);
            throw error;
        }
    }
    setupGracefulShutdown(server) {
        const shutdown = async () => {
            logger.info("Received shutdown signal. Starting graceful shutdown...");
            server.close(async () => {
                logger.info("HTTP server closed.");
                try {
                    await AppDataSource.destroy();
                    logger.info("Database connection closed.");
                    process.exit(0);
                }
                catch (error) {
                    logger.error("Error during shutdown:", error);
                    process.exit(1);
                }
            });
            // Force shutdown after 30 seconds
            setTimeout(() => {
                logger.error("Could not close connections in time, forcefully shutting down");
                process.exit(1);
            }, 30000);
        };
        process.on("SIGTERM", shutdown);
        process.on("SIGINT", shutdown);
    }
    async start() {
        try {
            await this.connectToDatabase();
            const server = this.app.listen(this.port, () => {
                logger.info(`Server is running on http://localhost:${this.port}`);
                logger.info(`Server environment: ${process.env.NODE_ENV || "development"}`);
            });
            server.on("error", (error) => {
                logger.error("Server encountered an error:", error);
                process.exit(1);
            });
            this.setupGracefulShutdown(server);
        }
        catch (error) {
            logger.error("Failed to start server:", {
                message: error instanceof Error ? error.message : "Unknown error",
                stack: error instanceof Error ? error.stack : "No stack available",
                timestamp: new Date().toISOString(),
            });
            process.exit(1);
        }
    }
}
// Start the server
const server = new Server();
server.start().catch((error) => {
    logger.error("Startup error:", error);
    process.exit(1);
});
