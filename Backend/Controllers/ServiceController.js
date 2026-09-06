const Service = require("../Models/Service");

// =====================================================
// ADD SERVICE
// =====================================================

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

      // Logged-in provider's ID
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

// =====================================================
// GET ALL APPROVED SERVICES
// Search + Filter + Rating + Sorting + Pagination
// =====================================================

const getServices = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      minRating,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    // -------------------------------------------------
    // Pagination validation
    // -------------------------------------------------

    const currentPage = Math.max(Number(page) || 1, 1);

    const itemsPerPage = Math.min(
      Math.max(Number(limit) || 10, 1),
      50
    );

    const skip = (currentPage - 1) * itemsPerPage;

    // -------------------------------------------------
    // Price validation
    // -------------------------------------------------

    const minimumPrice =
      minPrice !== undefined ? Number(minPrice) : null;

    const maximumPrice =
      maxPrice !== undefined ? Number(maxPrice) : null;

    if (
      (minimumPrice !== null && !Number.isFinite(minimumPrice)) ||
      (maximumPrice !== null && !Number.isFinite(maximumPrice))
    ) {
      return res.status(400).json({
        message: "Invalid price filter",
      });
    }

    if (
      minimumPrice !== null &&
      maximumPrice !== null &&
      minimumPrice > maximumPrice
    ) {
      return res.status(400).json({
        message: "Minimum price cannot be greater than maximum price",
      });
    }

    // -------------------------------------------------
    // Rating validation
    // -------------------------------------------------

    const minimumRating =
      minRating !== undefined ? Number(minRating) : null;

    if (
      minimumRating !== null &&
      (!Number.isFinite(minimumRating) ||
        minimumRating < 0 ||
        minimumRating > 5)
    ) {
      return res.status(400).json({
        message: "Minimum rating must be between 0 and 5",
      });
    }

    // -------------------------------------------------
    // Build service filter
    // -------------------------------------------------

    const serviceMatch = {
      status: "approved",
    };

    // Search by service name
    if (search && search.trim() !== "") {
      serviceMatch.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    // Filter by category
    if (category && category.trim() !== "") {
      serviceMatch.category = category.trim();
    }

    // Filter by price
    if (
      minimumPrice !== null ||
      maximumPrice !== null
    ) {
      serviceMatch.price = {};

      if (minimumPrice !== null) {
        serviceMatch.price.$gte = minimumPrice;
      }

      if (maximumPrice !== null) {
        serviceMatch.price.$lte = maximumPrice;
      }
    }

    // =================================================
    // AGGREGATION
    // =================================================

    const aggregationPipeline = [
      // 1. Only approved services
      {
        $match: serviceMatch,
      },

      // 2. Get reviews for each service
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "service",
          as: "reviews",
        },
      },

      // 3. Calculate rating and review count
      {
        $addFields: {
          averageRating: {
            $cond: [
              {
                $gt: [
                  { $size: "$reviews" },
                  0,
                ],
              },
              {
                $round: [
                  {
                    $avg: "$reviews.rating",
                  },
                  1,
                ],
              },
              0,
            ],
          },

          totalReviews: {
            $size: "$reviews",
          },
        },
      },
    ];

    // -------------------------------------------------
    // Minimum rating filter
    // -------------------------------------------------

    if (minimumRating !== null) {
      aggregationPipeline.push({
        $match: {
          averageRating: {
            $gte: minimumRating,
          },
        },
      });
    }

    // -------------------------------------------------
    // Remove reviews array
    // -------------------------------------------------

    aggregationPipeline.push({
      $project: {
        reviews: 0,
      },
    });

    // -------------------------------------------------
    // Sorting
    // -------------------------------------------------

    if (sort === "rating") {
      aggregationPipeline.push({
        $sort: {
          averageRating: -1,
        },
      });
    } else if (sort === "price_low") {
      aggregationPipeline.push({
        $sort: {
          price: 1,
        },
      });
    } else if (sort === "price_high") {
      aggregationPipeline.push({
        $sort: {
          price: -1,
        },
      });
    } else {
      // Default: newest first
      aggregationPipeline.push({
        $sort: {
          createdAt: -1,
        },
      });
    }

    // -------------------------------------------------
    // Pagination
    // -------------------------------------------------

    aggregationPipeline.push(
      {
        $skip: skip,
      },
      {
        $limit: itemsPerPage,
      }
    );

    // -------------------------------------------------
    // Execute aggregation
    // -------------------------------------------------

    const services = await Service.aggregate(
      aggregationPipeline
    );

    // =================================================
    // COUNT TOTAL MATCHING SERVICES
    // =================================================

    // Important:
    // Use the same rating logic so pagination remains correct.

    let totalServices;

    if (minimumRating !== null) {
      const countResult = await Service.aggregate([
        {
          $match: serviceMatch,
        },

        {
          $lookup: {
            from: "reviews",
            localField: "_id",
            foreignField: "service",
            as: "reviews",
          },
        },

        {
          $addFields: {
            averageRating: {
              $cond: [
                {
                  $gt: [
                    { $size: "$reviews" },
                    0,
                  ],
                },
                {
                  $avg: "$reviews.rating",
                },
                0,
              ],
            },
          },
        },

        {
          $match: {
            averageRating: {
              $gte: minimumRating,
            },
          },
        },

        {
          $count: "total",
        },
      ]);

      totalServices =
        countResult.length > 0
          ? countResult[0].total
          : 0;
    } else {
      totalServices =
        await Service.countDocuments(serviceMatch);
    }

    // -------------------------------------------------
    // Pagination information
    // -------------------------------------------------

    const totalPages = Math.ceil(
      totalServices / itemsPerPage
    );

    res.status(200).json({
      services,

      pagination: {
        page: currentPage,
        limit: itemsPerPage,
        totalServices,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    });
  } catch (error) {
    console.error("Get services error:", error);

    res.status(500).json({
      message: "Failed to fetch services",
    });
  }
};

