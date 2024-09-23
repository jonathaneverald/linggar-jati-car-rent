from flask import jsonify


class ResponseHandler:
    @staticmethod
    def success(data=None, message="Success", status=200):
        response = {"message": message, "data": data}
        return jsonify(response), status

    @staticmethod
    def error(message="Error", status=400, data=None):
        response = {"message": message, "data": data}
        return jsonify(response), status
