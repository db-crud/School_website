-- Database Schema for GMSS Khajura

CREATE DATABASE IF NOT EXISTS gmss_khajura;
USE gmss_khajura;

-- Admin Users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'superadmin') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notices / News
CREATE TABLE IF NOT EXISTS notices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    date DATE NOT NULL,
    type VARCHAR(50) DEFAULT 'General', -- e.g., 'Exam', 'Holiday', 'Event'
    attachment_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teachers
CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    qualification VARCHAR(255) NOT NULL,
    photo_url VARCHAR(255),
    contact_number VARCHAR(100),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gallery
CREATE TABLE IF NOT EXISTS gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    image_url VARCHAR(255) NOT NULL,
    category VARCHAR(100), -- e.g., 'Sports', 'Cultural', 'Building'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admission Information (Dynamic details like eligibility, documents)
CREATE TABLE IF NOT EXISTS admission_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_name VARCHAR(100) NOT NULL, -- e.g., 'Eligibility', 'Required Documents'
    content TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site Content (Dynamic text for various sections)
CREATE TABLE IF NOT EXISTS site_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_name VARCHAR(50) NOT NULL, -- 'home', 'about', 'academics'
    section_key VARCHAR(100) NOT NULL, -- 'hero_title', 'mission_text'
    section_value TEXT NOT NULL,
    UNIQUE KEY (page_name, section_key)
);
