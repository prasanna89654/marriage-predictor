const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://neondb_owner:npg_cpOQrmBD48kM@ep-proud-salad-a149njzg-pooler.ap-southeast-1.aws.neon.tech/neondb",
  ssl: {
    rejectUnauthorized: false,
  },
});

async function initializeDatabase() {
  try {
    console.log("Initializing database...");

    // Create the predictions table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS predictions (
          id SERIAL PRIMARY KEY,
          user_uuid UUID UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          date_of_birth DATE NOT NULL,
          place_of_birth VARCHAR(255) NOT NULL,
          current_job VARCHAR(255) NOT NULL,
          body_count INTEGER NOT NULL,
          is_perfume_used BOOLEAN NOT NULL,
          has_iphone BOOLEAN NOT NULL,
          has_bike BOOLEAN NOT NULL,
          predicted_age INTEGER NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(createTableQuery);
    console.log("✅ Predictions table created successfully");

    // Create indexes
    const createIndexes = [
      `CREATE INDEX IF NOT EXISTS idx_predictions_user_uuid ON predictions(user_uuid);`,
      `CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at DESC);`,
    ];

    for (const indexQuery of createIndexes) {
      await pool.query(indexQuery);
    }
    console.log("✅ Indexes created successfully");

    // Check if table exists and has expected structure
    const checkTable = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'predictions'
      ORDER BY ordinal_position;
    `);

    console.log("✅ Table structure:");
    checkTable.rows.forEach((row) => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });

    console.log("🎉 Database initialization completed successfully!");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
  } finally {
    await pool.end();
  }
}

initializeDatabase();
