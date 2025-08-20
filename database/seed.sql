-- Sample data for testing (optional)
INSERT INTO predictions (
    user_uuid, 
    name, 
    date_of_birth, 
    place_of_birth, 
    current_job, 
    body_count, 
    is_perfume_used, 
    has_iphone, 
    has_bike, 
    predicted_age
) VALUES 
(
    gen_random_uuid(),
    'John Doe',
    '1995-06-15',
    'New York',
    'Software Engineer',
    2,
    true,
    true,
    false,
    28
),
(
    gen_random_uuid(),
    'Jane Smith',
    '1992-03-22',
    'Los Angeles',
    'Designer',
    1,
    true,
    true,
    true,
    26
) ON CONFLICT (user_uuid) DO NOTHING;
