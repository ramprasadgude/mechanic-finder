const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mechanic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mechanic",
      required: true,
    },
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: true,
      unique: true, // Only one review per service request
    },
    rating: {
      type: Number,
      required: [true, "Please provide a rating between 1 and 5"],
      min: 1,
      max: 5,
    },
    priceRating: {
      type: Number,
      default: 5,
      min: 1, max: 5
    },
    speedRating: {
      type: Number,
      default: 5,
      min: 1, max: 5
    },
    qualityRating: {
      type: Number,
      default: 5,
      min: 1, max: 5
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, "Review comment cannot exceed 500 characters"],
    },
  },
  { timestamps: true }
);


// Static method to calculate average rating and update mechanic
reviewSchema.statics.calculateAverageRating = async function (mechanicId) {
  const stats = await this.aggregate([
    {
      $match: { mechanic: mechanicId },
    },
    {
      $group: {
        _id: "$mechanic",
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model("Mechanic").findByIdAndUpdate(mechanicId, {
      rating: stats.length > 0 ? Math.round(stats[0].averageRating * 10) / 10 : 0,
      numOfReviews: stats.length > 0 ? stats[0].numOfReviews : 0,
    });
  } catch (err) {
    console.error("Error updating mechanic rating: ", err);
  }
};

// Call calculateAverageRating after save
reviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.mechanic);
});

// Call calculateAverageRating before remove (if needed)
reviewSchema.post("remove", async function () {
  await this.constructor.calculateAverageRating(this.mechanic);
});

module.exports = mongoose.model("Review", reviewSchema);
