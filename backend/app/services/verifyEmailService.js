// Map to store email verification tokens and their expiration times
const verificationTokens = new Map();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sncoder003@gmail.com',
    pass: '#781@tuga@JK'
  }
});

// Function to generate a random verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

// Function to send verification email
const sendVerificationEmail = async (email, token) => {
  const verificationLink = `http://localhost:3000/verify-email?token=${token}`;
  const mailOptions = {
    from: 'sncoder003@gmail.com',
    to: email,
    subject: 'Email Verification',
    text: `Click the following link to verify your email: ${verificationLink}`
  };

  await transporter.sendMail(mailOptions);
};


const verify = async (email) => {
  const token = generateVerificationToken();
  const expirationTime = Date.now() + 60000; // 1 minute
  verificationTokens.set(token, { email, expirationTime });

  try {
    await sendVerificationEmail(email, token);
    res.send('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).send('Failed to send verification email');
  }
};

module.exports = {
  verify
};
