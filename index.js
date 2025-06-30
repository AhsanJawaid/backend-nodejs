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

app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = data.find(item => item.id === userId);

  if (!user) {
    return res.status(404).json({ 
      message: 'User not found',
      error: 'No user with the given ID'
    });
  }

  res.json({ 
    user: user
  });
});

// - ADD NEW USER
app.post('/add-user', (req, res) => {
  try{
    const {name, email} = req.body;
    // validate request fields
    if(!name || !email) {
      return res.status(400).json({ 
        message: 'Name and email are required fields.',
        error: 'Missing required fields'
      });
    }

    const newUser = {
      id: data.length + 1,
      name: name,
      email: email
    };

    //Add data to array
    data.push(newUser);

    res.status(201).json({ 
      message: 'User added successfully',
      user: newUser,
      totalUsers: data.length
    });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ 
      message: 'Error adding user',
      error: error.message
    });
  }
});

// - UPDATE USER (PUT)
app.put('/update-user/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email } = req.body;

    // Find user by ID
    const userIndex = data.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ 
        message: 'User not found',
        error: 'No user with the given ID'
      });
    }

    if (!name || !email) {
      return res.status(400).json({ 
        message: "PUT requires all fields (name and email)",
        error: "Missing required fields for complete resource replacement",
        note: "PUT replaces the entire resource, so all fields are required"
      });
    }

    // replace user data
    const updatedUser = {
      id: userId,
      name: name,
      email: email
    };

    data[userIndex] = updatedUser;
    res.json({ 
      message: "User completely replaced (PUT)",
      updatedUser: updatedUser,
      note: "PUT replaced the entire resource with new data"
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ 
      message: 'Error updating user',
      error: error.message
    });
  }
});

// - PATCH USER (PATCH)
app.patch('/update-user/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email } = req.body;

    // Find user by ID
    const userIndex = data.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ 
        message: 'User not found',
        error: 'No user with the given ID'
      });
    }

    if (!name && !email) {
      return res.status(400).json({
        message: "PATCH requires at least one field to update",
        error: "No fields provided for update",
        note: "PATCH allows partial updates, so at least one field should be provided"
      });
    }

    // Update only provided fields
    if (name) data[userIndex].name = name;
    if (email) data[userIndex].email = email;

    // Get current user data
    // const currentUser = data[userIndex];
    
    // const updatedUser = {
    //   ...currentUser,
    //   ...(name && { name: name }),
    //   ...(email && { email: email })
    // };

    // data[userIndex] = updatedUser;

    res.json({ 
      message: "User partially updated (PATCH)",
      updatedUser: data[userIndex],
      changes: {
        name: name ? `Changed from "${currentUser.name}" to "${name}"` : "No change",
        email: email ? `Changed from "${currentUser.email}" to "${email}"` : "No change"
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ 
      message: 'Error updating user',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app; // Export the app for testing purposes
// This allows the app to be imported in test files or other modules.