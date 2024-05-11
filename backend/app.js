const express = require("express");
const connectDB = require("./db");
const authRoutes = require("../backend/routes/auth");
const userRoutes = require("../backend/routes/user");
const contactRoutes = require("../backend/routes/contact");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Parse JSON request body
app.use(express.json());

// Define authentication routes
app.use("/auth", authRoutes);

// Define user routes
app.use("/user", userRoutes);

// Define contact routes
app.use("/contact", contactRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
