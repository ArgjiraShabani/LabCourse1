const bcrypt = require('bcrypt');
const express = require("express");
const db = require('../db'); // Adjust this to your actual DB import (e.g., knex, sequelize)

async function initAdminUser() {
    const email = process.env.ADMIN_EMAIL;
    const plainPassword = process.env.ADMIN_PASSWORD;

    try {
        // Check if admin already exists
        const query='select * from admin where email=?';
           const [rows] = await db.promise().query(query, [email]); // Execute the query with email as param

        if (rows.length > 0) {
            console.log(' Admin already exists.');
            return;
        }

        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const insertQuery = 'INSERT INTO admin (first_name,last_name,email, password,role_id) VALUES (?,?,?,?,?)';
        await db.promise().query(insertQuery, ["Admin","Admin",email, hashedPassword,4]);

        console.log('Admin user created successfully.');
    } catch (err) {
        console.error('Error creating admin user:', err);
    }
}

module.exports = initAdminUser;
