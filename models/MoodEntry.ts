import mongoose, { type Document, Schema } from "mongoose"

export interface IMoodEntry extends Document {
  userId: mongoose.Types.ObjectId
  mood: {
    emoji: string
    label: string
  }
  intensity: number
  journalEntry?: string
  date: Date
}

const MoodEntrySchema = new Schema<IMoodEntry>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mood: {
      emoji: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        required: true,
      },
    },
    intensity: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    journalEntry: {
      type: String,
      maxlength: [1000, "Journal entry cannot be more than 1000 characters"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

MoodEntrySchema.index({ userId: 1, date: -1 })

export default mongoose.models.MoodEntry || mongoose.model<IMoodEntry>("MoodEntry", MoodEntrySchema)
