const User=require('../models/User');
const jwt=require('jsonwebtoken');
const { userInfo } = require('os');

// handle error
require('dotenv').config();

const handleErrors= (err) =>{
    
    console.log(err.message,err.code);
    let error= {email:'',password:''};
    // duplicate error code 
    if(err.code==11000)
    {
        error.email='That email is already registered';
        return error;

    }
    // validation errors
    if(err.message.includes('user validation failed'))
    {
        console.log(Object.values(err.errors));
        Object.values(err.errors).forEach(({properties}) =>{
            console.log(properties);
            error[properties.path]=properties.message;
        });
   }
   return error;

}


const maxAge=3*24*60*60;
// create jwt
const createToken=(id)=>{
    // creating signature
    const secrete=process.env.SECRETE;
    return jwt.sign({id},secrete,{
        expiresIn: maxAge
    });
}









// Middleware to parse JSON bodies
const path=require('path')
module.exports.signup_get=(req,res)=>{
    const filePath = path.join(__dirname, '../public/loginSignup.html');
    res.sendFile(filePath);
}


module.exports.signup_post = async (req, res) => {
    console.log(req.body); // Log the request body for debugging

    //const { email, password } = req.body;
    const { codeforcesId, email, password, confirmPassword } = req.body;
    console.log(typeof(email));
    console.log("Codeforces ID:", codeforcesId);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
    // verify the cf handle write code here 

    const createUser = async (codeForcesID, email, password) => {
        try {
          const newUser = new User({
            codeForcesID: codeForcesID,
            email: email,
            password: password
          });
      
          const savedUser = await newUser.save();
          const token=createToken(savedUser._id);
          res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
          res.status(201).json({user: savedUser._id});
          console.log('New user created:', savedUser);
        } catch (error) {
          console.error('Error creating user:', error.message);
          const errors =handleErrors(err);
          res.status(400).json({errors});

        }
      };
    
      createUser(codeforcesId, email, password);
    };

//   res.status(200).json({ message: "User created successfully" });



    
   

    



module.exports.login_get=(req,res)=>{
    const filePath = path.join(__dirname, '../public/loginSignup.html');
    res.sendFile(filePath);
}





module.exports.login_post = async (req, res) => {
  const { codeforcesId, password } = req.body;
  try {
      const user = await User.login(codeforcesId, password); // Corrected function name
      const token=createToken(user._id);
      res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
      res.status(200).json({ user: user._id });
  } catch (err) {
    // const errors=handleLoginErrors(err);
      // console.log(err);
      res.status(400).json({error:err.message});
  }
};








module.exports.verify_gett= (req,res)=>{
    //const {email,password}=req.body;
    // console.log(req.body);
    const { codeforcesId, email, password, confirmPassword } = req.body;
    console.log(typeof(email));
    console.log("Codeforces ID:", codeforcesId);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
    const filePath = path.join(__dirname, '../public/codeforcesVerification.html');
    res.sendFile(filePath);
}

// module.exports.cookies_set=(req,res)=>
// {
//     res.setHeader('Set-Cookie','newUser=true');
//     res.send('you got the cookies!');

// }
// module.exports.cookies_read=(req,res)=>
// {
    
// }

module.exports.verify_id=async(req,res)=>
{
    const { codeforcesId } = req.body;

  try {
    const existingUser = await User.findOne({ codeForcesID: codeforcesId });

    if (existingUser) {
      res.json({ exists: true }); // User exists
    } else {
      res.json({ exists: false }); // User does not exist
    }
  } catch (error) {
    console.error('Error checking user existence:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
//   res.json({ exists: false }); // User does not exist

}
    
module.exports.verify_user=(req,res)=>{
  res.sendFile(__dirname+"/public/chat.html");
}

module.exports.logout_get=(req,res)=>{
  res.cookie('jwt','',{maxAge:1});
  res.redirect('/');
}