// =====================================================
// GET SINGLE SERVICE
// =====================================================

const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(
      req.params.id
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.status(200).json(service);
  } catch (error) {
    console.error("Get service error:", error);

    res.status(500).json({
      message: "Failed to fetch service",
    });
  }
};

// =====================================================
// GET PENDING SERVICES
// =====================================================

const getPendingServices = async (req, res) => {
  try {
    const services = await Service.find({
      status: "pending",
    });

    res.status(200).json(services);
  } catch (error) {
    console.error(
      "Get pending services error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch pending services",
    });
  }
};

// =====================================================
// APPROVE SERVICE
// =====================================================

const approveService = async (req, res) => {
  try {
    const service = await Service.findById(
      req.params.id
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // Only pending services can be approved
    if (service.status !== "pending") {
      return res.status(400).json({
        message:
          "Only pending services can be approved",
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
    console.error(
      "Approve service error:",
      error
    );

    res.status(500).json({
      message: "Failed to approve service",
    });
  }
};

// =====================================================
// REQUEST CHANGES
// =====================================================

const requestChanges = async (req, res) => {
  try {
    const { adminComment } = req.body;

    if (
      !adminComment ||
      adminComment.trim() === ""
    ) {
      return res.status(400).json({
        message: "Admin comment is required",
      });
    }

    const service = await Service.findById(
      req.params.id
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // Only pending services can receive change requests
    if (service.status !== "pending") {
      return res.status(400).json({
        message:
          "Changes can only be requested for pending services",
      });
    }

    service.status = "changes_requested";
    service.adminComment = adminComment.trim();

    await service.save();

    res.status(200).json({
      message: "Changes requested successfully",
      service,
    });
  } catch (error) {
    console.error(
      "Request changes error:",
      error
    );

    res.status(500).json({
      message: "Failed to request changes",
    });
  }
};

// =====================================================
// REJECT SERVICE
// =====================================================

const rejectService = async (req, res) => {
  try {
    const { adminComment } = req.body;

    if (
      !adminComment ||
      adminComment.trim() === ""
    ) {
      return res.status(400).json({
        message: "Rejection reason is required",
      });
    }

    const service = await Service.findById(
      req.params.id
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // Only pending services can be rejected
    if (service.status !== "pending") {
      return res.status(400).json({
        message:
          "Only pending services can be rejected",
      });
    }

    service.status = "rejected";
    service.adminComment = adminComment.trim();

    await service.save();

    res.status(200).json({
      message: "Service rejected",
      service,
    });
  } catch (error) {
    console.error(
      "Reject service error:",
      error
    );

    res.status(500).json({
      message: "Failed to reject service",
    });
  }
};

// =====================================================
// UPDATE SERVICE
// =====================================================

const updateService = async (req, res) => {
  try {
    const service = await Service.findById(
      req.params.id
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // Provider can update only their own service
    // Admin can update any service
    if (
      req.user.role === "provider" &&
      service.provider.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message:
          "You can update only your own services",
      });
    }

    const updateFields = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      detailedDescription:
        req.body.detailedDescription,
    };

    // Update image only if a new image was uploaded
    if (req.file) {
      updateFields.image = req.file.filename;
    }

    const updatedService =
      await Service.findByIdAndUpdate(
        req.params.id,
        updateFields,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (error) {
    console.error(
      "Update service error:",
      error
    );

    res.status(500).json({
      message: "Failed to update service",
    });
  }
};

// =====================================================
// DELETE SERVICE
// =====================================================

const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(
      req.params.id
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // Provider can delete only their own service
    // Admin can delete any service
    if (
      req.user.role === "provider" &&
      service.provider.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message:
          "You can delete only your own service",
      });
    }

    await service.deleteOne();

    res.status(200).json({
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete service error:",
      error
    );

    res.status(500).json({
      message: "Failed to delete service",
    });
  }
};

// =====================================================
// RESUBMIT SERVICE
// =====================================================

const resubmitService = async (req, res) => {
  try {
    const service = await Service.findById(
      req.params.id
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // Only the owner provider can resubmit
    if (
      service.provider.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message:
          "You can resubmit only your own service",
      });
    }

    // Only services with requested changes
    // can be resubmitted
    if (
      service.status !== "changes_requested"
    ) {
      return res.status(400).json({
        message:
          "Only services with requested changes can be resubmitted",
      });
    }

    service.status = "pending";
    service.adminComment = "";

    await service.save();

    res.status(200).json({
      message: "Service resubmitted successfully",
      service,
    });
  } catch (error) {
    console.error(
      "Resubmit service error:",
      error
    );

    res.status(500).json({
      message: "Failed to resubmit service",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

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
  resubmitService,
};