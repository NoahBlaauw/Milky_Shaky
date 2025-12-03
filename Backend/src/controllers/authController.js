const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user.id,
      email: user.email,
      role: user.role,
      firstname: user.firstname
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' } // Token expires in 24 hours
  );
};

// SIGNUP
const signup = async (req, res) => {
  try {
    const { firstname, email, mobile, password } = req.body;

    // Validate input
    if (!firstname || !email || !mobile || !password) {
      return res.status(400).json({ 
        error: 'All fields are required' 
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstname,
        email,
        mobile,
        password: hashedPassword,
        role: 'patron' // Default role
      }
    });

    // Generate token
    const token = generateToken(user);

    // Return success
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        firstname: user.firstname,
        email: user.email,
        role: user.role
      }
    });

    console.log('✅ New user signed up:', email);

  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ 
      error: 'Failed to create user' 
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = generateToken(user);

    // Return success
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstname: user.firstname,
        email: user.email,
        role: user.role
      }
    });

    console.log('✅ User logged in:', email);

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      error: 'Failed to login' 
    });
  }
};

module.exports = { signup, login };