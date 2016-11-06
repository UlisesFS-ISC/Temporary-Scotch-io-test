
var mongoose = require('mongoose');


var Schema= mongoose.Schema;



var EntrySchema = new Schema({
	name:{
		type:String,
		required:true
	},
	timeelapsed:{
		type:String,
		required:true
	},
	user:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	dateposted:{
		type:String,
		required:true
	}
});

EntrySchema.pre('save',function(next){
	var newEntry=this;
	return next();
});


module.exports = mongoose.model('Entry', EntrySchema);