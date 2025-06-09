from flask import Blueprint, request, jsonify
from datetime import datetime
from db import db
from models import Transaction
from flask_jwt_extended import jwt_required, get_jwt_identity

transactions_bp = Blueprint('transactions', __name__)

@transactions_bp.route('/transactions', methods=['POST'])
@jwt_required()
def add_transaction():
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400
    try:
        amount = float(data['amount'])
        ttype = data['type']
        category = data['category']
        date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        description = data.get('description', '')

        transaction = Transaction(
            amount=amount,
            type = ttype,
            category=category,
            date=date,
            description=description,
            user_id=user_id
        )
        db.session.add(transaction)
        db.session.commit()

        return jsonify({'message': 'Transaction added successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 400


@transactions_bp.route('/transactions', methods=['GET'])
@jwt_required()
def get_transactions():
    user_id = get_jwt_identity()
    transactions = Transaction.query.filter_by(user_id=user_id).all()
    results = []
    for t in transactions:
        results.append({
            'id': t.id,
            'amount': t.amount,
            'type': t.type,
            'category': t.category,
            'date': t.date.strftime('%Y-%m-%d'),
            'description': t.description
        })
    return jsonify(results), 200


@transactions_bp.route('/transactions/<int:transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    transaction = Transaction.query.get(transaction_id)
    if not transaction:
        return jsonify({'error': 'Transaction not found'}), 404

    db.session.delete(transaction)
    db.session.commit()
    return jsonify({'message': 'Transaction deleted successfully'}), 200
