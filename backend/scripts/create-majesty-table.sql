-- Create majesty table for My Gig Guide Owner
CREATE TABLE IF NOT EXISTS majesty (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  title VARCHAR(255) DEFAULT 'Owner',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login DATETIME,
  settings JSON,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default Majesty (Owner) - password is 'Gu3ssWh@t' hashed with bcrypt
INSERT IGNORE INTO majesty (username, email, password, full_name, title, is_active, created_at, updated_at)
VALUES (
  'Thando', 
  'owner@mygigguide.local', 
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8Kz8Kz8K', 
  'Thando Hlophe', 
  'Owner', 
  true, 
  NOW(), 
  NOW()
);
