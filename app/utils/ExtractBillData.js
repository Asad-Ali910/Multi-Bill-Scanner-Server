export const extractElectricityBillData = (data) => {
  const date = new Date();
  // Extract reference number (from index 1 to 15)
  const referenceNumber = data.substring(1, 15); // 15 characters long

  let firstDate = data.substring(19, 25);
  firstDate = convertToMilliseconds(firstDate);
  let secondDate = data.substring(43, 49);
  secondDate = convertToMilliseconds(secondDate);

  let curentDate = getCurrentDateInDDMMYY();
  curentDate = convertToMilliseconds(curentDate);

  let panalty;

  if (secondDate < curentDate) {
    panalty = 2;
  } else if (firstDate < curentDate) {
    panalty = 1;
  } else {
    panalty = 0;
  }

  let Panalty_0_amount = Number(data.substring(25, 34));
  let Panalty_1_amount = Number(data.substring(49, 58));
  let Panalty_2_amount = Number(data.substring(34, 43));

  return {
    inputType: "Scanned",
    scannedString: data,
    ref: referenceNumber,
    Panalty_0_amount: Panalty_0_amount,
    Panalty_1_amount: Panalty_1_amount,
    Panalty_2_amount: Panalty_2_amount,
    max_Panalty: 2,
    panalty: panalty,
  };
};

export const extractGasBillData = (gasBill) => {
  const referenceNumber = gasBill.substring(5, 16);

  let firstDate = gasBill.substring(26, 32);
  firstDate = convertToMilliseconds();

  let curentDate = getCurrentDateInDDMMYY();
  curentDate = convertToMilliseconds();

  let panalty;

  if (firstDate < curentDate) {
    panalty = 1;
  } else {
    panalty = 0;
  }

  let Panalty_0_amount = Number(gasBill.substring(32, 42));
  let Panalty_1_amount =
    Number(gasBill.substring(32, 42)) + Number(gasBill.substring(42, 48));

  return {
    inputType: "Scanned",
    scannedString: gasBill,
    ref: referenceNumber,
    Panalty_0_amount: Panalty_0_amount,
    Panalty_1_amount: Panalty_1_amount,
    max_Panalty: 1,
    panalty: panalty,
  };
};

const convertToMilliseconds = (dateString) => {
  // Extract day, month, and year
  const day = parseInt(dateString.substring(0, 2), 10); // Day: 30
  const month = parseInt(dateString.substring(2, 4), 10) - 1; // Month: 10 (October, zero-based index)
  const year = 2000 + parseInt(dateString.substring(4, 6), 10); // Year: 2024

  // Create a Date object
  const date = new Date(year, month, day);

  // Return milliseconds since Unix epoch
  return date.getTime();
};

const getCurrentDateInDDMMYY = () => {
  const date = new Date();

  // Get the day, month, and year in the correct format
  const day = String(date.getDate()).padStart(2, "0"); // Ensure 2 digits
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits, zero-based month
  const year = String(date.getFullYear()).slice(-2); // Last 2 digits of the year

  // Concatenate to format DDMMYY
  return `${day}${month}${year}`;
};
