
import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
  // User submitted fields
  title: string;
  description: string;
  category: 'Bug' | 'Feature Request' | 'Improvement' | 'Other';
  status: 'New' | 'In Review' | 'Resolved';
  submitterName?: string;  
  submitterEmail?: string; 
  submitterIp?: string;     
  ai_category?: string;
  ai_sentiment?: 'Positive' | 'Neutral' | 'Negative';
  ai_priority?: number;    
  ai_summary?: string;
  ai_tags?: string[];
  ai_processed: boolean;   

  createdAt: Date;
  updatedAt: Date;
}

// ---- Mongoose Schema ----
const FeedbackSchema = new Schema<IFeedback>(
  {
    // Title: required, max 120 chars, trimmed of whitespace
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },

    // Description: required, min 20 chars so users write something meaningful
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [20, 'Description must be at least 20 characters'],
    },

    // Category chosen by the user when submitting
    category: {
      type: String,
      enum: {
        values: ['Bug', 'Feature Request', 'Improvement', 'Other'],
        message: 'Category must be Bug, Feature Request, Improvement, or Other',
      },
      required: [true, 'Category is required'],
    },

    // Workflow status — starts as 'New', admin moves it to 'In Review' or 'Resolved'
    status: {
      type: String,
      enum: {
        values: ['New', 'In Review', 'Resolved'],
        message: 'Status must be New, In Review, or Resolved',
      },
      default: 'New',
    },

    // Submitter info — both optional
    submitterName: {
      type: String,
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    submitterEmail: {
      type: String,
      trim: true,
      lowercase: true, // Normalize emails to lowercase
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address',
      ],
    },

    // Store the IP address for rate limiting — never shown in the UI
    submitterIp: {
      type: String,
      select: false, // Never returned in query results unless explicitly requested
    },

    // ---- AI Fields ----
    // These are empty when feedback is first saved
    // Gemini fills them in after processing
    ai_category: { type: String },
    ai_sentiment: {
      type: String,
      enum: ['Positive', 'Neutral', 'Negative'],
    },
    ai_priority: {
      type: Number,
      min: 1,
      max: 10,
    },
    ai_summary: { type: String },
    ai_tags: { type: [String], default: [] },

    // Flag to know if AI has processed this item
    // False = "AI Pending", True = "AI Done"
    ai_processed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Status index — we frequently filter by New/In Review/Resolved
FeedbackSchema.index({ status: 1 });

// Category index — filtering by Bug/Feature Request etc.
FeedbackSchema.index({ category: 1 });

// AI priority index — sorting the dashboard by priority score
FeedbackSchema.index({ ai_priority: -1 }); // -1 = descending (highest first)

// CreatedAt index — sorting by date (most recent first is common)
FeedbackSchema.index({ createdAt: -1 });

// Compound index for the most common query pattern: filter + sort
FeedbackSchema.index({ status: 1, createdAt: -1 });

// Text index for keyword search — searches title and ai_summary fields
FeedbackSchema.index({ title: 'text', ai_summary: 'text' });

// Export the model — this creates the 'feedbacks' collection in MongoDB
export const Feedback = mongoose.model<IFeedback>('Feedback', FeedbackSchema);
