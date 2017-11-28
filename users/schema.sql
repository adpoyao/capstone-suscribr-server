DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS category_type;
DROP TYPE IF EXISTS frequency_type;

CREATE TYPE category_type AS ENUM (
  'music', 'entertainment', 'work', 'lifestyle', 'other'
);

CREATE TYPE frequency_type AS ENUM (
  'daily', 'weekly', 'monthly', 'annually'
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  username TEXT NOT NULL,
  passhash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  subscription_name TEXT NOT NULL,
  category category_type NOT NULL DEFAULT 'other',
  price FLOAT,
  frequency frequency_type NOT NULL DEFAULT 'monthly',
  cc_type TEXT,
  cc_digits INT,
  cc_nickname TEXT,
  due_date DATE,
  active BOOLEAN NOT NULL DEFAULT 'true',
  user_id INT REFERENCES users ON DELETE CASCADE
);

-- DUMMY DATA --
INSERT INTO users (first_name, last_name, email, username, passhash) VALUES
('Eddie', 'Yao', 'eddie.thinkful@gmail.com', 'adpoyao', 'abc'),
('Andy', 'Gaines', 'andy.thinkful@gmail.com', 'zizify', 'xyz');

INSERT INTO subscriptions (subscription_name, category, price, frequency, cc_type, cc_digits, cc_nickname, due_date, user_id) VALUES
('Spotify', 'music', '9.99', 'monthly', 'VA', '1234', 'EddieCC', '2018-11-11', '1'),
('NameCheap', 'work', '8.88', 'annually', 'VA', '1234', 'AndyCC', '2018-12-12', '2'),
('Netflix', 'entertainment', '5.99', 'monthly', 'MC', '1234', 'AndyCC', '2018-12-16', '2');

