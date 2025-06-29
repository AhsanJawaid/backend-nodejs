const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const data = [
  { 
    id: 1,
    name: 'Item 1',
    email: 'test@test.com'
  },
  { 
    id: 2,
    name: 'Item2',
    email: 'user2@test.com'
},
  { 
    id: 3,
    name: 'Item3',
    email: 'user3@test.com'
  }
];

app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the API',
    status: 'Server is running successfully',
    timestamp: new Date().toISOString()
    });
});

app.get('/users', (req, res) => {
    const filters = req.query;
    let filteredData = data;
    // Apply filters if any
    for (const key in filters) {
        if (typeof filters === 'object' && filters !== null) {
            console.log('eys ', filters);
            if (key === 'id') {
                const userID = parseInt(filters[key]);
                filteredData = filteredData.filter(item => item.id === userID);
            } else if (key === 'name') {
                const userName = filters[key].toString();
                filteredData = filteredData.filter(item => item.name === userName);
            }
        }
    }

    res.json({ 
        users: filteredData
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app; // Export the app for testing purposes
// This allows the app to be imported in test files or other modules.