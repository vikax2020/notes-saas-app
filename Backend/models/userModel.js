import mongoose from "mongoose"; 

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    password: { type: String, default: "" },
    token: { type: String, default: "" },

    // Tenant reference  for multi-tenancy
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "tenant", required: true },

    
    role: {
      type: String,
      enum: ["Member", "Admin"], 
      default: "Member",        
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);
export default userModel;
