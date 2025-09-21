import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },  
    slug: { type: String, default: "" },
    plan: { type: String, default: "free" } 
  },
  { timestamps: true }
);

const tenantModel = mongoose.model("tenant", tenantSchema);
export default tenantModel;
