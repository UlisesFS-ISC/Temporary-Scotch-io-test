
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

/*

 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwiX2lkIjoiNTgxZTgwNDQ5NTA2MzcxNmNjYjdiNzEyIiwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsiZW1haWwiOiJpbml0IiwicGFzc3dvcmQiOiJpbml0IiwibmFtZSI6ImluaXQiLCJfX3YiOiJpbml0IiwiYWRtaW4iOiJpbml0IiwiX2lkIjoiaW5pdCJ9LCJzdGF0ZXMiOnsiaWdub3JlIjp7fSwiZGVmYXVsdCI6e30sImluaXQiOnsiX192Ijp0cnVlLCJhZG1pbiI6dHJ1ZSwiZW1haWwiOnRydWUsInBhc3N3b3JkIjp0cnVlLCJuYW1lIjp0cnVlLCJfaWQiOnRydWV9LCJtb2RpZnkiOnt9LCJyZXF1aXJlIjp7fX0sInN0YXRlTmFtZXMiOlsicmVxdWlyZSIsIm1vZGlmeSIsImluaXQiLCJkZWZhdWx0IiwiaWdub3JlIl19LCJwYXRoc1RvU2NvcGVzIjp7fSwiZW1pdHRlciI6eyJkb21haW4iOm51bGwsIl9ldmVudHMiOnt9LCJfZXZlbnRzQ291bnQiOjAsIl9tYXhMaXN0ZW5lcnMiOjB9LCIkb3B0aW9ucyI6dHJ1ZX0sImlzTmV3IjpmYWxzZSwiX2RvYyI6eyJfX3YiOjAsImFkbWluIjpmYWxzZSwiZW1haWwiOiJ1bGlzZXNAZ21haWwuY29tIiwicGFzc3dvcmQiOiI1NjQyMWI3NzBhYzFkNzA1YTRjYmJjMTQ4ZGEwZDAyYzE0ZjU4N2U2YjQyMjhiZjRmMDM2YTE2MGE3N2Y2NWY1IiwibmFtZSI6InVsaXNlcyIsIl9pZCI6IjU4MWU4MDQ0OTUwNjM3MTZjY2I3YjcxMiJ9LCIkaW5pdCI6dHJ1ZSwiaWF0IjoxNTM4OTUzOTcwfQ.g_GfROeGZNoZP8Hboyuxuy93FNAITy3ntwX1fQSfy0g"
 */