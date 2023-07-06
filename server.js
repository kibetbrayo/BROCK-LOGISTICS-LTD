const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/trailers', (req, res) => {
  // Logic to fetch and return trailer data
  const trailers = [
    // Trailer data
  ];
  res.json({ trailers });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
