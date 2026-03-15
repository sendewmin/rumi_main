CREATE TABLE IF NOT EXISTS roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    CONSTRAINT chk_role_name CHECK (role_name IN ('admin','rentee','renter'))
);