from flask_restful import Resource, reqparse
from flask import request, session, make_response
from ..models.user import User, db

class Signup(Resource):
    def post(self):
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
        if user and user.authenticate(password):
            session['user_id'] = user.id
            return make_response(f'Welcome {user.to_dict()}', 200)
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

class Users(Resource):
    def get(self):
        user_id = session.get('user_id')
        user = User.query.get(user_id)
        if user and user.is_admin:
            users = [u.to_dict() for u in User.query.all()]
            return make_response(users, 200)
        return make_response({"error": "Access forbidden"}, 403)
    
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
    

