import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.DATABASE_URL as string;

/* Creating a new instance of Sequelize. */
export const sequelize = new Sequelize(url);
