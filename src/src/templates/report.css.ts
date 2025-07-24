export const reportCss = `
<style>
  body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      color: #333;
  }
  
  .container {
      max-width: 800px;
      margin: auto;
      border: 1px solid #ddd;
      padding: 20px;
  }
  
  .header {
      text-align: center;
      border-bottom: 2px solid #eee;
      padding-bottom: 10px;
      margin-bottom: 20px;
  }
  
  .header h1 {
      margin: 0;
      color: #0056b3;
  }
  
  h2 {
      color: #0056b3;
      border-bottom: 1px solid #eee;
      padding-bottom: 5px;
  }
  
  .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
      text-align: center;
  }
  
  .metric-card {
      padding: 15px;
      border-radius: 8px;
      background-color: #f8f9fa;
  }
  
  .metric-card h3 {
      margin: 0 0 5px 0;
      font-size: 1.1em;
      color: #555;
  }
  
  .metric-card p {
      margin: 0;
      font-size: 2em;
      font-weight: bold;
      color: #007bff;
  }
  
  .chart-container {
      text-align: center;
      margin-top: 30px;
  }
  
  table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
  }
  
  th,
  td {
      text-align: left;
      padding: 12px;
      border-bottom: 1px solid #ddd;
  }
  
  th {
      background-color: #f2f2f2;
  }
  
  .danger {
      color: #dc3545;
  }
  
  .footer {
      text-align: center;
      margin-top: 30px;
      font-size: 0.8em;
      color: #888;
  }
</style>
`;