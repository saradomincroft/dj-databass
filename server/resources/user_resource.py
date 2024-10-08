from flask_restful import Resource, reqparse
from flask import request, session, make_response
import os
import time
from server.models.user import User, db
from server.config import bcrypt
from server.models.dj import Dj

class Signup(Resource):
    def post(self):
        session.pop('user_id', None) # Clear previous session data

        parser = reqparse.RequestParser()
        parser.add_argument('username', required=True, help="Username cannot be blank!")
        parser.add_argument('password', required=True, help="Password cannot be blank!")
        parser.add_argument('is_admin', type=bool, default=False)
        data = parser.parse_args()

        if User.query.filter_by(username=data['username']).first():
            return make_response({"error": "User already exists"}, 400)

        new_user = User(username=data['username'], is_admin=data['is_admin'])
        new_user.hashed_password = data['password']

        db.session.add(new_user)
        db.session.commit()

        session['user_id'] = new_user.id
        return make_response(new_user.to_dict(), 201)

class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        user = User.query.filter_by(username=username).first()

        if not user:
            return make_response({"message": "User not found"}, 404)

        if user and not user.authenticate(password):
            return make_response({"message": "Incorrect password"}, 401)

        session['user_id'] = user.id
        return make_response({"user": user.to_dict()}, 200)


class Logout(Resource):
    def delete(self):
        session.pop('user_id', None)
        return make_response({"message": "Logout successful"}, 200)

class Me(Resource):
    def get(self):
        # Check if user_id is in the session
        user_id = session.get('user_id')
        if not user_id:
            return make_response({"error": "Session expired. Please log in again."}, 403)

        # Fetch the user from the database
        user = User.query.get(user_id)
        if not user:
            # Clear the session if the user is not found
            session.pop('user_id', None)
            return make_response({"error": "User not found"}, 404)

        # Return the user's data
        return make_response(user.to_dict(), 200)

    def patch(self):
        # Check if user_id is in the session
        user_id = session.get('user_id')
        if not user_id:
            return make_response({"error": "Session expired. Please log in again."}, 403)

        # Fetch the user from the database
        user = User.query.get(user_id)
        if not user:
            # Clear the session if the user is not found
            session.pop('user_id', None)
            return make_response({"error": "User not found"}, 404)

        data = request.get_json()

        # Update password if both old and new passwords are provided
        old_password = data.get('oldPassword')
        new_password = data.get('newPassword')
        if old_password and new_password:
            if not user.authenticate(old_password):
                return make_response({"error": "Old password is incorrect."}, 401)

            # Update password
            user.hashed_password = new_password
            db.session.commit()
            return make_response({"message": "Password updated successfully."}, 200)

        # Update username if provided
        username = data.get('username')
        if username:
            username = username.strip()
            if not username:
                return make_response({"error": "Username cannot be blank."}, 400)

            if username == user.username:
                return make_response({"error": "New username is the same as the current username."}, 400)

            # Check if the username already exists for another user
            existing_user = User.query.filter_by(username=username).first()
            if existing_user and existing_user.id != user_id:
                return make_response({"error": "Username already exists."}, 409)

            # Update username
            user.username = username
            db.session.commit()
            return make_response({"message": "Username updated successfully."}, 200)

        # No valid fields to update
        return make_response({"error": "No valid fields to update."}, 400)



