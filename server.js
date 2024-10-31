const express = require("express");
const app = express();
const port = 8000;
const cors = require('cors');
const fs = require('fs');

app.use(cors());
app.use(express.json());

let interns = [];
fs.readFile('./seedata/interns.json', 'utf8', (error, data) => {
    if (error) {
        console.error('Error reading interns data:', error);
    } else {
        interns = JSON.parse(data);
    }
});

app.post('/pair-interns', (req, res) => {
    console.log('Received request:', req.body);
    
    try {
        const { selectedInterns, isPairingInitiated, departmentGroup, locationGroup } = req.body;

        if (!isPairingInitiated) {
            return res.status(400).json({ message: "Pairing not initiated." });
        }

        const selectedIds = Object.keys(selectedInterns).filter(id => selectedInterns[id]);

        if (selectedIds.length < 2) {
            return res.status(400).json({ message: "Not enough interns to pair." });
        }

        const internPair = interns.filter(intern => selectedIds.includes(String(intern.id)));

        if (internPair.length < 2) {
            return res.status(400).json({ message: "Not enough interns to pair." });
        }

        let pairs = [];
        let validPairsCount = 0;
        let groupsOfThree = 0;

        while (internPair.length > 1) {
            let firstIntern = internPair.splice(Math.floor(Math.random() * internPair.length), 1)[0];
            let partnerIndex = internPair.findIndex((intern) => {
                if (departmentGroup && locationGroup) {
                    return intern.department === firstIntern.department && intern.location === firstIntern.location;
                } else if (departmentGroup) {
                    return intern.department === firstIntern.department;
                } else if (locationGroup) {
                    return intern.location === firstIntern.location;
                }
                return false;
            });

            if (partnerIndex !== -1) {
                let secondIntern = internPair.splice(partnerIndex, 1)[0];
                pairs.push([firstIntern, secondIntern]);
                validPairsCount++;
            } else {
                let secondIndex = Math.floor(Math.random() * internPair.length);
                let secondIntern = internPair.splice(secondIndex, 1)[0];
                pairs.push([firstIntern, secondIntern]);
            }
        }

        if (internPair.length === 1) {
            const unpairedIntern = internPair[0];
            if (pairs.length > 0) {
                pairs[pairs.length - 1].push(unpairedIntern);
                groupsOfThree++;
            } else {
                pairs.push([unpairedIntern]);
            }
        }

        const totalPairs = pairs.length;
        if (!departmentGroup && !locationGroup) {
            validPairsCount = totalPairs;
        }

        let accuracy = totalPairs > 0 ? (validPairsCount / totalPairs) * 100 : 100;
        const pairingAcc = accuracy.toFixed(2);

        const accPairs = {
            "Total_pairs_created": totalPairs,
            "Valid_pairs_based_on_Filters": validPairsCount,
            "Pairing_accuracy": pairingAcc,
        };

        res.json({
            pairs,
            accPairs,
            groupsOfThree,
        });
    } catch (error) {
        console.error('Error pairing:', error);
        res.status(500).json({ message: "Server error." });
    }
});

app.post('/download-csv', (req, res) => {
    const pairedInterns = req.body.pairedInterns || [];
    let csvContent = "Team Number,Intern Name,Location,Department\n";
    
    pairedInterns.forEach((team, index) => {
        const teamNumber = index + 1;
        team.forEach(intern => {
            const { name, location, department } = intern;
            csvContent += `${teamNumber},${name},${location},${department}\n`;
        });
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=intern_pairs.csv');
    res.send(csvContent);
});


app.listen(port, () => {
    console.log(`Server is running on LocalHost: ${port}`);
});