import { extractBillData } from "../utils/ExtractBillData.js";

const DecodeImage = async (req, res) => {
  const { BarcodeData } = req.body;

  let billData;

  if (BarcodeData.length == 60) {
    billData = extractBillData(BarcodeData);
    res.json({
      billData,
    });

    return
  }

  res.json({
    Error: "not valid",
    message: "Invalid Input",
  })
};

export default DecodeImage;
