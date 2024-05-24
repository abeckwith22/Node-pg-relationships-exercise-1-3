const express = require('express');
const router = express.Router();
const db = require('../db');

function get_date(){
    /* gets current date in yyyy-mm-dd format */
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}

router.get('/', async (req, res, next) =>{
    /* Returns a list of invoices in the database */
    try{
        const results = await db.query("SELECT * FROM invoices");
        return res.json(results.rows);
    }catch(err){
        return next(err);
    }
});

router.get('/:id', async (req, res, next) =>{ 
    /* gets/returns specific invoice obj with code*/
    try{
        const id = req.params.id;
        const results = await db.query("SELECT * FROM invoices WHERE id=$1", [id]);
        return res.json(results.rows);
    }
    catch(err){
        return next(err);
    }
});

router.post('/', async (req, res, next) =>{
    /* posts new invoice obj, adds to db*/
    try{
        const { comp_code, amt } = req.body;
        const paid = false;
        const add_date = get_date();

        const results = await db.query("INSERT INTO invoices (comp_code, amt, paid, add_date) VALUES ($1, $2, $3, $4) RETURNING *", [comp_code, amt, paid, add_date]);
        return res.status(201).json(results.rows[0]);
    }
    catch(err){
        return next(err);
    }
});

router.patch('/:id', async (req, res, next) =>{
    /* updates and returns an invoice obj */
    try{
        const {amt} = req.body;
        const result = await db.query(`
        UPDATE invoices SET amt=$1
        WHERE id=$2
        RETURNING *
        `, [amt, req.params.id]);
        return res.json(result.rows[0]);
    }
    catch(err){
        return next(err);
    }
});

router.delete('/:id', async (req, res, next) =>{
    /* deletes invoice obj */
    try{
        const id = req.params.id;
        const result = await db.query("DELETE FROM invoices WHERE id=$1", [id]);
        return res.json({'message':'deleted'});
    }
    catch(err){
        return next(err);
    }
});

module.exports = router;
