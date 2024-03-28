const verify = async (id,index,userId) => {
    try {
        
        return true;
    } catch (error) {
      throw new Error('Failed to get hello message');
    }
  };
  
  module.exports = {
    verify
  };
  