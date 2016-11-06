
var mongoose = require('mongoose');
var crypto = require('crypto');


var Schema= mongoose.Schema;

function encrypt(pass,name){
	return crypto.createHmac('sha256', pass)
                   .update('What is Love' + name)
                   .digest('hex');
}

var UserSchema = new Schema({
	name:{
		type:String,
		unique:true,
		required:true
	},
	password:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	admin: Boolean 
});

UserSchema.pre('save',function(next){
	var user=this;
	if(this.isModified('password') || this.isNew){
      user.password= encrypt(user.password, user.name);
     }
	return next();
});

UserSchema.methods.comparePassword = function (passw,name, cb) {
    encPass=encrypt(passw,name);
   if(this.password===encPass)
   	return cb(null,true);
   return cb(false);
};

module.exports = mongoose.model('User', UserSchema);