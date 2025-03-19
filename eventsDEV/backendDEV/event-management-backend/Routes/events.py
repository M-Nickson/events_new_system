from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..Models.event import Event
from ..databaseDEV.db_configure import db

events_bp = Blueprint("events", __name__)

@events_bp.route("/create_event", methods=["POST"])
@jwt_required
def create_event():
    data = request.get_json()
    name = data.get("name")
    date = data.get("date")
    location = data.get("location")
    event = Event(name=name, date=date, location=location)
    db.session.add(event)
    db.session.commit()

    return jsonify({"message": "Event created successfully!", "event": event.id}), 201


@events_bp.route("/", methods=["GET"])
@jwt_required()
def get_events():
    events = Event.query.all()
    return jsonify([{"id": event.id, "name": event.name, "date": event.date, "location": event.location} for event in events]), 200


@events_bp.route("/<int:event_id>", methods=["DELETE"])
@jwt_required()
def delete_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"message": "Event not found."}), 404

    db.session.delete(event)
    db.session.commit()

    return jsonify({"message": "Event deleted successfully!"}), 200