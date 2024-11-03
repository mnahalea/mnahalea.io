<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Results</title>
  <style>
    body {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: Arial, sans-serif;
      text-align: center;
      margin: 20px;
    }
    h1 {
      font-size: 24px;
      color: #333;
    }
    h2 {
      margin-top: 40px;
      color: #555;
    }
    table {
      width: 100%;
      max-width: 800px;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      padding: 10px;
      border: 1px solid #ddd;
      text-align: center;
    }
    th {
      background-color: #f2f2f2;
    }
  </style>
</head>
<body>
  <h1>Test Results</h1>

  <!-- Black Ethnicity Results -->
  <h2>Black Ethnicity</h2>
  <table>
    <thead>
      <tr>
        <th>Audio File</th>
        <th>Name</th>
        <th>Congruency</th>
        <th>Key Pressed</th>
        <th>Correct</th>
        <th>Reaction Time (ms)</th>
      </tr>
    </thead>
    <tbody id="blackResultsTableBody">
      <!-- Rows will be populated here by JavaScript -->
    </tbody>
  </table>

  <!-- White Ethnicity Results -->
  <h2>White Ethnicity</h2>
  <table>
    <thead>
      <tr>
        <th>Audio File</th>
        <th>Name</th>
        <th>Congruency</th>
        <th>Key Pressed</th>
        <th>Correct</th>
        <th>Reaction Time (ms)</th>
      </tr>
    </thead>
    <tbody id="whiteResultsTableBody">
      <!-- Rows will be populated here by JavaScript -->
    </tbody>
  </table>

  <script>
    // Retrieve reaction data from localStorage
    const reactionData = JSON.parse(localStorage.getItem("reactionData"));

    // Reference table body elements for each ethnicity
    const blackResultsTableBody = document.getElementById("blackResultsTableBody");
    const whiteResultsTableBody = document.getElementById("whiteResultsTableBody");

    // Check if there is reaction data and then separate entries by ethnicity
    if (reactionData && reactionData.length > 0) {
      reactionData.forEach(entry => {
        const row = document.createElement("tr");
        row.innerHTML = 
          <td>${entry.audioFile}</td>
          <td>${entry.name}</td>
          <td>${entry.congruency}</td>
          <td>${entry.keyPressed}</td>
          <td>${entry.correct ? "Yes" : "No"}</td>
          <td>${entry.reactionTime}</td>
        ;

        // Append the row to the appropriate table based on ethnicity
        if (entry.ethnicity === "Black") {
          blackResultsTableBody.appendChild(row);
        } else if (entry.ethnicity === "White") {
          whiteResultsTableBody.appendChild(row);
        }
      });
    } else {
      // Display message if no data is available for each ethnicity
      blackResultsTableBody.innerHTML = <tr><td colspan="6">No data available for Black ethnicity.</td></tr>;
      whiteResultsTableBody.innerHTML = <tr><td colspan="6">No data available for White ethnicity.</td></tr>;
    }
  </script>
</body>
</html>
