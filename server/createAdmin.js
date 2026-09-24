require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Auth = require("./src/modules/auth/auth.model");

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected");

        const email = "admin@bookmyworker.com";
        const password = "Admin@123456";

        const existingAdmin = await Auth.findOne({ email });

        if (existingAdmin) {
            existingAdmin.name = "BookMyWorker Admin";
            existingAdmin.password = await bcrypt.hash(password, 10);
            existingAdmin.role = "admin";
            await existingAdmin.save();

            console.log("Admin password reset successfully");
            console.log("Email:", existingAdmin.email);
            console.log("Role:", existingAdmin.role);
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await Auth.create({
            name: "BookMyWorker Admin",
            email,
            password: hashedPassword,
            role: "admin",
        });

        console.log("Admin created successfully");
        console.log("Email:", admin.email);
        console.log("Role:", admin.role);

        process.exit(0);
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
};

createAdmin();