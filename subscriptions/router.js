'use strict';

const express = require('express');
const router = express.Router();
const {DATABASE_URL} = require ('../config');

const DATABASE = {
  client: 'pg',
  connection: DATABASE_URL,
};

const knex = require('knex')(DATABASE);

/** RETRIEVE ALL SUBSCRIPTIONS */
router.get('/', (req, res) => {
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
// router.post('/', (req, res) => {
//   // Remember, *never* trust users, *always* validate data
//   const requiredFields = ['title', 'content', 'userId'];
//   if (Object.keys(req.body).length === 0) {
//     const errorMessage = `The body must contain: ${requiredFields}`;
//     res.status(400).send(errorMessage);
//     return;
//   }
//   for(let i =0; i<requiredFields.length; i++){
//     const field = requiredFields[i];
//     if(!(field in req.body)){
//       const errorMessage = `'${field}' is missing`;
//       return res.status(400).send(errorMessage);
//     }
//   }
//   // Alternative Code
//   // requiredFields.forEach(field => {
//   //   if (!(field in req.body)) {
//   //     const errorMessage = `You're missing a required field: ${field}`;
//   //     res.status(400).send(errorMessage);
//   //     return;
//   //   }
//   // });

//   const {title, content, userId} = req.body;
//   //(1) select user ID from req.body and (2) INSERT it in story as reference
//   knex('stories')
//     .insert([{title, content, author_id: userId}])
//     .returning(['id'])
//     .then((result)=> {
//       return knex('users')
//         .join('stories', 'users.id', 'stories.author_id')
//         .where('stories.id', result[0].id)  
//         .select('stories.id as id', 'title', 'content', 'username as author', 'users.id as userId');              
//     })
//     .then(([result]) => {
//       res.location(`/v2/stories/${result.id}`).status(201).json(result);
//     })
//     .catch(err => {
//       console.error(err);
//     });
// });

// /** MODIFY A SUBSCRIPTION */
// router.put('/:id', (req, res) => {
//   // Remember, *never* trust users, *always* validate data

//   const requiredFields = ['id', 'title', 'content', 'userId'];
//   const paramId = Number(req.params.id);
//   const bodyId = Number(req.body.id);
//   if (Object.keys(req.body).length === 0) {
//     const errorMessage = `The body must contain: ${requiredFields}`;
//     res.status(400).send(errorMessage);
//     return;
//   }
//   if(!(paramId === bodyId)){
//     return res.status(400).send('Body ID and Params ID must match');
//   }
//   for(let i =0; i<requiredFields.length; i++){
//     const field = requiredFields[i];
//     if(!(field in req.body)){
//       const errorMessage = `'${field}' is missing`;
//       return res.status(400).send(errorMessage);
//     }
//   }
//   const { title, content, userId } = req.body;
//   const { id } = req.params;
//   knex('stories')
//     .update({title, content, author_id: userId})
//     .where('id', id)    
//     .then(result => {
//       return knex('users')
//         .join('stories', 'users.id', 'stories.author_id')
//         .where('stories.id', id); 
//       // .select('stories.id as storiesId', 'title', 'content', 'username as author', 'users.id as userId')              
//       // .returning('id', 'title', 'content', 'author', 'userId')
//     })
//     .then(([result]) => {
//       res.json(result);
//     })
//     .catch(err => {
//       console.error(err);
//     });
// });

// /** DELETE A SUBSCRIPTION */
// router.delete('/:id',  (req, res) => {
//   const id = req.params.id;
//   knex('stories')
//     .where('id', id)
//     .del()
//     .then(()=> {
//       res.sendStatus(204).end();
//     });
//   // blog.delOne(id);
// });

module.exports = {router};