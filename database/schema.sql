-- MySQL database schema for Fashion Grid KE
-- Run this script to create the database and tables

CREATE DATABASE IF NOT EXISTS fashion_grid_ke
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE fashion_grid_ke;

-- Users table
CREATE TABLE IF NOT EXISTS User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products table
CREATE TABLE IF NOT EXISTS Product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    imageUrl VARCHAR(500) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Delivery zones table
CREATE TABLE IF NOT EXISTS DeliveryZone (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders table
CREATE TABLE IF NOT EXISTS `Order` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    deliveryZoneId INT NOT NULL,
    totalAmount DECIMAL(10,2) NOT NULL,
    mpesaReceipt VARCHAR(100) DEFAULT NULL,
    paymentStatus VARCHAR(50) NOT NULL DEFAULT 'pending',
    orderStatus VARCHAR(50) NOT NULL DEFAULT 'processing',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (deliveryZoneId) REFERENCES DeliveryZone(id) ON DELETE RESTRICT,
    INDEX idx_userId (userId),
    INDEX idx_paymentStatus (paymentStatus),
    INDEX idx_orderStatus (orderStatus)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order items table
CREATE TABLE IF NOT EXISTS OrderItem (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (orderId) REFERENCES `Order`(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES Product(id) ON DELETE RESTRICT,
    INDEX idx_orderId (orderId),
    INDEX idx_productId (productId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- M-Pesa logs table
CREATE TABLE IF NOT EXISTS MpesaLog (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data JSON NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: Insert default delivery zones
INSERT INTO DeliveryZone (name, price) VALUES
('Nairobi CBD', 200),
('Nairobi Outside', 300),
('Kiambu', 350),
('Other Counties', 500)
ON DUPLICATE KEY UPDATE price = VALUES(price);  -- if you have unique constraint on name, else ignore

-- Optional: Create admin user (password: admin123) - you should change after first login
-- Password hash for 'admin123' using bcrypt (10 rounds)
INSERT INTO User (name, email, password, phone, role) VALUES
('Admin', 'admin@fashiongrid.com', '$2a$10$YourBcryptHashHere', '0112870234', 'admin')
ON DUPLICATE KEY UPDATE email = email;
-- Note: Replace the hash with a real bcrypt hash generated via code.
-- For quick start, run the Prisma seed script instead of hardcoding hash here.