CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE CHECK (POSITION('@' IN email) > 1),
    phone_number TEXT NOT NULL,
    role TEXT NOT NULL,
    is_verified BOOLEAN NOT NULL,
    created_at timestamp NOT NULL DEFAULT NOW(),
    updated_at timestamp NOT NULL DEFAULT NOW()
);

CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    role_name TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    role_name TEXT NOT NULL,
    c BOOLEAN NOT NULL,
    r BOOLEAN NOT NULL,
    u BOOLEAN NOT NULL,
    d BOOLEAN NOT NULL
);

CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    admin_id INTEGER NOT NULL,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp NOT NULL DEFAULT NOW(),
    FOREIGN KEY (admin_id) REFERENCES users(id)
);
/* Got rid of NOT NULL at the end of admin_id 
FOREIGN KEY (admin_id) REFERENCES users(id)*/

CREATE TABLE user_to_inventory (
    id SERIAL PRIMARY KEY,
    inventory_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (inventory_id) REFERENCES inventory(id)
);

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    quantity TEXT NOT NULL,
    measures TEXT,
    located_at TEXT,
    part_number TEXT,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp NOT NULL DEFAULT NOW(),
    inventory_id INTEGER NOT NULL,
    FOREIGN KEY (inventory_id) REFERENCES inventory(id)
);

CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    created_at timestamp NOT NULL default CURRENT_DATE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (item_id) REFERENCES items(id)
);
