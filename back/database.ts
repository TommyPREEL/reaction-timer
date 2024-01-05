import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { DatabaseConfig } from './interface/databaseConfig';

const env = process.env.NODE_ENV || 'test';
let initSqlPath: string;

if (env === 'test') {
    initSqlPath = path.join(__dirname, 'init_test.sql');
  } else {
    initSqlPath = path.join(__dirname, 'init.sql');
  }

const connectToDatabase = (config: DatabaseConfig): sqlite3.Database => {
    const { dbPath } = config;
  
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error connecting to SQLite database:', err.message);
      } else {
        //console.log('Connected to SQLite database');

        const initSql = fs.readFileSync(initSqlPath, 'utf-8');
  
        // Execute the SQL script
        db.exec(initSql, (execErr) => {
          if (execErr) {
            console.error('Error executing SQL script:', execErr.message);
          } else {
            //console.log('SQL script executed successfully');
          }
        });
      }
    });
  
    return db;
  };
  
  export default connectToDatabase;
