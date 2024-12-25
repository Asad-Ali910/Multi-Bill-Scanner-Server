import {
  extractElectricityBillData,
  extractGasBillData,
} from "../utils/ExtractBillData.js";

const ExtractBillInfo = async (req, res, next) => {
  try {
    const { BarcodeData } = req.body;

    // Validate input
    if (!BarcodeData || typeof BarcodeData !== "string") {
      return res.status(400).json({
        error: "Invalid Input",
        message: "BarcodeData must be a valid string.",
      });
    }

    let billData;

    // Extract bill data based on length
    if (BarcodeData.length === 60) {
      billData = extractElectricityBillData(BarcodeData);
    } else if (BarcodeData.length === 50) {
      billData = extractGasBillData(BarcodeData);
    } else {
      return res.status(400).json({
        code: "Input error",
        error_message: "Bill is Invalid or not Available",
      });
    }

    // Store extracted bill data in request object
    req.billData = billData;

    // Proceed to authorization middleware
    next();
  } catch (error) {
    console.error("Error in ExtractBillInfo:", error);
    return res.status(500).json({
      error: "Server Error",
      message: "An error occurred while processing your request.",
    });
  }
};

export default ExtractBillInfo;
