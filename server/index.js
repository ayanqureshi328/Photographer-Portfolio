import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'

const app = express()
const port = process.env.PORT || 3001

app.use(express.json({ limit: '20kb' }))

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    projectType: { type: String, required: true, trim: true, maxlength: 80 },
    budget: { type: String, required: true, trim: true, maxlength: 80 },
    message: { type: String, required: true, trim: true, maxlength: 3000 },
  },
  { timestamps: true },
)

const Inquiry = mongoose.model('Inquiry', inquirySchema)

app.post('/api/inquiries', async (request, response) => {
  if (mongoose.connection.readyState !== 1) {
    return response.status(503).json({ error: 'The inquiry service is temporarily unavailable.' })
  }

  const { name, email, projectType, budget, message } = request.body ?? {}
  if (![name, email, projectType, budget, message].every((value) => typeof value === 'string' && value.trim())) {
    return response.status(400).json({ error: 'Please complete every field.' })
  }

  try {
    await Inquiry.create({ name, email, projectType, budget, message })
    return response.status(201).json({ message: 'Inquiry received.' })
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return response.status(400).json({ error: 'One or more fields are too long.' })
    }
    console.error('Unable to save inquiry:', error.message)
    return response.status(500).json({ error: 'Your inquiry could not be saved. Please try again.' })
  }
})

app.get('/api/health', (_request, response) => {
  response.json({ database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' })
})

if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection failed:', error.message))
} else {
  console.warn('MONGODB_URI is not set. Inquiry submissions will be unavailable.')
}

app.listen(port, () => console.log(`Inquiry API listening on http://localhost:${port}`))