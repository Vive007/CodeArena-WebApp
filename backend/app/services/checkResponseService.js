const check = async (token) => {
  const verificationInfo = verificationTokens.get(token);

  if (!verificationInfo) {
    return res.status(400).send('Invalid or expired token');
  }

  // Remove token from map to prevent reuse
  verificationTokens.delete(token);

  const { email, expirationTime } = verificationInfo;

  if (Date.now() > expirationTime) {
    return res.send(false); // Verification expired
  }

  res.send(true); // Email verified successfully
};

module.exports = {
  check
};
