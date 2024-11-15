const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint example
app.get('/api/interns', (req, res) => {
    res.json([
        { id: 1, name: 'John Doe', department: 'Engineering', location: 'New York' },
        { id: 2, name: 'Jane Smith', department: 'Marketing', location: 'San Francisco' }
    ]);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});