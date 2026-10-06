CREATE DATABASE IF NOT EXISTS susu_db;
USE susu_db;

-- Users Table (SRS §6 / PRD §4: Unique username/email)
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Role ENUM('Admin', 'Member') DEFAULT 'Member',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cycles Table (SRS §3 Functional Req: Weekly cycle management)
CREATE TABLE Cycles (
    CycleID INT AUTO_INCREMENT PRIMARY KEY,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Status ENUM('Active', 'Completed') DEFAULT 'Active'
);

-- Payments Table (SRS §6 / PRD §4: Amount + PaymentDate + ProxyPayerID)
CREATE TABLE Payments (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL,
    PaymentDate DATE NOT NULL,
    ProxyPayerID INT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ProxyPayerID) REFERENCES Users(UserID)
);

-- Records Table (SRS §6 / PRD §4: EatDate + Once-per-cycle rule)
CREATE TABLE Records (
    RecordID INT AUTO_INCREMENT PRIMARY KEY,
    CycleID INT NOT NULL,
    UserID INT NOT NULL,
    EatDate DATE NOT NULL,
    Type ENUM('Collection', 'Default') DEFAULT 'Collection',
    FOREIGN KEY (CycleID) REFERENCES Cycles(CycleID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    UNIQUE KEY unique_eat_per_cycle (CycleID, UserID)
);