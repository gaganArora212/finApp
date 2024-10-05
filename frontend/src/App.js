import './App.css';
import { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [faceAmount, setFaceAmount] = useState('');
  const [spread, setSpread] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [firstPaymentDate, setFirstPaymentDate] = useState('');
  const [maturityDate, setMaturityDate] = useState('');
  const [yieldValue, setYieldValue] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      face_amount: faceAmount,
      spread: spread / 100, // Convert to decimal
      issue_date: issueDate,
      first_payment_date: firstPaymentDate,
      maturity_date: maturityDate,
      yield: yieldValue / 100, // Convert to decimal
    };

    try {
      const response = await axios.post('http://localhost:5000/calculate', requestData, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'output.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error generating file:', error);
    }
  };

  return (
    <div className="App">
      <h1>Bond Price Calculation</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Face Amount:</label>
          <input type="number" value={faceAmount} onChange={(e) => setFaceAmount(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Spread (%):</label>
          <input type="number" value={spread} onChange={(e) => setSpread(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Issue Date:</label>
          <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>First Payment Date:</label>
          <input type="date" value={firstPaymentDate} onChange={(e) => setFirstPaymentDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Maturity Date:</label>
          <input type="date" value={maturityDate} onChange={(e) => setMaturityDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Yield (%):</label>
          <input type="number" value={yieldValue} onChange={(e) => setYieldValue(e.target.value)} required />
        </div>
        <button type="submit" className="submit-button">Calculate</button>
      </form>
    </div>
  );
};

export default App;
