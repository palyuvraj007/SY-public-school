import mongoose, { Schema, models } from 'mongoose';

const StudentSchema = new Schema({
  fullName: { type: String, required: true },
  fatherName: { type: String, required: true },
  fatherMobile: { type: String, required: true },
  targetClass: { type: String, required: true },
  section: { type: String, required: true },
  house: { type: String, required: true },
  feeStatus: { type: String, required: true },
}, { timestamps: true });

const Student = models.Student || mongoose.model('Student', StudentSchema);

export default Student;