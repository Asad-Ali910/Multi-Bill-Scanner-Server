import fs from "fs";
import path from "path";

// Define the file path for temporary users
const tempUserFilePath = path.resolve("./tempUsers.json");

// Ensure the file exists and initialize it if not
if (!fs.existsSync(tempUserFilePath)) {
  fs.writeFileSync(tempUserFilePath, JSON.stringify([]));
}

export const createTempUser = (userInfo) => {
  const tempUsers = JSON.parse(fs.readFileSync(tempUserFilePath, "utf8"));
  tempUsers.push(userInfo);
  fs.writeFileSync(tempUserFilePath, JSON.stringify(tempUsers, null, 2));
};

export const findTempUser = (email, otp = null) => {
  const tempUsers = JSON.parse(fs.readFileSync(tempUserFilePath, "utf8"));
  return tempUsers.find(
    (user) => user.email === email && (otp === null || user.otp === otp)
  ) || null;
};

export const deleteTempUser = (email, otp = null) => {
  const tempUsers = JSON.parse(fs.readFileSync(tempUserFilePath, "utf8"));
  const initialLength = tempUsers.length;
  const updatedUsers = tempUsers.filter(
    (user) => !(user.email === email && (otp === null || user.otp === otp))
  );

  fs.writeFileSync(tempUserFilePath, JSON.stringify(updatedUsers, null, 2));
  return updatedUsers.length < initialLength;
};
