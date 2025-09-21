import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    content: { type: String, default: "" },

    // Tenant reference for multi-tenancy
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "tenant", required: true },

    // User reference 
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }
  },
  { timestamps: true }
);

const noteModel= mongoose.model("note",noteSchema)
export default noteModel
