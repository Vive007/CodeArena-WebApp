const getHello = async (id) => {
  try {
    const helloMessage = `Hello, World! ID: ${id}`;
    return helloMessage;
  } catch (error) {
    throw new Error('Failed to get hello message');
  }
};

module.exports = {
  getHello
};
