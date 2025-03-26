import Part from "../models/Part.js";
import Shop from "../models/Shop.js";

export const createPart = async (req, res) => {
  try {
    const { code, name, brandName, shopName, quantity, mfd } = req.body;
    // find shop by name (or by ID if your front-end uses IDs)
    const shop = await Shop.findOne({ name: shopName });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    // Check if user is shop owner
    if (shop.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Check code uniqueness
    const existingPart = await Part.findOne({ code });
    if (existingPart) {
      return res.status(400).json({ message: "Part code already exists" });
    }

    // Optionally check if brandName is in shop.brands
    if (!shop.brands.includes(brandName)) {
      return res
        .status(400)
        .json({ message: "Brand not registered in this shop" });
    }

    const newPart = new Part({
      code,
      name,
      brandName,
      shop: shop._id,
      quantity,
      mfd,
      createdBy: req.user.id,
    });
    await newPart.save();

    res.status(201).json({ message: "Part created", part: newPart });
  } catch (error) {
    console.error("Create part error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPartsByShopOwner = async (req, res) => {
  try {
    // 1) find shops owned by user
    const shops = await Shop.find({ owner: req.user.id });
    if (!shops || shops.length === 0) {
      return res.json({ parts: [], shops: [] });
    }
    // 2) get parts for these shops
    const shopIds = shops.map((s) => s._id);
    const parts = await Part.find({ shop: { $in: shopIds } }).populate("shop");
    res.json({ parts, shops });
  } catch (error) {
    console.error("Get parts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePart = async (req, res) => {
  try {
    const { id } = req.params; // part ID
    const { name, brandName, shopName, quantity, mfd } = req.body;

    const part = await Part.findById(id).populate("shop");
    if (!part) {
      return res.status(404).json({ message: "Part not found" });
    }
    // Check shop owner
    if (part.shop.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // code is uneditable, so we do not update part.code
    if (name) part.name = name;
    if (brandName) {
      // optional brand check
      if (!part.shop.brands.includes(brandName)) {
        return res
          .status(400)
          .json({ message: "Brand not registered in this shop" });
      }
      part.brandName = brandName;
    }
    if (shopName && shopName !== part.shop.name) {
      // find new shop by name
      const newShop = await Shop.findOne({ name: shopName });
      if (!newShop)
        return res.status(404).json({ message: "New shop not found" });
      if (newShop.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized for new shop" });
      }
      part.shop = newShop._id;
    }
    if (quantity !== undefined) part.quantity = quantity;
    if (mfd) part.mfd = mfd;

    await part.save();
    res.json({ message: "Part updated", part });
  } catch (error) {
    console.error("Update part error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePart = async (req, res) => {
  try {
    const { id } = req.params;
    const part = await Part.findById(id).populate("shop");
    if (!part) {
      return res.status(404).json({ message: "Part not found" });
    }
    // Check shop owner
    if (part.shop.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await part.remove();
    res.json({ message: "Part deleted" });
  } catch (error) {
    console.error("Delete part error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
