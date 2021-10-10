const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router();

const User = require('../models/user');

router.get('/signup', async (req, res, next) => {
  const users = await User.find()

  if (!users) {
    res.status(500).json({
      message: 'Error tidak diketahui',
      status: 500
    });
  }

  const result = {
    count: users.length,
    data: users.map(f => {
      return {
        _id: f._id,
        email: f.email,
        password: f.password
      }
    })
  }

  res.status(200).json({
    message: 'Berhasil ambil semua data users',
    ...result
  });
});

router.post('/signup', async (req, res) => {
  const { body } = req

  // let checkUser = null

  // try {
  //   const data = await User.findOne({
  //     email: body.email
  //   })

  //   checkUser = data
  // } catch (err) {
  //   checkUser = null
  // }

  // if (!_.isEmpty(checkUser)) {
  //   return res.status(409).json({
  //     status: 409,
  //     message: 'Email Sudah terdaftar'
  //   })
  // }

  // cara pertama work
  // const hashedPassword = await hashPassword(body)

  // const user = new User({
  //   _id: new mongoose.Types.ObjectId(),
  //   email: body.email,
  //   password: hashedPassword
  // }).save().then(result => {
  //   res.status(201).json({
  //     status: 201,
  //     message: 'User Created'
  //   })
  // }).catch(err => {
  //   res.status(500).json({
  //     status: 500,
  //     message: err
  //   })
  // });

  // cara kedua work
  // bcrypt.hash(body.password, 10, (err, hash) => {
  //   if (err) {
  //     return res.status(500).json({
  //       error: err
  //     })
  //   } else {
  //     const user = new User({
  //       _id: new mongoose.Types.ObjectId(),
  //       email: body.email,
  //       password: hash
  //     }).save().then(result => {
  //       res.status(201).json({
  //         status: 201,
  //         message: 'User Created'
  //       })
  //     }).catch(err => {
  //       res.status(500).json({
  //         status: 500,
  //         message: err
  //       })
  //     });
  //   }
  // })

  // cara ketiga ga work
  const hashedPassword = await hashPassword(body)
  let user = null
  try {
    const data = await new User({
      _id: new mongoose.Types.ObjectId(),
      email: body.email,
      password: hashedPassword
    }).save()
    user = data
  } catch (err) {
    user = null
  }

  if (!user) {
    res.status(500).json({
      status: 500,
      message: 'Fail Create User'
    })
  }

  res.status(201).json({
    status: 201,
    message: 'Success Create User'
  })
})

router.post('/login', async (req, res) => {
  const { body } = req

  let user = null
  try {
    const data = await User.findOne({
      email: body.email
    })
    user = data
  } catch (err) {
    user = null
  }

  if (!user) {
    res.status(404).json({
      status: 404,
      message: 'User Not Found'
    })
  }

  console.log('user', user)

  // check if password match
  const compare = await comparePassword(body, user.password)

  if (!compare) {
    return res.status(402).json({
      message: 'Auth Failed'
    })
  } else {
    const token = jwt.sign({
      email: user.email,
      userId: user._id
    },
    process.env.JWT_KEY,
    {
      expiresIn: "1h"
    }
    )
    res.status(200).json({
      message: 'Auth Successfull',
      token
    })
  }

  res.status(200).json({
    status: 200,
    message: 'Success Login'
  })
})

router.delete('/signup/:userId', async (req, res, next) => {
  const id = req.params.userId
  let result
  try {
    result = await User.findByIdAndDelete({ _id: id })
  } catch (error) {
    result = null
  }

  if (!result) {
    res.status(501).json({
      status: 501,
      message: 'Delete User Fail'
    })

    return
  }

  res.status(200).json({
    status: 200,
    message: `Berhasil Delete ${id}`,
    request: {
      type: 'POST',
      url: 'http://localhost:5000/users/signup',
      body: {
        email: 'String',
        password: 'String'
      }
    }
  })
});

async function hashPassword (body) {

  const password = body.password
  const saltRounds = 10;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) reject(err)
      resolve(hash)
    });
  })

  return hashedPassword
}

async function comparePassword (body, userPassword) {

  const password = body.password

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.compare(password, userPassword, function(err, res) {
      if (err) reject(err)
      resolve(res)
    });
  })
  console.log('hashedPassword', hashedPassword)

  return hashedPassword
}


module.exports = router