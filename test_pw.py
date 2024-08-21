from server.config import bcrypt

# Test password hashing
password = 'test_password'
hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
print(f"Hashed password: {hashed_password}")

# Verify the hashed password
is_valid = bcrypt.check_password_hash(hashed_password, password)
print(f"Password valid: {is_valid}")
