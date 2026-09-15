const Service = require("../Models/Service");
const mongoose = require("mongoose");

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
      tag,
      
    } = req.body;

    const image = req.file
      ? req.file.filename
      : "";

    const newService = new Service({
      name,
      price,
      description,
      category,
      image,
      detailedDescription,
      tag,

      // Logged-in provider
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
// GET PROVIDER SERVICES
// =====================================================

const getProviderServices = async (req, res) => {
  try {

    const services = await Service.find({
      provider: req.user.id,
    })
      .populate(
        "provider",
        "name email availability"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      services,
    });

  } catch (error) {

    console.error(
      "Get provider services error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch your services",
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
      provider,
      minPrice,
      maxPrice,
      minRating,
      availability,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    // =================================================
    // PAGINATION
    // =================================================

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const itemsPerPage = Math.min(
      Math.max(
        Number(limit) || 10,
        1
      ),
      50
    );

    const skip =
      (currentPage - 1) *
      itemsPerPage;


    // =================================================
    // PRICE VALIDATION
    // =================================================

    const minimumPrice =
      minPrice !== undefined
        ? Number(minPrice)
        : null;

    const maximumPrice =
      maxPrice !== undefined
        ? Number(maxPrice)
        : null;

    if (
      (minimumPrice !== null &&
        !Number.isFinite(minimumPrice)) ||
      (maximumPrice !== null &&
        !Number.isFinite(maximumPrice))
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
        message:
          "Minimum price cannot be greater than maximum price",
      });
    }


    // =================================================
    // RATING VALIDATION
    // =================================================

    const minimumRating =
      minRating !== undefined
        ? Number(minRating)
        : null;

    if (
      minimumRating !== null &&
      (
        !Number.isFinite(minimumRating) ||
        minimumRating < 0 ||
        minimumRating > 5
      )
    ) {
      return res.status(400).json({
        message:
          "Minimum rating must be between 0 and 5",
      });
    }


    // =================================================
    // AVAILABILITY VALIDATION
    // =================================================

    const validAvailabilityDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    if (
      availability &&
      availability !== "today" &&
      !validAvailabilityDays.includes(availability)
    ) {
      return res.status(400).json({
        message: "Invalid availability filter",
      });
    }


    // =================================================
    // INDIA CURRENT DAY / TIME
    // =================================================

    const now = new Date();

    const todayDay = new Intl.DateTimeFormat(
      "en-US",
      {
        weekday: "long",
        timeZone: "Asia/Kolkata",
      }
    ).format(now);

    const currentTime = new Intl.DateTimeFormat(
      "en-GB",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      }
    ).format(now);


    // =================================================
    // SERVICE FILTER
    // =================================================

    const serviceMatch = {
      status: "approved",
    };


    // =================================================
    // PROVIDER FILTER
    // =================================================

    if (
      provider &&
      provider.trim() !== ""
    ) {
      if (
        !mongoose.Types.ObjectId.isValid(
          provider
        )
      ) {
        return res.status(400).json({
          message: "Invalid provider",
        });
      }

      serviceMatch.provider =
        new mongoose.Types.ObjectId(
          provider.trim()
        );
    }


    // =================================================
    // SEARCH
    // =================================================

    if (
      search &&
      search.trim() !== ""
    ) {
      serviceMatch.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }


    // =================================================
    // CATEGORY
    // =================================================

    if (
      category &&
      category.trim() !== ""
    ) {
      serviceMatch.category =
        category.trim();
    }


    // =================================================
    // PRICE
    // =================================================

    if (
      minimumPrice !== null ||
      maximumPrice !== null
    ) {
      serviceMatch.price = {};

      if (minimumPrice !== null) {
        serviceMatch.price.$gte =
          minimumPrice;
      }

      if (maximumPrice !== null) {
        serviceMatch.price.$lte =
          maximumPrice;
      }
    }


    // =================================================
    // AVAILABILITY MATCH
    // =================================================

    let availabilityMatch = null;

    if (availability === "today") {

      availabilityMatch = {
        "provider.availability.days":
          todayDay,

        $expr: {
          $and: [
            {
              $lte: [
                "$provider.availability.startTime",
                currentTime,
              ],
            },
            {
              $gte: [
                "$provider.availability.endTime",
                currentTime,
              ],
            },
          ],
        },
      };

    } else if (availability) {

      availabilityMatch = {
        "provider.availability.days":
          availability,
      };
    }


    // =================================================
    // BASE PIPELINE
    // =================================================

    const basePipeline = [

      // -----------------------------------------------
      // 1. MATCH APPROVED SERVICES
      // -----------------------------------------------

      {
        $match: serviceMatch,
      },


      // -----------------------------------------------
      // 2. GET REVIEWS
      // -----------------------------------------------

      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "service",
          as: "reviews",
        },
      },


      // -----------------------------------------------
      // 3. GET PROVIDER
      // -----------------------------------------------

      {
        $lookup: {
          from: "users",
          localField: "provider",
          foreignField: "_id",
          as: "provider",
        },
      },


      // -----------------------------------------------
      // 4. PROVIDER ARRAY → OBJECT
      // -----------------------------------------------

      {
        $unwind: {
          path: "$provider",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];


    // =================================================
    // APPLY AVAILABILITY FILTER
    // =================================================

    if (availabilityMatch) {
      basePipeline.push({
        $match: availabilityMatch,
      });
    }


    // =================================================
    // CALCULATE RATING
    // =================================================

    basePipeline.push({

      $addFields: {

        averageRating: {
          $cond: [

            {
              $gt: [
                {
                  $size: "$reviews",
                },
                0,
              ],
            },

            {
              $round: [
                {
                  $avg:
                    "$reviews.rating",
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

    });


    // =================================================
    // MINIMUM RATING FILTER
    // =================================================

    if (
      minimumRating !== null
    ) {

      basePipeline.push({
        $match: {
          averageRating: {
            $gte: minimumRating,
          },
        },
      });

    }


    // =================================================
    // SORT
    // =================================================

    if (
      sort === "rating_desc"
    ) {

      basePipeline.push({
        $sort: {
          averageRating: -1,
        },
      });

    } else if (
      sort === "price_asc"
    ) {

      basePipeline.push({
        $sort: {
          price: 1,
        },
      });

    } else if (
      sort === "price_desc"
    ) {

      basePipeline.push({
        $sort: {
          price: -1,
        },
      });

    } else {

      // Recommended / Newest

      basePipeline.push({
        $sort: {
          createdAt: -1,
        },
      });

    }


    // =================================================
    // REMOVE REVIEWS + PASSWORD
    // =================================================

    basePipeline.push({

      $project: {

        reviews: 0,

        "provider.password": 0,

      },

    });


    // =================================================
    // PAGINATION
    // =================================================

    const aggregationPipeline = [

      ...basePipeline,

      {
        $skip: skip,
      },

      {
        $limit: itemsPerPage,
      },

    ];


    // =================================================
    // GET SERVICES
    // =================================================

    const services =
      await Service.aggregate(
        aggregationPipeline
      );


    // =================================================
    // COUNT TOTAL SERVICES
    // =================================================

    const countPipeline = [

      ...basePipeline,

      {
        $count: "total",
      },

    ];


    const countResult =
      await Service.aggregate(
        countPipeline
      );


    const totalServices =
      countResult.length > 0
        ? countResult[0].total
        : 0;


    // =================================================
    // TOTAL PAGES
    // =================================================

    const totalPages =
      Math.ceil(
        totalServices /
        itemsPerPage
      );


    // =================================================
    // RESPONSE
    // =================================================

    res.status(200).json({

      services,

      pagination: {

        page: currentPage,

        limit: itemsPerPage,

        totalServices,

        totalPages,

        hasNextPage:
          currentPage <
          totalPages,

        hasPreviousPage:
          currentPage > 1,

      },

    });

  } catch (error) {

    console.error(
      "Get services error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch services",
    });
  }
};


// =====================================================
// GET SINGLE SERVICE
// =====================================================

const getServiceById = async (
  req,
  res
) => {

  try {

    const service =
      await Service.findById(
        req.params.id
      ).populate(
        "provider",
        "name email availability"
      );


    if (!service) {

      return res.status(404).json({
        message:
          "Service not found",
      });
    }


    res.status(200).json(
      service
    );

  } catch (error) {

    console.error(
      "Get service error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch service",
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
    })
      .populate(
        "provider",
        "name email availability"
      )
      .sort({
        createdAt: -1,
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

const approveService = async (
  req,
  res
) => {

  try {

    //Find the service
    const service =
      await Service.findById(
        req.params.id
      );

      // Check if the service exists
    if (!service) {

      return res.status(404).json({
        message:
          "Service not found",
      });
    }
  // Check if the service is pending

    if (
      service.status !==
      "pending"
    ) {
      // Only pending services can be approved
      return res.status(400).json({
        message:
          "Only pending services can be approved",
      });
    }

// Update the service status to approved and clear admin comment
    service.status =
      "approved";

    service.adminComment =
      "";

// Save the updated service
    await service.save();

// Send a success response with the updated service
    res.status(200).json({

      message:
        "Service approved successfully",

      service,

    });

  } catch (error) {

    console.error(
      "Approve service error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to approve service",
    });
  }
};


// =====================================================
// REQUEST CHANGES
// =====================================================

const requestChanges = async (
  req,
  res
) => {

  try {

    const {
      adminComment,
    } = req.body;


    if (
      !adminComment ||
      adminComment.trim() === ""
    ) {

      return res.status(400).json({
        message:
          "Admin comment is required",
      });
    }


    const service =
      await Service.findById(
        req.params.id
      );


    if (!service) {

      return res.status(404).json({
        message:
          "Service not found",
      });
    }


    if (
      service.status !==
      "pending"
    ) {

      return res.status(400).json({
        message:
          "Changes can only be requested for pending services",
      });
    }


    service.status =
      "changes_requested";

    service.adminComment =
      adminComment.trim();


    await service.save();


    res.status(200).json({

      message:
        "Changes requested successfully",

      service,

    });

  } catch (error) {

    console.error(
      "Request changes error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to request changes",
    });
  }
};


// =====================================================
// REJECT SERVICE
// =====================================================

const rejectService = async (
  req,
  res
) => {

  try {

    const {
      adminComment,
    } = req.body;


    if (
      !adminComment ||
      adminComment.trim() === ""
    ) {

      return res.status(400).json({
        message:
          "Rejection reason is required",
      });
    }


    const service =
      await Service.findById(
        req.params.id
      );


    if (!service) {

      return res.status(404).json({
        message:
          "Service not found",
      });
    }


    if (
      service.status !==
      "pending"
    ) {

      return res.status(400).json({
        message:
          "Only pending services can be rejected",
      });
    }


    service.status =
      "rejected";

    service.adminComment =
      adminComment.trim();


    await service.save();


    res.status(200).json({

      message:
        "Service rejected successfully",

      service,

    });

  } catch (error) {

    console.error(
      "Reject service error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to reject service",
    });
  }
};


// =====================================================
// UPDATE SERVICE
// =====================================================

const updateService = async (
  req,
  res
) => {

  try {

    const service =
      await Service.findById(
        req.params.id
      );


    if (!service) {

      return res.status(404).json({
        message:
          "Service not found",
      });
    }


    // Provider can update own service
    // Admin can update any service

    if (
      req.user.role ===
        "provider" &&
      service.provider.toString() !==
        req.user.id
    ) {

      return res.status(403).json({
        message:
          "You can update only your own services",
      });
    }


    const updateFields = {

      name: req.body.name,

      price: req.body.price,

      description:
        req.body.description,

      category:
        req.body.category,

      detailedDescription:
        req.body.detailedDescription,

      tag: req.body.tag,

    };


    if (req.file) {

      updateFields.image =
        req.file.filename;
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

      message:
        "Service updated successfully",

      service:
        updatedService,

    });

  } catch (error) {

    console.error(
      "Update service error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update service",
    });
  }
};


// =====================================================
// DELETE SERVICE
// =====================================================

const deleteService = async (
  req,
  res
) => {

  try {

    const service =
      await Service.findById(
        req.params.id
      );


    if (!service) {

      return res.status(404).json({
        message:
          "Service not found",
      });
    }


    // Provider can delete own service
    // Admin can delete any service

    if (
      req.user.role ===
        "provider" &&
      service.provider.toString() !==
        req.user.id
    ) {

      return res.status(403).json({
        message:
          "You can delete only your own services",
      });
    }


    await service.deleteOne();


    res.status(200).json({
      message:
        "Service deleted successfully",
    });

  } catch (error) {

    console.error(
      "Delete service error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to delete service",
    });
  }
};


// =====================================================
// RESUBMIT SERVICE
// =====================================================

const resubmitService = async (
  req,
  res
) => {

  try {

    const service =
      await Service.findById(
        req.params.id
      );


    if (!service) {

      return res.status(404).json({
        message:
          "Service not found",
      });
    }


    // Only owner provider

    if (
      service.provider.toString() !==
      req.user.id
    ) {

      return res.status(403).json({
        message:
          "You can resubmit only your own service",
      });
    }


    // Only changes requested

    if (
      service.status !==
      "changes_requested"
    ) {

      return res.status(400).json({
        message:
          "Only services with requested changes can be resubmitted",
      });
    }


    service.status =
      "pending";

    service.adminComment =
      "";


    await service.save();


    res.status(200).json({

      message:
        "Service resubmitted successfully",

      service,

    });

  } catch (error) {

    console.error(
      "Resubmit service error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to resubmit service",
    });
  }
};


// =====================================================
// GET SERVICE CATEGORIES
// =====================================================

const getServiceCategories = async (req, res) => {
  try {
    const categories = await Service.distinct(
      "category",
      {
        status: "approved",
        category: {
          $exists: true,
          $ne: "",
        },
      }
    );

    categories.sort((a, b) =>
      a.localeCompare(b)
    );

    res.status(200).json({
      categories,
    });

  } catch (error) {

    console.error(
      "Get service categories error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch service categories",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {

  addService,

  getServices,

  getServiceById,

  getProviderServices,

  getPendingServices,

  approveService,

  requestChanges,

  rejectService,

  updateService,

  deleteService,

  resubmitService,

  getServiceCategories,

};