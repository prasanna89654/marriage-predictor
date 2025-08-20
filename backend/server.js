const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://neondb_owner:npg_cpOQrmBD48kM@ep-proud-salad-a149njzg-pooler.ap-southeast-1.aws.neon.tech/neondb",
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log("Connected to PostgreSQL database");
    release();
  }
});

// Marriage age prediction algorithm
function predictMarriageAge(userData) {
  const {
    date_of_birth,
    current_job,
    body_count,
    is_perfume_used,
    has_iphone,
    has_bike,
  } = userData;

  // Calculate current age
  const birthDate = new Date(date_of_birth);
  const currentAge = new Date().getFullYear() - birthDate.getFullYear();

  // Base prediction starts with current age + random factor
  let predictedAge = currentAge + Math.floor(Math.random() * 8) + 2;

  // Job factor
  const jobFactors = {
    "software engineer": -2,
    doctor: -1,
    teacher: 0,
    artist: 1,
    entrepreneur: -1,
    student: 3,
    unemployed: 4,
  };

  const jobKey = current_job.toLowerCase();
  predictedAge += jobFactors[jobKey] || 0;

  // Body count factor (higher count = later marriage)
  if (body_count > 5) predictedAge += 3;
  else if (body_count > 2) predictedAge += 1;
  else if (body_count === 0) predictedAge -= 1;

  // Lifestyle factors
  if (is_perfume_used) predictedAge -= 1; // Takes care of appearance
  if (has_iphone) predictedAge -= 1; // Financially stable
  if (has_bike) predictedAge += 1; // Still young at heart

  // Ensure reasonable age range (18-45)
  predictedAge = Math.max(18, Math.min(45, predictedAge));

  return predictedAge;
}

// Routes

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Marriage Predictor API is running" });
});

// Get all predictions
app.get("/api/predictions", async (req, res) => {
  try {
    const query = `
      SELECT 
        name, 
        date_of_birth, 
        place_of_birth, 
        current_job, 
        predicted_age, 
        created_at 
      FROM predictions 
      ORDER BY created_at DESC 
      LIMIT 50
    `;

    const result = await pool.query(query);
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching predictions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch predictions",
    });
  }
});

// Create new prediction
app.post("/api/predict", async (req, res) => {
  try {
    const {
      name,
      date_of_birth,
      place_of_birth,
      current_job,
      body_count,
      is_perfume_used,
      has_iphone,
      has_bike,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !date_of_birth ||
      !place_of_birth ||
      !current_job ||
      body_count === undefined ||
      is_perfume_used === undefined ||
      has_iphone === undefined ||
      has_bike === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Generate UUID based on name (same name gets same UUID)
    const userUuid = uuidv4();

    // Predict marriage age
    const predictedAge = predictMarriageAge(req.body);

    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT * FROM predictions WHERE name = $1",
      [name]
    );

    let result;
    if (existingUser.rows.length > 0) {
      // Update existing prediction
      result = await pool.query(
        `
        UPDATE predictions 
        SET 
          date_of_birth = $2,
          place_of_birth = $3,
          current_job = $4,
          body_count = $5,
          is_perfume_used = $6,
          has_iphone = $7,
          has_bike = $8,
          predicted_age = $9,
          updated_at = CURRENT_TIMESTAMP
        WHERE name = $1
        RETURNING *
      `,
        [
          name,
          date_of_birth,
          place_of_birth,
          current_job,
          body_count,
          is_perfume_used,
          has_iphone,
          has_bike,
          predictedAge,
        ]
      );
    } else {
      // Insert new prediction
      result = await pool.query(
        `
        INSERT INTO predictions (
          user_uuid, name, date_of_birth, place_of_birth, current_job,
          body_count, is_perfume_used, has_iphone, has_bike, predicted_age
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `,
        [
          userUuid,
          name,
          date_of_birth,
          place_of_birth,
          current_job,
          body_count,
          is_perfume_used,
          has_iphone,
          has_bike,
          predictedAge,
        ]
      );
    }

    res.json({
      success: true,
      data: {
        predicted_age: predictedAge,
        user_data: result.rows[0],
      },
    });
  } catch (error) {
    console.error("Error creating prediction:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create prediction",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
