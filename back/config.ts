import { AppConfig } from './interface/appConfig'

const config: Record<string, AppConfig> = {
    production: {
      database: {
        dbPath: './db/reaction_time_prod.db', // Path to production database
      },
    },
    test: {
      database: {
        dbPath: './db/reaction_time_test.db', // Path to test database
      },
    },
  };
  
  export default config;