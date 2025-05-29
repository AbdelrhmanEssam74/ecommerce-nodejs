const db = require('../DB/db-connection')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Register User
exports.registerFunction = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const sqlCheck = 'SELECT * FROM users WHERE email = ?';
    const [existingUsers] = await db.query(sqlCheck, [email]);

    if (existingUsers.length > 0) {
      return res.status(403).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sqlInsert = 'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(sqlInsert, [name, email, hashedPassword, phone]);

    return res.status(201).json({
      id: result.insertId,
      message: 'User registered successfully'
    });

  } catch (err) {
    console.error('🔴 Error registering user:', err);
    return res.status(500).json({ error: 'Error registering user' });
  }
};


exports.loginFunction = async (req, res) => {
    const { email, password } = req.body;

    const sqlCheck = 'SELECT * FROM users WHERE email = ?';
    try {
        const [results] = await db.query(sqlCheck, [email]);

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
        const token = jwt.sign(
            { id: user.id, email: user.email },
            'my-dev-secret', 
            { expiresIn: '1h' }
        );

        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            token: token
        });

    } catch (err) {
        console.error('🔴 Error logging in:', err);
        res.status(500).json({ error: 'Error logging in' });
    }
};


exports.forgetPassFunction = async (req, res) => {
    const {email} = req.body

    const sqlcheckPass = 'select * from users where email=?'
    db.query(sqlcheckPass, [email])
        .then(([results]) => {
            if (results.length === 0) {
                res.status(404).json({error:"email not found"})
            }
            res.json({success:"Reset link sent to your email!"})
        })
        .catch(err => {
            console.error(' Error in forget password:', err);
            res.status(500).json({error:"Error occurred while processing your request"})
        })
}

 exports.resetPassFunction=async (req,res)=>{
    const {email,newPassword}=req.body;
    const sqlUpdate = 'UPDATE users SET password = ? WHERE email = ?';
    db.query(sqlUpdate, [newPassword,  email])
        .then(([result]) => {
            if (result.affectedRows === 0) {
                return res.status(404).json({error: 'Email not found'});
            }
            res.status(200).json({message: 'Password updated successfully'});
        })
        .catch(err => {
            console.error('Error updating password:', err);
            res.status(500).json({error: 'Error updating password'});
        });
}
