// controllers/shopController.js
import Shop from "../models/Shop.js";

export const createShop = async (req, res) => {
  try {
    const { shopCode, name, brands, lng, lat } = req.body;

    // Check duplicates
    const existingByName = await Shop.findOne({ name });
    if (existingByName) {
      return res.status(400).json({ message: "Shop name already exists" });
    }
    const existingByCode = await Shop.findOne({ shopCode });
    if (existingByCode) {
      return res.status(400).json({ message: "Shop code already exists" });
    }

    const newShop = new Shop({
      shopCode,
      name,
      owner: req.user.id, // or some user ID
      brands,
      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
      createdBy: req.user.id, // or username
    });

    await newShop.save();
    res.status(201).json({ message: "Shop created", shop: newShop });
  } catch (error) {
    console.error("Create shop error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateShop = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, brands, lng, lat } = req.body;
    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    if (shop.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update name (check uniqueness)
    if (name && name !== shop.name) {
      const existingByName = await Shop.findOne({ name });
      if (existingByName) {
        return res.status(400).json({ message: "Shop name already exists" });
      }
      shop.name = name;
    }
    if (brands) {
      shop.brands = brands;
    }
    if (lng !== undefined && lat !== undefined) {
      shop.location = {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      };
    }

    await shop.save();
    res.json({ message: "Shop updated", shop });
  } catch (error) {
    console.error("Update shop error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getNearbyShops = async (req, res) => {
  try {
    const { lng, lat, maxDistance = 5000 } = req.query;

    // maxDistance is in meters
    const shops = await Shop.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          distanceField: "dist.calculated",
          maxDistance: parseFloat(maxDistance),
          spherical: true,
        },
      },
    ]);

    res.json(shops);
  } catch (error) {
    console.error("Nearby shops error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getShopsWithPartsInBudget = async (req, res) => {
  try {
    const { minPrice, maxPrice, lng, lat, distance } = req.query;
    // 1) Find shops within 'distance' meters
    const shops = await Shop.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          distanceField: "dist.calculated",
          maxDistance: parseFloat(distance),
          spherical: true,
        },
      },
    ]);

    // 2) For each shop, find parts in [minPrice..maxPrice]
    // or you can do a lookup with $lookup
    // This is a simplified approach:
    for (let shop of shops) {
      const shopParts = await Part.find({
        shop: shop._id,
        price: { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) },
      });
      shop.parts = shopParts;
    }

    res.json(shops);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
