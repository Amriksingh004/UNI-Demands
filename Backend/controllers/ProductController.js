import ProductModel from "../models/Product.js";
import fs from 'fs'
export const GetProducts = async (req, res) => {
  try {
    const productData = await ProductModel.find({department:req.params.departmentId}).populate({
      path:"department",
      populate:{
        path:"university"
      }
    });
    if (productData) res.status(200).send(productData);
    else res.status(404).send({ message: "Data not Found" });
  } catch (error) {
    console.log(error);
  }
};

export const CreateProduct = async (req, res) => {
  try {
    let images = req?.files?.map((item)=>{
        return item.filename
    })
    const productData = await ProductModel.create({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      department: req.body.departmentId,
      images: images,
      quantity: req.body.quantity,
    });
    if (productData)
      res.status(201).send({ message: "Product created successfully" });
    else res.status(404).send({ message: "Something went wrong" });
  } catch (error) {
    console.log(error);
  }
};

export const UpdateProduct = async (req, res) => {
    try {
        const productInDb = await ProductModel.findById(req.body.id);
        if (!productInDb) {
            res.status(404).send({ message: "Product not found" });
            return;
        }

        let updateFields = {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            quantity: req.body.quantity,
            department: req.body.departmentId,
        };

        if (req.files && req.files.length > 0) { // Only update images if new files are provided
            let newImages = req.files.map((item) => item.filename);

            // Identify images to delete from disk (old images not present in the new set)
            let imagesNeedToDelete = productInDb.images.filter((item) => {
                return !newImages.includes(item);
            });

            // Delete old images from disk
            imagesNeedToDelete.forEach((item) => {
                const filePath = `public/productImg/${item}`;
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });

            updateFields.images = newImages; // Update images array in DB
        } else if (req.body.images === null || req.body.images === "") {
            // This case handles explicit clearing of images (e.g., if frontend sends null/empty string for images)
            // If you want to allow clearing all images by sending an empty array or specific indicator
            // This part might need adjustment based on how your frontend handles image removal
            productInDb.images.forEach((item) => {
                const filePath = `public/productImg/${item}`;
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
            updateFields.images = [];
        }


        const productData = await ProductModel.findByIdAndUpdate(req.body.id, updateFields, { new: true }); // { new: true } returns the updated document

        if (productData)
            res.status(200).send({ message: "Product updated successfully" }); // Changed status to 200 for successful update
        else res.status(404).send({ message: "Something went wrong" });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal server error" }); // Added error response for debugging
    }
};

export const DeleteProduct = async (req, res) => {
  try {
    const productInDb = await ProductModel.findById(req.params.id);
    productInDb.images.forEach((item) => {
      const filePath = `public/productImg/${item}`;
      console.log(`Deleted file: ${filePath}`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    );
    const productData = await ProductModel.findByIdAndDelete(req.params.id);
    if (productData)
      res.status(200).send({ message: "Product deleted successfully"});
    else res.status(404).send({ message: "Something went wrong" });
  } catch (error) {
    console.log(error);
  }
};

export const GetProductDetails = async (req, res) => {
  try {
    const productData = await ProductModel.findById(req.params.id).populate({
      path: "department",
      populate: {
        path: "university",
      },
    });
    if (productData) res.status(200).send(productData);
    else res.status(404).send({ message: "Data not Found" });
  } catch (error) {
    console.log(error);
  }
};
export const UpdateProductQty = async (req, res) => {
  try {
    const productInDb = await ProductModel.findById(req.body.productId);
    if (!productInDb) {
      res.status(404).send({ message: "Product not found" });
      return;
    }
    console.log(productInDb.quantity);
    console.log(req.body.quantity);
    let active = true;
    if (productInDb.quantity - req.body.quantity <= 0) {
      active = false;
    }
    const productData = await ProductModel.findByIdAndUpdate(req.body.productId, {
      quantity: productInDb.quantity - req.body.quantity,
      active: active,
    });
    //await productInDb.save();

    if (productData) res.status(200).send({ message: "Quantity updated successfully" });
    else res.status(404).send({ message: "Something went wrong" });

  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "Internal server error" });
  }
};
 