'use strict';

const express = require('express');
const router = express.Router();
const {DATABASE_URL} = require ('../config');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

 
// const {dbGet} = require('../db-knex');

const DATABASE = {
  client: 'pg',
  connection: DATABASE_URL,
};

const knex = require('knex')(DATABASE);

/** RETRIEVE ALL SUBSCRIPTIONS */
router.get('/', (req, res) => {
  // const knex = dbGet();
  knex('subscriptions')
    .where('user_id', req.headers.user_id)
    .then(result => {
      return res.status(200).json(result);
    })
    .catch(err => {
      console.error(err);
    });
});

// /** CREATE A SUBSCRIPTION */
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['subscriptionName', 'category', 'frequency', 'active'];
  if (Object.keys(req.body).length === 0) {
    const errorMessage = `The body must contain: ${requiredFields}`;
    res.status(400).send(errorMessage);
    return;
  }

  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      const errorMessage = `You're missing a required field: ${field}`;
      res.status(400).send(errorMessage);
      return;
    }
  });

  const {subscriptionName, category, price, frequency, ccType, ccDigits, ccNickname, dueDate, active, userId} = req.body;
  knex('subscriptions')
    .insert([{subscription_name: subscriptionName, category, price, frequency, cc_type: ccType, cc_digits: ccDigits, cc_nickname: ccNickname, due_date: dueDate, active, user_id: userId}])
    .returning(['id'])
    .then((result)=> {
      res.location(`/subscriptions/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      console.error(err);
    });
});

/** MODIFY A SUBSCRIPTION */
router.put('/:id', jsonParser, (req, res) => {

  const requiredFields = ['id', 'subscriptionName', 'category', 'frequency', 'active'];
  const paramId = Number(req.params.id);
  const bodyId = Number(req.body.id);
  if (Object.keys(req.body).length === 0) {
    const errorMessage = `The body must contain: ${requiredFields}`;
    res.status(400).send(errorMessage);
    return;
  }
  if(!(paramId === bodyId)){
    return res.status(400).send('Body ID and Params ID must match');
  }
  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      const errorMessage = `You're missing a required field: ${field}`;
      res.status(400).send(errorMessage);
      return;
    }
  });
  
  const { subscriptionName, category, price, frequency, ccType, ccDigits, ccNickname, dueDate, active, userId } = req.body;
  const { id } = req.params;

  knex('subscriptions')
    .update({subscription_name: subscriptionName, category, price, frequency, cc_type: ccType, cc_digits: ccDigits, cc_nickname: ccNickname, due_date: dueDate, active, user_id: userId})
    .where('user_id', req.user.id)  
    .where('id', id)    
    .then(result => {
      //TO DO: Check what result shows when id does not match id
      if(!result) {
        const errorMessage = 'You are not authorized to update this subscription';}
      res.json(result);
    })
    .catch(err => {
      console.error(err);
    });
});

/** DELETE A SUBSCRIPTION */
router.delete('/:id',  (req, res) => {
  const id = req.params.id;
  knex('subscriptions')
    .where('user_id', req.user.id)
    .where('id', id)
    //TO DO: How to show error when userID and ID does not match
    .del()
    .then(()=> {
      res.sendStatus(204).end();
    });
});

module.exports = {router};