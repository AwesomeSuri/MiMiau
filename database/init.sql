CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    current_session_id VARCHAR(255) NULL,
    level INT NOT NULL DEFAULT 1,
    gacha_queue INT NOT NULL DEFAULT 1,
    room_width INT NOT NULL DEFAULT 7,
    room_length INT NOT NULL DEFAULT 5
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
CREATE TABLE IF NOT EXISTS items_catalog (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    type ENUM('furniture', 'toy') NOT NULL,
    image VARCHAR(100) NOT NULL,
    sprite_sheet VARCHAR(100) NOT NULL
);
CREATE TABLE IF NOT EXISTS user_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    grid_x INT NULL,
    grid_y INT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items_catalog(id) ON DELETE CASCADE,
    CONSTRAINT chk_user_items_position CHECK (
        (grid_x IS NULL AND grid_y IS NULL)
        OR (grid_x IS NOT NULL AND grid_y IS NOT NULL)
    )
);

INSERT IGNORE INTO cats_catalog (id, name, image, sprite_sheet, facts) VALUES
(1, 'Bongo Cat', 'assets/cats/bongo.png', 'assets/cats/bongo.png', '["Loves to bongo on tables"]'),
(2, 'Pop Cat', 'assets/cats/pop.png', 'assets/cats/pop.png', '["Pop pop pop!"]');

INSERT IGNORE INTO items_catalog (id, name, type, image, sprite_sheet) VALUES
(1, 'Carton Box', 'furniture', 'assets/spritesheets/carton-box-sheet.png', 'assets/spritesheets/carton-box-sheet.png');

-- Local dev test user: test@example.com / password1234
INSERT IGNORE INTO users (id, email, password, username) VALUES
(1, 'test@example.com', '$2y$12$rlscjYb1K0PqXNkRx1fi1.G6eFbuHKmPVq823p9yKI3Nklx6wFiGq', 'TestUser');

INSERT IGNORE INTO user_items (id, user_id, item_id, grid_x, grid_y) VALUES
(1, 1, 1, 4, 2);