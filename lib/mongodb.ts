import mongoose from "mongoose"

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb+srv://ayushmishra252004:ayush24m@cluster0.4rjtrxd.mongodb.net/mental-health-app"

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var myMongoose: MongooseCache | undefined
}

const cached: MongooseCache = global.myMongoose || { conn: null, promise: null }

if (!global.myMongoose) {
  global.myMongoose = cached
}

async function connectDB(): Promise<typeof mongoose> {
  console.log("Attempting to connect to MongoDB...")

  if (cached.conn) {
    console.log("Using existing MongoDB connection")
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }

    console.log("Creating new MongoDB connection...")
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("MongoDB connected successfully!")
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
    console.log("MongoDB connection established")
  } catch (e: any) {
    console.error("MongoDB connection failed:", e.message)
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB
