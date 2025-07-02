import mongoose, { type Document, Schema } from "mongoose"

export interface IBreathingSession extends Document {
  userId: mongoose.Types.ObjectId
  technique: string
  duration: number
  cycles: number
  completedAt: Date
}

const BreathingSessionSchema = new Schema<IBreathingSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    technique: {
      type: String,
      required: true,
      enum: ["box", "478", "triangle", "coherent", "energizing", "extended"],
    },
    duration: {
      type: Number,
      default: 0,
    },
    cycles: {
      type: Number,
      required: true,
      min: 1,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

BreathingSessionSchema.index({ userId: 1, completedAt: -1 })

export default mongoose.models.BreathingSession ||
  mongoose.model<IBreathingSession>("BreathingSession", BreathingSessionSchema)
