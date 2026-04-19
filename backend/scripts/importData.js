import fs from "fs";
import csv from "csv-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import NgoEmployee from "../models/ngoEmployee.models.js";

dotenv.config();

await mongoose.connect(process.env.MONGODB_URL);
console.log("MongoDB Connected");

const results = [];

fs.createReadStream("./data/ngo_employees_amaravati.csv")
  .pipe(csv())
  .on("data", (row) => {

    const gender = row.gender === "M" ? "Male" : "Female";

    const skills = row.skills.split(",").map(s => s.trim());

    const category = row.category.split(",").map(c => c.trim());

    const employee = {
      empId: row.empId,
      name: row.name,
      age: Number(row.age),
      gender,
      phone: row.phone,
      skills,
      category,

      location: {
        type: "Point",
        coordinates: [
          Number(row.longitude),
          Number(row.latitude)
        ]
      },

      availability: row.availability,
    };

    results.push(employee);
  })
  .on("end", async () => {
    try {
      await NgoEmployee.deleteMany();
      await NgoEmployee.insertMany(results);

      console.log("importing data successful");
      await mongoose.connection.close(); 
      process.exit();

    } catch (error) {
      console.error("Error during inserting data", error);
      process.exit(1);
    }
  });