var mongoose = require('mongoose');
var Schema= mongoose.Schema;

var ScheduleEntry = new Schema({
    uuid: {
        type:String,
        required:true
    },
    scheduleEntryName:{
        type: String,
        required: true
    },
    userName:{
        type:String,
        required:true
    },
    activeInDays: {
        type: [String],
        default: ['SUNDAY'],
        required: false
    },
    scheduledDayTime:{ //SpecificDate and dayTime if singleUse === true ? //SpecificDate , else daytime
        type: String,
        required: false
    },
    datePosted: {
        type: String,
        required: false
    },
    singleUse:{
        type: Boolean,
        required: true
    },
    activityTag: {
        type: String,
        enum: ['PRODUCTIVITY', 'LEISURE', 'SKILL_LEARNING', 'ERRAND', 'IMPORTANT'],
        default: 'LEISURE'
    }
});

ScheduleEntry.pre('save',function(next){
    var ScheduleEntry=this;
    return next();
});


module.exports = mongoose.model('ScheduleEntry', ScheduleEntry);