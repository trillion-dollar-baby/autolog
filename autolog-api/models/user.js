const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");
const _ = require("lodash");
const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");

class User {
    static makePublicUser(user) {
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
            phoneNumber: user.phone_number,
            emailConfirmed: user.email_confirmed,
        };
    }

    static async login(credentials) {
        const requiredFields = ["email", "password"];
        requiredFields.forEach((property) => {
            if (!credentials?.hasOwnProperty(property)) {
                throw new BadRequestError(
                    `Missing ${property} in request body.`
                );
            }
        });

        const user = await User.fetchUserByEmail(credentials.email);
        if (user) {
            const isValid = await bcrypt.compare(
                credentials.password,
                user.password
            );
            if (isValid) {
                return User.makePublicUser(user);
            }
        }

        throw new UnauthorizedError("Invalid username/password");
    }

    static async register(credentials) {
        const requiredFields = [
            "email",
            "username",
            "firstName",
            "lastName",
            "password",
            "phoneNumber",
        ];
        requiredFields.forEach((property) => {
            if (!credentials?.hasOwnProperty(property)) {
                throw new BadRequestError(
                    `Missing ${property} in request body.`
                );
            }
        });

        if (credentials.email.indexOf("@") <= 0) {
            throw new BadRequestError("Invalid email.");
        }

        const existingUser = await User.fetchUserByEmail(credentials.email);
        if (existingUser) {
            throw new BadRequestError(
                `A user already exists with email: ${credentials.email}`
            );
        }

        const existingUserWithUsername = await User.fetchUserByUsername(
            credentials.username
        );
        if (existingUserWithUsername) {
            throw new BadRequestError(
                `A user already exists with username: ${credentials.username}`
            );
        }

        const hashedPassword = await bcrypt.hash(
            credentials.password,
            BCRYPT_WORK_FACTOR
        );
        const normalizedEmail = credentials.email.toLowerCase();
        const normalizedUsername = credentials.username.toLowerCase();
        const firstName = credentials.firstName;
        const lastName = credentials.lastName;
        const phoneNumber = credentials.phoneNumber;
        const role = "admin";

        const userResult = await db.query(
            `INSERT INTO users (email, username, first_name, last_name, password, phone_number, role)
	   VALUES ($1, $2, $3, $4, $5, $6, $7)
	   RETURNING id, email, username, first_name, last_name, email_confirmed, phone_number, created_at;
	  `,
            [
                normalizedEmail,
                normalizedUsername,
                firstName,
                lastName,
                hashedPassword,
                phoneNumber,
                role,
            ]
        );
        const user = User.makePublicUser(userResult.rows[0]);

        return user;
    }

    static async fetchUserByEmail(email) {
        if (!email) {
            throw new BadRequestError("No email provided");
        }

        const query = `SELECT * FROM users WHERE email = $1`;

        const result = await db.query(query, [email.toLowerCase()]);

        const user = result.rows[0];

        if (user) {
            return user;
        }

        return false;
    }

    static async fetchUserById(id) {
        if (!id || isNaN(id)) {
            throw new BadRequestError("invalid ID");
        }

        const query = `SELECT * FROM users WHERE id = $1`;

        const result = await db.query(query, [id]);

        const user = result.rows[0];

        if (user) {
            return user;
        }
    }

    static async fetchUserByUsername(username) {
        if (!username) {
            throw new BadRequestError("No username provided");
        }

        const query = `SELECT * FROM users WHERE username = $1`;

        const result = await db.query(query, [username.toLowerCase()]);

        const user = result.rows[0];

        if (user) {
            return user;
        }

        return false;
    }

    /**
     * Update user functions
     */

    static async updateCredentials(userId, newCredentials, credentials) {
        if (_.toLower(newCredentials.email) !== _.toLower(credentials.email)) {
            const existingUser = await User.fetchUserByEmail(
                newCredentials.email
            );
            if (existingUser) {
                throw new BadRequestError(
                    `A user already exists with email: ${credentials.email}`
                );
            }
        }

        if (
            _.toLower(newCredentials.username) !==
            _.toLower(credentials.username)
        ) {
            const existingUserWithUsername = await User.fetchUserByUsername(
                newCredentials.username
            );
            if (existingUserWithUsername) {
                throw new BadRequestError(
                    `A user already exists with username: ${credentials.username}`
                );
            }
        }

        // with old credentials loop through newCredentials object and replace
        for (const key in newCredentials) {
            if (isNaN(newCredentials[key])) {
                const normalizedField = _.toLower(newCredentials[key]);

                credentials[key] = normalizedField;
            } else {
                credentials[key] = newCredentials[key];
            }
        }

        // after replacing, update
        const query = `
			UPDATE users
			SET first_name = $2,
				last_name = $3,
				email = $4,
				username = $5,
				phone_number = $6,
				updated_at = NOW()
			WHERE id = $1
			RETURNING *;
		`;

        // normalize all data before updating
        const result = await db.query(query, [
            userId,
            _.toLower(credentials.firstName),
            _.toLower(credentials.lastName),
            _.toLower(credentials.email),
            _.toLower(credentials.username),
            _.toLower(credentials.phoneNumber),
        ]);

        return result.rows[0];
    }

    static async updatePassword(userId, newCredential) {
        // hash password
        const hashedPassword = await bcrypt.hash(
            newCredential.password,
            BCRYPT_WORK_FACTOR
        );

        const query = `
		UPDATE users
		SET password = $2
		WHERE id = $1
	`;
        const result = await db.query(query, [userId, hashedPassword]);
    }
}

module.exports = User;
