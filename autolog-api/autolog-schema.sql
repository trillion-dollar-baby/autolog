CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE CHECK (POSITION('@' IN email) > 1),
    phone_number TEXT NOT NULL,
    role TEXT NOT NULL,
    email_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at timestamp NOT NULL DEFAULT NOW(),
    updated_at timestamp NOT NULL DEFAULT NOW()
);

CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    admin_id INTEGER NOT NULL,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp NOT NULL DEFAULT NOW(),
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    inventory_id INTEGER NOT NULL,
    role_name TEXT NOT NULL,
    item_create BOOLEAN NOT NULL,
    item_read BOOLEAN NOT NULL,
    item_update BOOLEAN NOT NULL,
    item_delete BOOLEAN NOT NULL,
    FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE
);

CREATE TABLE user_to_inventory (
    id SERIAL PRIMARY KEY,
    inventory_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    user_role_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE,
    FOREIGN KEY (user_role_id) REFERENCES roles(id)
);

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    located_at TEXT,
    part_number TEXT,
    description TEXT,
    supplier TEXT,
    created_at timestamp WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP(0),
    updated_at timestamp WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    inventory_id INTEGER NOT NULL,
    FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE
);

CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    username TEXT NOT NULL,
    item_id INTEGER NOT NULL,
    item_name TEXT NOT NULL,
    inventory_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    created_at timestamp NOT NULL default CURRENT_DATE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (item_id) REFERENCES items(id),
    FOREIGN KEY (inventory_id) REFERENCES inventory(id)
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    inventory_id INTEGER NOT NULL,
    category_name TEXT NOT NULL,
    FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE
);

CREATE TABLE checklist(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    inventory_id INTEGER NOT NULL,
    item TEXT NOT NULL,
    is_checked BOOLEAN NOT NULL DEFAULT false,
    FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE announcements(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    announcement TEXT NOT NULL,
    inventory_id INTEGER NOT NULL,
    created_at timestamp NOT NULL default CURRENT_DATE,
    updated_at timestamp WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    receiver_first_name TEXT NOT NULL,
    receiver_last_name TEXT NOT NULL,
    receiver_email TEXT NOT NULL,
    receiver_address TEXT NOT NULL,
    created_at timestamp NOT NULL default CURRENT_DATE,

    total_labor_cost INTEGER NOT NULL,
    total_material_cost INTEGER NOT NULL,

    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (sender_email) REFERENCES users(email)
);

CREATE TABLE sold_item (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    sold_date timestamp WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP(0),
)

CREATE TABLE invoice_to_sold_item (
    id SERIAL PRIMARY KEY,
    quantity INTEGER NOT NULL,
    invoice_id INTEGER NOT NULL,
    sold_item_id INTEGER NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id),
    FOREIGN KEY (item_id) REFERENCES item_id(id)
)