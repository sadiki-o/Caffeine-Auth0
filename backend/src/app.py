import os
from flask import Flask, request, jsonify, abort, render_template, session, redirect, url_for
from sqlalchemy import exc
from flask_cors import CORS
from sys import exc_info
import json
from .vars import AUTH0_DOMAIN, API_CLIENT_ID, API_SECRET_KEY

from .database.models import db_drop_and_create_all, setup_db, Drink, db
from .auth.auth import AuthError, requires_auth
import requests


app = Flask(__name__)
setup_db(app)
CORS(app)


def get_api_token() -> str:
    payload = F"grant_type=client_credentials&client_id={API_CLIENT_ID}&client_secret={API_SECRET_KEY}&audience={AUTH0_DOMAIN}/api/v2/"

    headers = {'content-type': "application/x-www-form-urlencoded"}
    
    res = requests.post(F"{AUTH0_DOMAIN}/oauth/token", data=payload, headers=headers)

    return res.json()["access_token"]

#DELETE USER (manager, baristas) for admin only
@app.route('/users/<string:user_id>', methods=['DELETE'])
@requires_auth('delete:users')
def delete_user(payload, user_id):
    try:
        api_token = get_api_token()

        headers = {'authorization': F"Bearer {api_token}"}

        res = requests.delete(F"{AUTH0_DOMAIN}/api/v2/users/{user_id}", headers=headers)

        if res.status_code == 204:
            return jsonify({
                'success': True,
            }), 200
    except:
        print(exc_info())
        abort(500)

#BLOCK USER (manager, baristas) for admin only
@app.route('/users/<string:user_id>/block', methods=['PATCH'])
@requires_auth('block-unblock:users')
def block_user(payload, user_id):
    try:
        api_token = get_api_token()

        headers = {'authorization': F"Bearer {api_token}"}

        #patch user blocked state
        data = {"blocked": True}
        res = requests.patch(F"{AUTH0_DOMAIN}/api/v2/users/{user_id}", json=data, headers=headers)

        if res.ok:
            return jsonify({
                'success': True,
            }), res.status_code
        else:
            return jsonify({
                'success': False,
            }), res.status_code

    except:
        print(exc_info())
        abort(500)

#UNBLOCK USER (manager, baristas) for admin only
@app.route('/users/<string:user_id>/unblock', methods=['PATCH'])
@requires_auth('block-unblock:users')
def unblock_user(payload, user_id):
    try:
        api_token = get_api_token()

        headers = {'authorization': F"Bearer {api_token}"}
    
        #patch user blocked state
        data = {"blocked": False}
        res = requests.patch(F"{AUTH0_DOMAIN}/api/v2/users/{user_id}", json=data, headers=headers)

        if res.ok:
            return jsonify({
                'success': True,
            }), res.status_code
        else:
            return jsonify({
                'success': False,
            }), res.status_code
    except:
        print(exc_info())
        abort(500)



''' MANAGE BARISTAS for managers'''
@app.route('/baristas', methods=['GET'])
@requires_auth('crud:baristas')
def get_baristas(payload):
    try:
        api_token = get_api_token()
        print(api_token)

        headers = {'authorization': F"Bearer {api_token}"}

        blocked_users = requests.get(F"{AUTH0_DOMAIN}/api/v2/users?q=blocked%3Dtrue", headers=headers)

        res = requests.get(F"{AUTH0_DOMAIN}/api/v2/roles/rol_aAB8xVF3ZLdh488F/users", headers=headers)

        if res.ok:
            users_with_blocked = []
            for user in res.json():
                for blocked_user in blocked_users.json():
                    if user["user_id"] == blocked_user["user_id"]:
                        users_with_blocked.append({
                            **user,
                            "blocked": True
                        })
                        break

                else:    
                    users_with_blocked.append({
                        **user,
                        "blocked": False
                    })

            return jsonify({
                'success': True,
                'baristas': users_with_blocked
            }), res.status_code
        else:
            return jsonify({
                'success': False,
            }), res.status_code
        
    except:
        print(exc_info())
        abort(500)

