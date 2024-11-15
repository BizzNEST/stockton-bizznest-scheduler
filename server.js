const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint example
app.get('/api/interns', (req, res) => {
    res.json([
        { id: 1, name: 'John Doe', department: 'Engineering', location: 'New York' },
        { id: 2, name: 'Jane Smith', department: 'Marketing', location: 'San Francisco' }
    ]);
});

// Function to generate pairs
function generatePairs(interns, rules) {
    let pairs = [];
    let validPairsCount = 0;
    let groupsOfThree = 0;
    const departGroup = rules.differentDepartments;
    const locationGroup = rules.differentLocations;
    while (interns.length > 1) {
        let firstIntern = interns.splice(Math.floor(Math.random() * interns.length), 1)[0];
        let partnerIndex = interns.findIndex((intern) => {
            if (departGroup && locationGroup) {
                return (
                    intern.department === firstIntern.department &&
                    intern.location === firstIntern.location
                );
            } else if (departGroup) {
                return intern.department === firstIntern.department;
            } else if (locationGroup) {
                return intern.location === firstIntern.location;
            }
            return false;
        });
        if (partnerIndex !== -1) {
            let secondIntern = interns.splice(partnerIndex, 1)[0];
            pairs.push([firstIntern, secondIntern]);
            validPairsCount++;
        } else {
            let secondIndex = Math.floor(Math.random() * interns.length);
            let secondIntern = interns.splice(secondIndex, 1)[0];
            pairs.push([firstIntern, secondIntern]);
        }
    }
    if (interns.length === 1) {
        const unpairedIntern = interns[0];
        if (pairs.length > 0) {
            pairs[pairs.length - 1].push(unpairedIntern);
            groupsOfThree++;
        } else {
            pairs.push([unpairedIntern]);
        }
    }

    const totalPairs = pairs.length;
    if (!departGroup && !locationGroup) {
        validPairsCount = totalPairs;
    }
    let accuracy = totalPairs > 0 ? (validPairsCount / totalPairs) * 100 : 100;
    let pairingAcc = accuracy.toFixed(2);

    return {
        pairs,
        groupsOfThree,
        totalPairs,
        validPairsCount,
        pairingAcc
    };
}

// Generate pairs endpoint
app.post('/api/generate-pairs', (req, res) => {
    const { interns, rules } = req.body;

    if (!interns || !Array.isArray(interns)) {
        return res.status(400).json({ error: 'Invalid interns list' });
    }

    const defaultRules = { differentLocations: false, differentDepartments: false };
    const appliedRules = { ...defaultRules, ...rules };

    const result = generatePairs(interns, appliedRules);
    res.json(result);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});