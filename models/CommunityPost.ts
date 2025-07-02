import mongoose, { type Document, Schema } from "mongoose"

export interface ICommunityPost extends Document {
  userId: mongoose.Types.ObjectId
  content: string
  authorName: string
  likes: Array<{
    userId: mongoose.Types.ObjectId
    createdAt: Date
  }>
  tags: string[]
  isAnonymous: boolean
}

const CommunityPostSchema = new Schema<ICommunityPost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Please provide content for the post"],
      maxlength: [500, "Post content cannot be more than 500 characters"],
    },
    authorName: {
      type: String,
      required: true,
    },
    likes: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tags: [String],
    isAnonymous: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

CommunityPostSchema.index({ createdAt: -1 })

export default mongoose.models.CommunityPost || mongoose.model<ICommunityPost>("CommunityPost", CommunityPostSchema)
