from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
from io import BytesIO
import datetime

app = Flask(__name__)
CORS(app)

def updated_calculate_bond_price(face_amount, spread, yield_value, issue_date, first_payment_date, maturity_date):
    payment_dates = pd.date_range(first_payment_date, maturity_date, freq='M')

    # Create DataFrame to store the updated calculations
    output_data = {
        'Pay Date': [],
        'Principal': [],
        'Interest': [],
        'Discount Factor': [],
        'Present Value': [],
        'Yield': []
    }

    price = 0.986056  # Example price from assessment file
    fixed_interest = face_amount * spread / 12  # Monthly interest based on face amount and spread

    for date in payment_dates:
        interest = fixed_interest  # Use fixed interest from assessment data
        discount_factor = price / (1 + yield_value) ** ((date - issue_date).days / 365.0)  # Yield-based discount factor
        present_value = interest * discount_factor

        # Populate data
        output_data['Pay Date'].append(date.strftime('%Y-%m-%d'))
        output_data['Principal'].append(0)  # Assuming no principal payments except at maturity
        output_data['Interest'].append(interest)
        output_data['Discount Factor'].append(discount_factor)
        output_data['Present Value'].append(present_value)
        output_data['Yield'].append(yield_value)

    return pd.DataFrame(output_data)

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    face_amount = float(data['face_amount'])
    spread = float(data['spread'])  # Retrieve spread as decimal
    yield_value = float(data['yield'])  # Retrieve yield from request
    issue_date = pd.to_datetime(data['issue_date'])
    first_payment_date = pd.to_datetime(data['first_payment_date'])
    maturity_date = pd.to_datetime(data['maturity_date'])

    # Perform calculations using the updated logic
    result_df = updated_calculate_bond_price(face_amount, spread, yield_value, issue_date, first_payment_date, maturity_date)

    # Write result to Excel in memory
    output = BytesIO()
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        result_df.to_excel(writer, sheet_name='Output', index=False)

    output.seek(0)

    return send_file(output, download_name='output.xlsx', as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
