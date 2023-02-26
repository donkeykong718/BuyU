import mongoose from "mongoose"

const unionSchema = new mongoose.Schema(
  {
    unionName: {
      properName: String,
      nickName: String,
    },
    locals: [Number],
    industry: String,
    website: String,
    contactInfo:
    {
      phone: {
        isTrue: Boolean,
        details: Number
        },
      eMail: {
        isTrue: Boolean,
        details: String
        },
      faxLOL: {
        isTrue: Boolean,
        details: Number,
        },
      address: {
        isTrue: Boolean,
        details: String
        }
    },
    description: String
  },
  {timestamps: true}
)

export default mongoose.model('Unions', unionSchema);