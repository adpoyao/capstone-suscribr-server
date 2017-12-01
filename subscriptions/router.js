'use strict';

const express = require('express');
const router = express.Router();
const {DATABASE_URL} = require ('../config');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const passport = require('passport');
const jwt = require('jsonwebtoken');

const localAuth = passport.authenticate('local', {session: false});
const jwtAuth = passport.authenticate('jwt', {session: false});

const {dbGet} = require('../db-knex');

/** RETRIEVE ALL SUBSCRIPTIONS */
//TODO: PUT BACK JWTAuth
router.get('/', (req, res) => {
  const knex = dbGet();
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
router.post('/', jsonParser, jwtAuth, (req, res) => {
  const knex = dbGet();
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
    .returning('id')
    // .orderBy('id') 
    .then((result)=> {
      res.location(`/subscriptions/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      console.error(err);
    });
});

/** MODIFY A SUBSCRIPTION */
router.put('/:id', jsonParser, jwtAuth, (req, res) => {
  const knex = dbGet();  
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
    .where('user_id', userId)  
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
router.delete('/:id', jwtAuth, (req, res) => {
  const knex = dbGet();  
  const id = req.params.id;
  knex('subscriptions')
    .where('user_id', req.headers.user_id)
    .where('id', id)
    //TO DO: How to show error when userID and ID does not match
    .del()
    .then(()=> {
      res.sendStatus(204).end();
    });
});

module.exports = {router};