const mongoose=require('mongoose');
const validator =require('validator');
const bcrypt=require('bcrypt')
const { default: isEmail } = require('validator/lib/isEmail');
// console.log(validator.isEmail("vivek"));
const userSchema=new mongoose.Schema({

    codeForcesID:{
        type:String,
        reqired:[true,'Please enter an codeForcesID'],
        unique:true,
        lowercase:true
       
    },
    email:{
        type:String,
        reqired:[true,'Please enter an email'],
        unique:true,
        lowercase:true,
        validate:[isEmail,'Please enter a valid email']
    },
    password:{
        type:String,
        required:[true,'Please enter an password'],
        minlength:[6,'Minumum password length is 6 characters'],
    }
});

// fire a fucntion after doc saved to db
userSchema.post('save' ,function (doc,next){
    console.log('new user was created &saved',doc);
    // next to end  and get the saved request
    next();
});



// fire a fuction before doc saved to db
userSchema.pre('save',async function(next)
{ const salt=await bcrypt.genSalt();
    this.password =await bcrypt.hash(this.password,salt);
    console.log("user about to be created & saved",this);
    next();
});


const User=mongoose.model('User',userSchema);
module.exports=User;