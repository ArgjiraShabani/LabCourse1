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
       
        const [roleRows] = await db.promise().query('SELECT role_id FROM roles WHERE role_name = ?', ['admin']);

        if (roleRows.length === 0) {
            console.error('Admin role not found in roles table.');
            return;
        }
        const roleId = roleRows[0].role_id;

        const insertQuery = 'INSERT INTO admin (first_name,last_name,email, password,role_id) VALUES (?,?,?,?,?)';
        await db.promise().query(insertQuery, ["Admin","Admin",email, hashedPassword,roleId]);

        console.log('Admin user created successfully.');
    } catch (err) {
        console.error('Error creating admin user:', err);
    }
}

module.exports = initAdminUser;

