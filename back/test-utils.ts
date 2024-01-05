import { Application, Express } from 'express';
import config from './config';
import connectToDatabase from './database';

export function configureAppForTest(app: Application): Application {
  const testConfig = config.test.database;

  // Adjust the database configuration for tests
  const testDb = connectToDatabase(testConfig);

  // Ensure that locals property is available
  if (!app.locals) {
    app.locals = {};
  }

  app.locals.db = testDb;

  return app;
}