# block baristas
@app.route('/baristas/<string:baristas_id>/block', methods=['PATCH'])
@requires_auth('crud:baristas')
def block_baristas(payload, baristas_id):
    try:
        api_token = get_api_token()

        headers = {'authorization': F"Bearer {api_token}"}

        #verify user role
        request = requests.get(F"{AUTH0_DOMAIN}/api/v2/users/{baristas_id}/roles", headers=headers)
        if request.status_code == 200 and request.json()[0]["name"] == "barista":
            #patch user blocked state
            data = {"blocked": True}
            res = requests.patch(F"{AUTH0_DOMAIN}/api/v2/users/{baristas_id}", json=data, headers=headers)

            if res.ok:
                return jsonify({
                    'success': True,
                }), res.status_code
            else:
                return jsonify({
                    'success': False,
                }), res.status_code
        else:
            return jsonify({
                "success": False,
                }), request.status_code

    except:
        print(exc_info())
        abort(500)

# unblock baristas
@app.route('/baristas/<string:barista_id>/unblock', methods=['PATCH'])
@requires_auth('crud:baristas')
def unblock_baristas(payload, barista_id):
    try:
        api_token = get_api_token()

        headers = {'authorization': F"Bearer {api_token}"}
    
        #verify user role
        request = requests.get(F"{AUTH0_DOMAIN}/api/v2/users/{barista_id}/roles", headers=headers)
        if request.status_code == 200 and request.json()[0]["name"] == "barista":
            #patch user blocked state
            data = {"blocked": False}
            res = requests.patch(F"{AUTH0_DOMAIN}/api/v2/users/{barista_id}", json=data, headers=headers)

            if res.ok:
                return jsonify({
                    'success': True,
                }), res.status_code
            else:
                return jsonify({
                    'success': False,
                }), res.status_code
        else:
            return jsonify({
                "success": False,
                }), request.status_code
    except:
        print(exc_info())
        abort(500)


#MANAGERS
@app.route('/managers', methods=['GET'])
@requires_auth('crud:managers')
def get_managers(payload):
    try:
        api_token = get_api_token()

        headers = {'authorization': F"Bearer {api_token}"}

        blocked_users = requests.get(F"{AUTH0_DOMAIN}/api/v2/users?q=blocked%3Dtrue", headers=headers)
        
        res = requests.get(F"{AUTH0_DOMAIN}/api/v2/roles/rol_kV9BAPrkD8vi2jn6/users", headers=headers)

        if res.ok:
            users_with_blocked = []
            for user in res.json():
                for blocked_user in blocked_users.json():
                    if user["user_id"] == blocked_user["user_id"]:
                        users_with_blocked.append({
                            **user,
                            "blocked": True
                        })
                        break

                else:    
                    users_with_blocked.append({
                        **user,
                        "blocked": False
                    })

            return jsonify({
                'success': True,
                'managers': users_with_blocked
            }), res.status_code
        else:
            return jsonify({
                'success': False,
            }), res.status_code
    except:
        print(exc_info())
        abort(500)

# block manager
@app.route('/managers/<string:manager_id>/block', methods=['PATCH'])
@requires_auth('crud:managers')
def block_manager(payload, manager_id):
    try:
        api_token = get_api_token()

        headers = {'Authorization': F"Bearer {api_token}"}

        #verify user role
        request = requests.get(F"{AUTH0_DOMAIN}/api/v2/users/{manager_id}/roles", headers=headers)

        if request.status_code == 200 and request.json()[0]["name"] == "manager":
            #patch user blocked state
            data = {"blocked": True}
            res = requests.patch(F"{AUTH0_DOMAIN}/api/v2/users/{manager_id}", json=data, headers=headers)

            if res.ok:
                return jsonify({
                    'success': True,
                }), res.status_code
            else:
                return jsonify({
                    'success': False,
                }), res.status_code
        else:
            return jsonify({
                "success": False,
                }), request.status_code

    except:
        print(exc_info())
        abort(500)

