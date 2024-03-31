const User=require('../models/User');
// handle error
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





    
   

    // try {
    //     const user = await User.create({ email, password });
    //     res.status(201).json(user);
    // } catch (err) {
    //    const errors= handleErrors(err);
    //     console.error(err); // Log the full error for debugging
    //     //res.status(400).send(err.message || 'Error, user not created');
    //     res.status(400).json({errors});
    // }


    // const filePath = path.join(__dirname, '../public/codeforcesVerification.html');
    // res.sendFile(filePath);
}



module.exports.login_get=(req,res)=>{
    const filePath = path.join(__dirname, '../public/loginSignup.html');
    res.sendFile(filePath);
}
module.exports.login_post= async(req,res)=>{
    const {email,password}=req.body;
    console.log(req.body);
    const filePath = path.join(__dirname, '../public/loginSignup.html');
    res.sendFile(filePath);
}
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
    
