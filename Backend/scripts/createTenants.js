
import dotenv from "dotenv";
import { conn } from "../connection/dbConnect.js";
import tenantModel from "../models/TenantModel.js";

dotenv.config();
conn();

const createTenants = async () => {
  try {
    await tenantModel.create({ name: "Acme", slug: "acme", plan: "free" });
    await tenantModel.create({ name: "Globex", slug: "globex", plan: "free" });

    console.log(" Tenants created successfully!");
    process.exit();
  } catch (error) {
    console.error(" Error creating tenants:", error);
    process.exit(1);
  }
};

createTenants();