# unblock manager
@app.route('/managers/<string:manager_id>/unblock', methods=['PATCH'])
@requires_auth('crud:managers')
def unblock_manager(payload, manager_id):
    try:
        api_token = get_api_token()

        headers = {'authorization': F"Bearer {api_token}"}
    
        #verify user role
        request = requests.get(F"{AUTH0_DOMAIN}/api/v2/users/{manager_id}/roles", headers=headers)
        if request.status_code == 200 and request.json()[0]["name"] == "manager":
            #patch user blocked state
            data = {"blocked": False}
            res = requests.patch(F"{AUTH0_DOMAIN}/api/v2/users/{manager_id}", json=data, headers=headers)

            if res.ok:
                return jsonify({
                    'success': True,
                }), res.status_code
            else:
                return jsonify({
                    'success': False,
                }), res.status_code
        else:
            return jsonify({
                "success": False,
                }), request.status_code
    except:
        print(exc_info())
        abort(500)



# get all drinks
@app.route('/drinks')
def get_drinks():
    try:
        drinks = Drink.query.all()

        drinks_short = [drink.short() for drink in drinks]

        return jsonify({
            'success': True,
            'drinks': drinks_short
        })
    except:
        print(exc_info())
        abort(500)


# get drinks details
@app.route('/drinks-detail', methods=['GET'])
@requires_auth('read:detailedDrinks')
def get_drinks_detail(payload):
    drinks = Drink.query.all()

    drinks_long = [drink.long() for drink in drinks]

    return jsonify({
        'success': True,
        'drinks': drinks_long
    })


# insert drink
@app.route('/drinks', methods=['POST'])
@requires_auth('crud:globalMenu')
def create_drink(payload):
    body = request.get_json()

    try:
        title = body['title']
        recipe = body['recipe']

        drink = Drink(title=title, recipe=recipe)
        drink.insert()

        return jsonify({
            'success': True,
            'drink': [drink.long()]
        })

    except Exception:
        db.session.rollback()
        print(exc_info())
        abort(422)


# update drink
@app.route('/drinks/<int:drink_id>', methods=['PATCH'])
@requires_auth('crud:globalMenu')
def update_drink(payload, drink_id):
    body = request.get_json()
    drink = Drink.query.filter(Drink.id == drink_id).one_or_none()

    if not drink:
        abort(404)

    try:
        drink.title = body['title']
        drink.recipe = body['recipe']

        drink.update()
        return jsonify({
            'success': True,
            'drink': drink.long()
        })

    except Exception:
        db.session.rollback()
        print(exc_info())
        abort(422)


# delete drink
@app.route('/drinks/<int:drink_id>', methods=['DELETE'])
@requires_auth('crud:globalMenu')
def delete_drink(payload, drink_id):
    drink = Drink.query.filter(Drink.id == drink_id).one_or_none()

    if not drink:
        abort(404)

    try:
        drink.delete()

        return jsonify({
            'success': True,
            'drink': drink.id
        })

    except Exception:
        db.session.rollback()
        print(exc_info())
        abort(422)


# Error Handlers

@app.errorhandler(422)
def unprocessable(error):
    return jsonify({
        "success": False,
        "error": 422,
        "message": "unprocessable"
    }), 422


@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "success": False,
        "error": 500,
        "message": "internal error"
    }), 500


@app.errorhandler(400)
def bad_request(error):
    return jsonify({
        "success": False,
        "error": 400,
        "message": "bad request"
    }), 400

# Error Handler (404) Not Found


@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "error": 404,
        "message": "resource not found"
    }), 404

# Error Handler (401) Unauthorized


@app.errorhandler(AuthError)
def not_authenticated(auth_error):
    return jsonify({
        "success": False,
        "error": auth_error.status_code,
        "message": auth_error.error
    }), 401
