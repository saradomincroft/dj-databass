from flask_restful import Resource, reqparse
from flask import request, session, make_response
from werkzeug.utils import secure_filename
import os
from server.models.user import User, db
from server.config import bcrypt, UPLOAD_FOLDER

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

        print(f"Login attempt: username={username}, password={password}")

        user = User.query.filter_by(username=username).first()
        if user:
            print(f"User found: {user.username}, Hashed password: {user.hashed_password}")
            if user.authenticate(password):
                session['user_id'] = user.id
                print(f"Login successful, user_id set to {user.id}")
                return make_response({"user": user.to_dict()}, 200)
            else:
                print("Password mismatch")
        else:
            print("User not found")

        return make_response({"error": "Unauthorized"}, 403)


class Logout(Resource):
    def delete(self):
        session.pop('user_id', None)
        return make_response({"message": "Logout successful"}, 200)


class Me(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            user = User.query.get(user_id)
            if user:
                return make_response(user.to_dict(), 200)
        return make_response({"error": "Not signed in"}, 403)
    
    def patch(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({"error": "Not signed in"}, 403)
        
        user = User.query.get(user_id)
        if not user:
            return make_response({"error": "User not found"}, 404)
        
        data = request.get_json()

        old_password = data.get('oldPassword')
        new_password = data.get('newPassword')
        username = data.get('username')

        # Handle password update
        if old_password and new_password:
            if not user.authenticate(old_password):
                return make_response({"error": "Old password is incorrect."}, 401)
            
            # Update the password
            user.hashed_password = new_password
            db.session.commit()
            return make_response({"message": "Password updated successfully."}, 200)
        
        # Handle username update
        if username:
            if not username.strip():
                return make_response({"error": "Username cannot be blank."}, 400)
            
            if username == user.username:
                return make_response({"error": "New username is the same as the current username."}, 400)
            
            existing_user = User.query.filter_by(username=username).first()
            if existing_user:
                # Check that the existing username does not belong to the current user
                if existing_user.id != user_id:
                    return make_response({"error": "Username already exists."}, 409)
            
            user.username = username
            db.session.commit()
            return make_response({"message": "Username updated successfully."}, 200)

        return make_response({"error": "No valid fields to update."}, 400)


    
    def post(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({"error": "Not signed in"}, 403)

        user = User.query.get(user_id)
        if not user:
            return make_response({"error": "User not found"}, 404)

        # Upload profile image
        if 'profileImage' in request.files:
            file = request.files['profileImage']
            if file.filename == '':
                return make_response({"error": "No selected file."}, 400)

            if file and self.allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file_path = os.path.join(UPLOAD_FOLDER, filename)
                file.save(file_path)

                # Update user's profile image URL
                user.profile_image_url = file_path
                db.session.commit()

                return make_response({"message": "Profile image uploaded successfully."}, 200)

        return make_response({"error": "No image provided."}, 400)

    def delete(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({"error": "Not signed in"}, 403)

        user = User.query.get(user_id)
        if not user:
            return make_response({"error": "User not found"}, 404)

        # Handle profile image deletion logic
        if user.profile_image_url:
            try:
                os.remove(user.profile_image_url)  # Remove the image file
                user.profile_image_url = None  # Clear the profile image URL
                db.session.commit()

                return make_response({"message": "Profile image deleted successfully."}, 200)
            except Exception as e:
                return make_response({"error": f"Failed to delete profile image: {str(e)}"}, 500)

        return make_response({"error": "No profile image to delete."}, 400)

    @staticmethod
    def allowed_file(filename):
        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions


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
    

