import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Render and other PaaS providers use DATABASE_URL
const DATABASE_URL = process.env.DATABASE_URL;

const sequelize = DATABASE_URL
  ? new Sequelize(DATABASE_URL, {
      dialect: "postgres",
      logging: process.env.NODE_ENV === "development" ? console.log : false,
      dialectOptions: {
        ssl:
          process.env.NODE_ENV === "production"
            ? {
                require: true,
                rejectUnauthorized: false, // Required for some PaaS providers like Render
              }
            : false,
      },
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    })
  : new Sequelize({
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      database: process.env.DB_NAME || "motor_db",
      username: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "",
      dialect: "postgres",
      logging: process.env.NODE_ENV === "development" ? console.log : false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });

export default sequelize;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const connectDB = async (retries = 5, delayMs = 3000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await sequelize.authenticate();
      console.log("✅ Database connection established successfully.");

      if (process.env.NODE_ENV === "development") {
        await sequelize.sync({ alter: true });
        console.log("✅ Database models synchronized (development mode).");
      } else {
        await sequelize.sync({ alter: false });
        console.log("✅ Database models synchronized (production mode).");
      }
      return; // success
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(
        `❌ DB connection attempt ${attempt}/${retries} failed: ${errorMessage}`,
      );

      if (attempt < retries) {
        const wait = delayMs * attempt; // linear back-off: 3s, 6s, 9s, 12s
        console.log(`⏳ Retrying in ${wait / 1000}s...`);
        await sleep(wait);
      } else {
        console.error("💥 All database connection attempts failed.");
        throw error;
      }
    }
  }
};
