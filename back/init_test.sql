-- init_test.sql
DROP TABLE IF EXISTS Users;

-- Create table Users
CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    best_time INTEGER
);

-- Insert data init
INSERT INTO Users (username, password, best_time) VALUES ('existinguser', 'newpassword', 100);
INSERT INTO Users (username, password, best_time) VALUES ('nonexistentuser', 'invalidpassword', 150);
INSERT INTO Users (username, password, best_time) VALUES ('testuser', 'testpassword', 110);