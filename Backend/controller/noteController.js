import noteModel from "../models/noteModel.js";
import tenantModel from "../models/TenantModel.js";

// Create Note
export const createNote = async (req, res) => {
  console.log("req.user:", req.user);
  try {
    // Current tenant data
    const tenant = await tenantModel.findById(req.user.tenantId);
    if (!tenant) {
      return res.json({
        success: false,
        status: 400,
        message: "Tenant not found",
        body: {},
      });
    }

    // Free plan limit per user
    if (tenant.plan === "free") {
      const noteCount = await noteModel.countDocuments({ tenantId: tenant._id, user: req.user._id });
      if (noteCount >= 3) {
        return res.json({
          success: false,
          status: 403,
          message: "Free plan limit reached (max 3 notes per user). Please upgrade to Pro.",
          body: {},
        });
      }
    }

    // Create Note
    const note = await noteModel.create({
      title: req.body.title,
      content: req.body.content,
      tenantId: req.user.tenantId,
      user: req.user._id,
    });

    return res.json({
      success: true,
      status: 201,
      message: "Note created successfully",
      body: note,
    });
  } catch (error) {
    console.log(error, "createNote error");
    return res.json({
      success: false,
      status: 500,
      message: "Internal server error",
      body: {},
    });
  }
};

// Get All Notes for tenant
export const getAllNotes = async (req, res) => {
  try {
    const notes = await noteModel.find({ tenantId: req.user.tenantId }).lean();
    // Convert user field to string for frontend comparison
    notes.forEach(n => n.user = n.user.toString());

    return res.json({
      success: true,
      status: 200,
      message: "All notes fetched successfully",
      body: notes,
    });
  } catch (error) {
    console.log(error, "getAllNotes error");
    return res.json({
      success: false,
      status: 500,
      message: "Internal server error",
      body: [],
    });
  }
};

// Get Single Note
export const getSingleNote = async (req, res) => {
  try {
    const note = await noteModel.findOne({
      _id: req.params.id,
      tenantId: req.user.tenantId,
    });

    if (!note) {
      return res.json({
        success: false,
        status: 404,
        message: "Note not found",
        body: {},
      });
    }

    return res.json({
      success: true,
      status: 200,
      message: "Note fetched successfully",
      body: note,
    });
  } catch (error) {
    console.log(error, "getSingleNote error");
    return res.json({
      success: false,
      status: 500,
      message: "Internal server error",
      body: {},
    });
  }
};

// Update Note
export const updateNote = async (req, res) => {
  try {
    const note = await noteModel.findOne({
      _id: req.params.id,
      tenantId: req.user.tenantId,
    });

    if (!note) {
      return res.json({
        success: false,
        status: 404,
        message: "Note not found",
        body: {},
      });
    }

    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;
    await note.save();

    return res.json({
      success: true,
      status: 200,
      message: "Note updated successfully",
      body: note,
    });
  } catch (error) {
    console.log(error, "updateNote error");
    return res.json({
      success: false,
      status: 500,
      message: "Internal server error",
      body: {},
    });
  }
};

// Delete Note
export const deleteNote = async (req, res) => {
  try {
    const note = await noteModel.findOne({
      _id: req.params.id,
      tenantId: req.user.tenantId,
    });

    if (!note) {
      return res.json({
        success: false,
        status: 404,
        message: "Note not found",
        body: {},
      });
    }

    await note.deleteOne();

    return res.json({
      success: true,
      status: 200,
      message: "Note deleted successfully",
      body: note,
    });
  } catch (error) {
    console.log(error, "deleteNote error");
    return res.json({
      success: false,
      status: 500,
      message: "Internal server error",
      body: {},
    });
  }
};
