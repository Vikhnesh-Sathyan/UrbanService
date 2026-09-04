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
      provider: req.user._id, // Assuming the user is authenticated and their ID is available in req.user
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
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.status(200).json({
      message: "Service approved successfully",
      service,
    });
  } catch (error) {
    res.status(500).json({
      message: "Approval failed",
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
  updateService,
  deleteService,
};