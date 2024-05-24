const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res, next) =>{
    /* Returns a list of companies in the database */
    try{
        const results = await db.query("SELECT * FROM companies");
        return res.json(results.rows);
    }catch(err){
        return next(err);
    }
});

router.get('/:code', async (req, res, next) =>{
    /* gets/returns specific company obj with code*/
    try{
        const code = req.params.code;
        const results = await db.query("SELECT * FROM companies WHERE code=$1", [code]);
        return res.json(results.rows);
    }
    catch(err){
        return next(err);
    }
});

router.post('/', async (req, res, next) =>{
    /* posts new company obj, adds to db*/
    try{
        const { code, name, description } = req.body;
        const results = await db.query("INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *", [code, name, description]);
        return res.status(201).json(results.rows[0]);
    }
    catch(err){
        return next(err);
    }
});

router.patch('/:code', async (req, res, next) =>{
    /* updates and returns company obj */
    try{
        const {name, description} = req.body;
        const result = await db.query(`
        UPDATE companies SET name=$1, description=$2
        WHERE code=$3
        RETURNING name, description`
        , [name, description, req.params.code]);
        return res.json(result.rows[0]);
    }
    catch(err){
        return next(err);
    }
});

router.delete('/:code', async (req, res, next) =>{
    /* deletes company obj */
    try{
        const code = req.params.code;
        const result = await db.query("DELETE FROM companies WHERE code=$1", [code]);
        return res.json({'message':'deleted'});
    }
    catch(err){
        return next(err);
    }
});

module.exports = router;
