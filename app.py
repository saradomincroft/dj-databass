from flask import Flask, send_from_directory
from server.config import app
from server.routes import register_routes
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Register routes
register_routes(app)

@app.route('/user-profiles/<filename>')
def serve_profile_image(filename):
    return send_from_directory('public/user-profiles', filename)


if __name__ == "__main__":
    app.run(debug=True, port=4000)
