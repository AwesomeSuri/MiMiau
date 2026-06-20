CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    current_session_id VARCHAR(255) NULL
);
CREATE TABLE IF NOT EXISTS cats_catalog (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    image VARCHAR(100) NOT NULL,
    sprite_sheet VARCHAR(100) NOT NULL,
    facts JSON
);
CREATE TABLE IF NOT EXISTS user_cats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    cat_id INT NOT NULL,
    level INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (cat_id) REFERENCES cats_catalog(id) ON DELETE CASCADE
);

INSERT IGNORE INTO cats_catalog (id, name, appearance_asset) VALUES 
(1, 'Bongo Cat', 'assets/cats/bongo.png'),
(2, 'Pop Cat', 'assets/cats/pop.png');