class ProfileImage(Resource):
    # Define the path to the public directory
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..',  '..', 'client', 'public', 'user-profiles')

    def __init__(self):
        # Ensure the upload directory exists
        if not os.path.exists(self.UPLOAD_FOLDER):
            os.makedirs(self.UPLOAD_FOLDER)

    def post(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({"error": "Not signed in"}, 403)

        user = User.query.get(user_id)
        if not user:
            return make_response({"error": "User not found"}, 404)

        if 'profileImage' not in request.files:
            return make_response({"error": "No image provided."}, 400)

        file = request.files['profileImage']
        if file.filename == '':
            return make_response({"error": "No selected file."}, 400)

        if not self.allowed_file(file.filename):
            return make_response({"error": "Unsupported file type."}, 400)

        # Save new profile image in 'public/user-profiles' folder
        timestamp = int(time.time())
        filename = f"{user.username}_{timestamp}.jpg"
        file_path = os.path.join(self.UPLOAD_FOLDER, filename)
        file.save(file_path)

        # Remove old profile image if exists
        if user.profile_image_url:
            old_image_path = os.path.join(self.UPLOAD_FOLDER, user.profile_image_url)
            if os.path.exists(old_image_path):
                os.remove(old_image_path)

        # Update user's profile image URL in the database
        user.profile_image_url = filename
        db.session.commit()

        return make_response({"message": "Profile image uploaded successfully."}, 200)
    

    def allowed_file(self, filename):
        ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
    
class DeleteProfileImage(Resource):
    def delete(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({"error": "Not signed in"}, 403)

        user = User.query.get(user_id)
        if not user:
            return make_response({"error": "User not found"}, 404)

        if not user.profile_image_url:
            return make_response({"error": "No profile image to delete."}, 400)

        # Remove old profile image if exists
        old_image_path = os.path.join(ProfileImage.UPLOAD_FOLDER, user.profile_image_url)
        if os.path.exists(old_image_path):
            os.remove(old_image_path)

        # Update user's profile image URL in the database
        user.profile_image_url = None
        db.session.commit()

        return make_response({"message": "Profile image deleted successfully."}, 200)



class Users(Resource):
    def get(self, user_id=None):
        if user_id is None:
            # List all users
            current_user_id = session.get('user_id')
            current_user = User.query.get(current_user_id)
            
            if current_user and current_user.is_admin:
                users = [u.to_dict() for u in User.query.all()]
                return make_response(users, 200)
            return make_response({"error": "Access forbidden"}, 403)
        else:
            # Retrieve a specific user
            user = User.query.get(user_id)
            if user:
                return make_response(user.to_dict(), 200)
            return make_response({"error": "User not found"}, 404)
    
    def delete(self, identifier):
        current_user_id = session.get('user_id')
        current_user = User.query.get(current_user_id)

        # Check if deleting by ID or username
        if identifier.isdigit():
            user_to_delete = User.query.get(int(identifier))
        else:
            user_to_delete = User.query.filter_by(username=identifier).first()

        if not current_user:
            return make_response({'error': 'Current user not found'}, 404)
        
        if not user_to_delete:
            return make_response({'error': 'User not found'}, 404)
        
        # Allow user to delete their own account regardless of admin status
        if current_user.id == user_to_delete.id:
            db.session.delete(user_to_delete)
            db.session.commit()
            return make_response({'message': 'Your account has been deleted successfully'}, 200)
        
        # Allow admin to delete any account including their own, but not other admins
        if current_user.is_admin:
            if user_to_delete.is_admin:
                return make_response({'error': 'Admins cannot delete other admin accounts'}, 403)

            db.session.delete(user_to_delete)
            db.session.commit()
            return make_response({'message': 'User deleted successfully'}, 200)
        
        return make_response({'error': 'You do not have admin access to delete other users'}, 403)

class Favourites(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({"error": "Not signed in"}, 403)

        user = User.query.get(user_id)
        if user:
            favourites = [user.serialize_favourites(dj) for dj in user.favourites]
            return {'favourites': favourites}, 200
        return make_response({"error": "User not found"}, 404)

    def post(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({"error": "Not signed in"}, 403)

        user = User.query.get(user_id)
        if not user:
            return make_response({"error": "User not found"}, 404)

        data = request.get_json()
        dj_id = data.get('dj_id')
        
        if not dj_id:
            return make_response({"error": "DJ ID is required"}, 400)

        dj = Dj.query.get(dj_id)
        if not dj:
            return make_response({"error": "DJ not found"}, 404)

        if dj in user.favourites:
            return make_response({"message": "DJ is already in favourites"}, 400)

        user.favourites.append(dj)
        db.session.commit()

        return make_response({"message": "DJ added to favourites"}, 200)

    def delete(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({"error": "Not signed in"}, 403)

        user = User.query.get(user_id)
        if not user:
            return make_response({"error": "User not found"}, 404)

        data = request.get_json()
        dj_id = data.get('dj_id')

        if not dj_id:
            return make_response({"error": "DJ ID is required"}, 400)

        dj = Dj.query.get(dj_id)
        if not dj:
            return make_response({"error": "DJ not found"}, 404)

        if dj not in user.favourites:
            return make_response({"error": "DJ is not in favourites"}, 400)

        user.favourites.remove(dj)
        db.session.commit()

        return make_response({"message": "DJ removed from favourites"}, 200)
