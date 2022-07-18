<h1>Data Model</h1>

Users:

| column name   | type        | description                             |
| :---          |    :----:   |          ---:                           |
| id            | Integer     | primary key                             |
| username      | Text        | nickname to log in                      |
| email         | Text        | email for contact / register            |
| first_name    | Text        | first name of user                      |
| last_name     | Text        | last name of user                       |
| phone_number  | Text        | phone number of user                    |
| role          | Text        | role of the user                        |
| is_verified   | Boolean     | check if user verified email            |
| created_at    | Date        | timestamp to track creation of row      |
| updated_at    | Date        | timestamp to track last update of row   |

User_roles:

| column name   | type        | description                                              |
| :---          |    :----:   |          ---:                                            |
| id            | Integer     | primary key                                              |
| user_id       | Integer(reference to users.id) | id of the user that contains this row |
| role_name            | Text | "admin" "manager" "employee" "viewer"                         |

Permissions:

| column name    | type        | description
| :---           | :-----: | ---: |
| id             | Integer        | primary key |
| role_name      | Text           | Name of the role  |
| create         | Boolean        | Create permission |
| read           | Boolean        | Read permission   |
| update         | Boolean        | Update permission |
| delete         | Boolean        | Delete permission |

User_to_inventory:

| column name    | type                                 | description                                                                     |
| :---           |    :----:                            |          ---:                                                                   |
| id             | Integer                              | primary key                                                                     |
| inventory_id     | Integer(reference to inventories.id)    | reference key to know to what invoice the item belongs                     |
| user_id          | Integer(reference to users.id)                              | Price of the item in invoice                           |

inventories 

| column name   | type                          | description                           |
| :---          |    :----:                     |          ---:                         |
| id            | Integer                       | primary key                           |
| name          | Text                          | name of the inventory                 |
| admin_id      | Integer(reference to users.id) | ID of the inventory owner             |
| created_at    | Date                          | timestamp to track creation of row    |
| updated_at    | Date                          | timestamp to track last update of row |

items 

| column name    | type        | description                            |
| :---           |    :----:   |          ---:                          |
| id             | Integer     | primary key                            |
| name           | Text        | name of the inventory item             |
| category       | Text        | category of item for easy lookup       |
| quantity       | Integer        | count of how many items are            |
| description    | Text        | information about item (optional)      |
| measures       | Text        | measurements about part (optional)     |
| located_at     | Text        | location of item (optional)            |
| part_number    | Text        | part number of the item (optional)     |
| name           | Text        | name of the inventory                  |
| created_at     | Date        | timestamp to track creation of row     |
| updated_at     | Date        | timestamp to track last update of row  |
| inventory_id   | Integer(reference to inventories.id)                   |

logs

| column name    | type                                 | description                                                                     |
| :---           |    :----:                            |          ---:                                                                   |
| id             | Integer                              | primary key                                                                     |
| user_id        | Integer(reference to users.id)        | reference key to know who triggered the log                                     |
| item_id        | Integer(reference to inventories.id)    | reference key to know what item was affected and thus, the inventory affected  |
| message        | Text                                 | message created in backend to increase comprehensiveness of log for end user    |
| created_at     | Date                                 | timestamp to track creation of log                                              |

SUB FEATURES MODELS

orders

| column name    | type                                 | description                                                                     |
| :---           |    :----:                            |          ---:                                                                   |
| id             | Integer                              | primary key                                                                     |
| user_id        | Integer(reference to users.id)        | reference key to know who created the invoice                                     |
| inventory_id    | Integer(reference to inventories.id)    | reference to inventory which is using the items from
| total_labor_price        | Integer(reference to inventories.id)    | labor price calculated in backend  |
| message        | Text                                 | message created in backend to increase comprehensiveness of log for end user    |
| created_at     | Date        | timestamp to track creation of row     |
| updated_at     | Date        | timestamp to track last update of row  |

orders_to_items

| column name    | type                                 | description                                                                     |
| :---           |    :----:                            |          ---:                                                                   |
| id             | Integer                              | primary key                                                                     |
| invoice_id     | Integer(reference to invoices.id)    | reference key to know to what invoice the item belongs                          |
| price          | Integer                              | Price of the item in invoice                                                    |
| item_id        | Integer(reference to items.id)       | reference key to know what the item is                                          |
