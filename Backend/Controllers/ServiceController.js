const Service = require("../Models/Service");

// Add Service
const addService = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      detailedDescription,
    } = req.body;

    const image = req.file ? req.file.filename : "";

    const newService = new Service({
      name,
      price,
      description,
      category,
      image,
      detailedDescription,

      // Store the logged-in provider's ID
      provider: req.user.id,
    });

    await newService.save();

    res.status(201).json({
      message: "Service submitted for approval!",
      service: newService,
    });
  } catch (error) {
    console.error("Add service error:", error);

    res.status(500).json({
      message: "Failed to add service",
    });
  }
};


// Get All Approved Services
const getServices = async (req, res) => {
  try {
    const { category } = req.query;

    const query = {
      status: "approved",
    };

    if (category) {
      query.category = category;
    }

    const services = await Service.find(query);

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch services",
    });
  }
};


// Get Single Service
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch service",
    });
  }
};


// Get Pending Services
const getPendingServices = async (req, res) => {
  try {
    const services = await Service.find({
      status: "pending",
    });

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch pending services",
    });
  }
};


// Approve Service
const approveService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // Only pending services can be approved
    if (service.status !== "pending") {
      return res.status(400).json({
        message: "Only pending services can be approved",
      });
    }

    service.status = "approved";

    // Clear previous admin comment
    service.adminComment = "";

    await service.save();

    res.status(200).json({
      message: "Service approved successfully",
      service,
    });
  } catch (error) {
    console.error("Approve service error:", error);

    res.status(500).json({
      message: "Failed to approve service",
    });
  }
};


// Request Changes
const requestChanges = async (req, res) => {
  try {
    const { adminComment } = req.body;

    if (!adminComment || adminComment.trim() === "") {
      return res.status(400).json({
        message: "Admin comment is required",
      });
    }

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // Changes can only be requested for pending services
    if (service.status !== "pending") {
      return res.status(400).json({
        message: "Changes can only be requested for pending services",
      });
    }

    service.status = "changes_requested";
    service.adminComment = adminComment;

    await service.save();

    res.status(200).json({
      message: "Changes requested successfully",
      service,
    });
  } catch (error) {
    console.error("Request changes error:", error);

    res.status(500).json({
      message: "Failed to request changes",
    });
  }
};


// Reject Service
const rejectService = async (req, res) => {
  try {
    const { adminComment } = req.body;

    if (!adminComment || adminComment.trim() === "") {
      return res.status(400).json({
        message: "Rejection reason is required",
      });
    }

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // Only pending services can be rejected
    if (service.status !== "pending") {
      return res.status(400).json({
        message: "Only pending services can be rejected",
      });
    }

    service.status = "rejected";
    service.adminComment = adminComment;

    await service.save();

    res.status(200).json({
      message: "Service rejected",
      service,
    });
  } catch (error) {
    console.error("Reject service error:", error);

    res.status(500).json({
      message: "Failed to reject service",
    });
  }
};


// Update Service
const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // Provider can update only their own service
    if (
      req.user.role === "provider" &&
      service.provider.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "You can update only your own services",
      });
    }

    const updateFields = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      detailedDescription: req.body.detailedDescription,
    };

    if (req.file) {
      updateFields.image = req.file.filename;
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    res.status(200).json({
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (error) {
    console.error("Update service error:", error);

    res.status(500).json({
      message: "Failed to update service",
    });
  }
};


// Delete Service
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // Provider can delete only their own service
    if (
      req.user.role === "provider" &&
      service.provider.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "You can delete only your own services",
      });
    }

    await service.deleteOne();

    res.status(200).json({
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Delete service error:", error);

    res.status(500).json({
      message: "Failed to delete service",
    });
  }
};


module.exports = {
  addService,
  getServices,
  getServiceById,
  getPendingServices,
  approveService,
  requestChanges,
  rejectService,
  updateService,
  deleteService,
};