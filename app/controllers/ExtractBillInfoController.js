import {
  extractElectricityBillData,
  extractGasBillData,
} from "../utils/ExtractBillData.js";

const ExtractBillInfo = async (req, res) => {
  try {
    const { BarcodeData } = req.body;

    // Validate input
    if (!BarcodeData || typeof BarcodeData !== "string") {
      return res.status(400).json({
        error: "Invalid Input",
        message: "BarcodeData must be a valid string.",
      });
    }

    // Check the length of BarcodeData
    if (BarcodeData.length === 60) {
      const billData = extractElectricityBillData(BarcodeData);
      // Debug extracted data
      return res.status(200).json({ billData });
    }

    if (BarcodeData.length === 50) {
      const billData = extractGasBillData(BarcodeData);
      return res.status(200).json({ billData });
    }

    // Invalid length
    return res.status(400).json({
      code: "Input error",
      error_message: "Bill is Invalid or not Available",
    });
  } catch (error) {
    console.error("Error in ExtractBillInfo:", error);
    return res.status(500).json({
      error: "Server Error",
      message: "An error occurred while processing your request.",
    });
  }
};

export default ExtractBillInfo;
