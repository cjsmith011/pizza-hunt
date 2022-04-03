const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../../utils/dateFormat');


//this will allow users to reply to comments, nested in the comments
const ReplySchema = new Schema(
  {
    // set custom id to avoid confusion with parent comment _id
    replyId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    replyBody: {
      type: String,
      required: true,
      trim: true
    },
    writtenBy: {
      type: String, 
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
    }
  },
  {
    toJSON: {
      getters: true
    }
  }
);


const CommentSchema = new Schema({
  writtenBy: {
    type: String, 
    required: true
  },
  commentBody: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: createdAtVal => dateFormat(createdAtVal)
  },
  replies: [ReplySchema]
},
{
  toJSON: {
    virtuals: true,
    getters: true
  },
  id: false
}
);

//this will put in a count of replies
CommentSchema.virtual('replyCount').get(function() {
  return this.replies.length;
});


const Comment = model('Comment', CommentSchema);

module.exports = Comment;