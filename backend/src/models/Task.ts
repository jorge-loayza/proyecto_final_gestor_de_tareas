import { Schema, model } from 'mongoose';

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ['pendiente', 'en progreso', 'completada'],
      default: 'pendiente',
    },
    dueDate: Date,
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Task = model('Task', taskSchema);
