const jwt=require('jsonwebtoken');
require('dotenv').config();
const User=require('../models/User');
const secrete=process.env.SECRETE;
//console.log(secrete);
const requireAuth=(req,res,next)=>{
    // grab the toke from cookie
    const token= req.cookies.jwt;
    console.log(token);
    // check jsonwebtoken exist and verified
    if(token)
    {
        // verify the token
        jwt.verify(token,secrete,(err,decodedToken)=>
        {
            if(err)
            {
                console.log(err.message);
                res.redirect('/');
            }else
            {
                console.log(decodedToken);
                next();
            }
        })

    }else{
        res.redirect('/');
    }
}

// checking the current user

const checkUser=(req,res,next)=>{
    const token=req.cookies.jwt;
    // check is token exist
    if(token)
    {
        jwt.verify(token,secrete,async(err,decodedToken)=>
        {
            if(err)
            {
                console.log(err.message);
                // set local user to null
                res.locals.user=null;
                next();
            }else
            {
                console.log(decodedToken);
                let user= await User.findById(decodedToken.id);
                console.log(user);
                res.locals.user=user;
                next();
            }
        })

    }else{
        res.locals.user=null;
        next();
    }
}





module.exports={requireAuth,checkUser};
