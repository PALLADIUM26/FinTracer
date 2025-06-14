from flask import Blueprint, Response, send_file
from io import StringIO, BytesIO
import csv
from fpdf import FPDF
from models.transaction import Transaction
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import db
import os

export_bp = Blueprint('export', __name__)

@export_bp.route('/export/csv')
@jwt_required()
def export_csv():
    user_id = get_jwt_identity()
    transactions = Transaction.query.filter_by(user_id=user_id).all()

    si = StringIO()
    cw = csv.writer(si)
    cw.writerow(['Date', 'Amount', 'Category', 'Type', 'Description'])
    for t in transactions:
        cw.writerow([t.date, t.amount, t.category, t.type, t.description])

    output = Response(si.getvalue(), mimetype='text/csv')
    output.headers["Content-Disposition"] = "attachment; filename=transactions.csv"
    return output


# @export_bp.route('/export/pdf')
# @jwt_required()
# def export_pdf():
#     user_id = get_jwt_identity()
#     transactions = Transaction.query.filter_by(user_id=user_id).all()
#     # font_path = os.path.join(os.path.dirname(__file__), '..', 'fonts', 'DejaVuSans.ttf')
#     pdf = FPDF()
#     pdf.add_page()
#     pdf.set_font("Arial", size=12)
#     pdf.cell(200, 10, txt="Transaction Report", ln=True, align="C")
#     pdf.ln(10)

#     for t in transactions:
#         # line = f"{t.date} | ₹{t.amount} | {t.category} | {t.type} | {t.description}"
#         line = f"{t.date} | Rs{t.amount} | {t.category} | {t.type} | {t.description}"
#         pdf.cell(200, 10, txt=line, ln=True)

#     pdf_output = BytesIO()
#     pdf.output(pdf_output)
#     pdf_output.seek(0)

#     return send_file(pdf_output, as_attachment=True, download_name="transactions.pdf", mimetype='application/pdf')

@export_bp.route('/export/pdf')
@jwt_required()
def export_pdf():
    user_id = get_jwt_identity()
    transactions = Transaction.query.filter_by(user_id=user_id).all()

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="Transaction Report", ln=True, align="C")
    pdf.ln(10)

    for t in transactions:
        line = f"{t.date} | Rs.{t.amount} | {t.category} | {t.type} | {t.description}"
        pdf.cell(200, 10, txt=line, ln=True)

    pdf_output = BytesIO()
    pdf_bytes = pdf.output(dest='S').encode('latin-1')  # Output as string, encode as bytes
    pdf_output.write(pdf_bytes)
    pdf_output.seek(0)

    return send_file(pdf_output, as_attachment=True, download_name="transactions.pdf", mimetype='application/pdf')
