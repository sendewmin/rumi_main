CREATE TABLE IF NOT EXISTS renter_profiles (
    user_id VARCHAR(128) PRIMARY KEY,
    location VARCHAR(255),
    gender ENUM('male','female','other'),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
