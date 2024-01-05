import express from 'express';
import bodyParser from 'body-parser';
import config from './config';
import connectToDatabase from './database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from './interface/users';

const app = express();
const port = 3000;
const secretKey = 'your_secret_key';

const env = process.env.NODE_ENV || 'test';
const dbConfig = config[env].database;

// Configurez votre application en fonction de la configuration de la base de données
const db = connectToDatabase(dbConfig);
app.locals.db = db;

app.use(bodyParser.json());

// Middleware to verify JWT token
const verifyToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
          return res.status(401).json({ message: 'Invalid token' });
      }

      // Attach the decoded payload to the request for later use
      req.body.decoded = decoded;
      next();
  });
};

app.post('/register', async (req, res) => {
  const { username, password }: User = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Add a new user to the Users table
  db.run('INSERT INTO Users (username, password) VALUES (?, ?)', [username, hashedPassword], function (err) {
      if (err) {
          // Check for unique constraint violation
          if (err.message.includes('UNIQUE constraint failed')) {
              res.status(400).json({ message: 'Username is already taken' });
          } else {
              console.error('Error registering user:', err.message);
              res.status(500).json({ message: 'Server error' });
          }
      } else {
          console.log('User registered successfully. ID:', this.lastID);

          // Generate a JWT token for the user
          const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

          res.status(201).json({ message: 'User registered successfully', id: this.lastID, token });
      }
  });
});

app.post('/login', async (req, res) => {
  const { username, password }: { username: string, password: string } = req.body;

  // Retrieve the user from the database by username
  db.get('SELECT * FROM Users WHERE username = ?', [username], async (err, user: User) => {
      if (err) {
          console.error('Error during login:', err.message);
          res.status(500).json({ message: 'Server error' });
      } else if (!user) {
          res.status(401).json({ message: 'Invalid credentials' });
      } else {
          // Compare the provided password with the hashed password from the database
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) {
              // Generate a JWT token for the user
              const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

              res.status(200).json({ message: 'Login successful', token });
          } else {
              res.status(401).json({ message: 'Invalid credentials' });
          }
      }
  });
});

// Endpoint to edit the best_time for a user
app.put('/editBestTime', verifyToken, async (req, res) => {
  const { best_time }: { best_time: number } = req.body;
  const { username } = req.body.decoded;

  // Update the best_time for the user
  db.run('UPDATE Users SET best_time = ? WHERE username = ?', [best_time, username], function (err) {
      if (err) {
          console.error('Error updating best_time:', err.message);
          res.status(500).json({ message: 'Server error' });
      } else {
          console.log('Best time updated successfully for user:', username);
          res.status(200).json({ message: 'Best time updated successfully' });
      }
  });
});

// Endpoint to get all best times
app.get('/getAllBestTimes', verifyToken, (req, res) => {
  // Retrieve all best times from the Users table
  db.all('SELECT username, best_time FROM Users', (err, rows: User[]) => {
      if (err) {
          console.error('Error getting all best times:', err.message);
          res.status(500).json({ message: 'Server error' });
      } else {
          const bestTimes = rows.map(user => ({ username: user.username, best_time: user.best_time }));
          res.status(200).json({ bestTimes });
      }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;