-- Marriage Age Prediction Database Schema

-- Create the predictions table to store user data and predictions
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

-- Create index on user_uuid for faster lookups
CREATE INDEX IF NOT EXISTS idx_predictions_user_uuid ON predictions(user_uuid);

-- Create index on created_at for sorting recent predictions
CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at DESC);
