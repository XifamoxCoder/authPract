const User = require('./models/User');
const Role = require('./models/Role');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const {secret} = require('./config');

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles
  }
  return jwt.sign(payload, secret, {expiresIn: '1h'})
}

class authController {
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Errors', errors });
      }
      const {username, password} = req.body;
      const candidate = await User.findOne({username});
      if (candidate) {
        return res.status(400).json({ message: "User already exist" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({value: 'USER'});
      const user = new User({username, password: hashPassword, roles: [userRole.value]});
      await user.save();
      return res.json({ message: "User registered successfully" });
    } catch (e) {
      console.log(e)
      res.status(400).json({message: 'Registration error'})
    }
  }
  async login(req, res) {
    try {
      const {username, password} = req.body;
      const user = await User.findOne({username});
      if(!user) {
        return res.status(400).json({message: `User ${username} not found`});
      } else {
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
          return res.status(400).json({message: `Password is incorrect`});
        }
      }
      const token = generateAccessToken(user._id, user.roles)
      return res.status(200).json({token});
    } catch (e) {
      console.log(e)
      res.status(400).json({message: 'Login error'})
    }
  }
  async getUsers(req, res) {
    try {
      const users = await User.find();
      return res.json(users);
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new authController();