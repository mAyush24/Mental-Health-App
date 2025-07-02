import mongoose, { type Document, Schema } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  totalPoints: number
  currentStreak: number
  longestStreak: number
  lastCheckIn: Date | null
  achievements: Array<{
    name: string
    icon: string
    earnedDate: Date
  }>
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    lastCheckIn: {
      type: Date,
      default: null,
    },
    achievements: [
      {
        name: String,
        icon: String,
        earnedDate: Date,
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    console.log("Hashing password...")
    this.password = await bcrypt.hash(this.password, 12)
    console.log("Password hashed successfully")
    next()
  } catch (error) {
    console.error("Password hashing error:", error)
    next(error)
  }
})

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    console.log("Comparing passwords...")
    const result = await bcrypt.compare(candidatePassword, this.password)
    console.log("Password comparison result:", result)
    return result
  } catch (error) {
    console.error("Password comparison error:", error)
    return false
  }
}

// Ensure index on email
UserSchema.index({ email: 1 }, { unique: true })

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
