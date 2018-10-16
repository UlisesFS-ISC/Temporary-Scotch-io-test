
var mongoose = require('mongoose');


var Schema= mongoose.Schema;



var TimeEntrySchema = new Schema({

    uuid: {

        type:String,

        required:true

    },

    timeEntryName:{

        type:String,

        required:true

    },

    timeElapsed:{

        type:String,

        required:true

    },

    userName:{

        type:String,

        required:true

    },

    datePosted:{

        type:String,

        default: 'LEISURE'

    },

    activityTag: {

        type: String,

        enum: ['PRODUCTIVITY', 'LEISURE', 'SKILL_LEARNING', 'ERRAND', 'IMPORTANT'],

        default: 'LEISURE'
    }
});

TimeEntrySchema.pre('save',function(next){
	var TimeEntrySchema=this;
	return next();
});


module.exports = mongoose.model('TimeEntrySchema', TimeEntrySchema);