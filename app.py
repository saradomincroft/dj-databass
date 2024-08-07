from server.config import app
from server.routes import register_routes
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Register routes
register_routes(app)

if __name__ == "__main__":
    app.run(debug=True, port=4000)
