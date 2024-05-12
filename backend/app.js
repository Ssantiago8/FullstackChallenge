const express = require("express");
const connectDB = require("./db");
const authRoutes = require("../backend/routes/auth");
const userRoutes = require("../backend/routes/user");
const contactRoutes = require("../backend/routes/contact");
const cookieParser = require("cookie-parser");

const cors = require("cors"); // Agregar cors

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Parse JSON request body
app.use(express.json());

// Agregar configuración de CORS
app.use(cors());

// Parse cookies
app.use(cookieParser());

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
