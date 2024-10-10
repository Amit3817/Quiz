const mongoose=require('mongoose');

const schema=mongoose.Schema;

const userschema=new schema({
    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },
    name:{
        type:String
    },
    quizAttempts: [
        {
          quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
          score: { type: Number },
          attemptedAt: { type: Date, default: Date.now },
        }
      ],
  otp:{
        type:String
    },

    expireotp:{
        type:Date
    },

    emailverify:{
        type:Boolean,
        default:false
    }


});

module.exports=mongoose.model("User",userschema);
