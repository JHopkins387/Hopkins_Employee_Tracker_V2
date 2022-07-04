
const express = require('express');
const router = express.Router();
const db = require('../db/connection')

//Department Routes

router.get('/departments', (req, res) => {
    const sql = `SELECT * FROM department`;
    //db object is using SQL query method to execute the callback with all rows from departments
    db.query(sql, (err, rows) => {
        if (err) {
            //if theres an error, respond with a json object 500 error = server err msg
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
})

//Roll Routes

router.get('/roles', (req, res) => {
    const sql = `SELECT * FROM roles`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
})

//Employee Routes

router.get('/employees', (req, res) => {
    const sql = `SELECT * FROM employee`;
    //the db object is using SQL query method to execute the callback with all rows from departments section
    db.query(sql, (err, rows) => {
        if (err) {
            //if theres an error, respond with a json object 500 error = server err msg
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
})

module.exports = router; 
© 2022 GitHub, Inc.
    Terms
Privacy
Se