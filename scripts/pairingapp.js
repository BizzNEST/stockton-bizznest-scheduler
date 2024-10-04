document.addEventListener("DOMContentLoaded", () => {
    const displayPairedInterns = () => {
        const teamsContainer = document.getElementById("teamsContainer");
        const pairedInterns = JSON.parse(sessionStorage.getItem("pairedInterns")) || [];
        teamsContainer.innerHTML = ""; 

        if (pairedInterns.length === 0) {
            teamsContainer.innerHTML = '<p>No pairs available</p>';
            return;
        }

        teamsContainer.className = "teamsContainer";

        for (let i = 0; i < pairedInterns.length; i++) {
            const teamDiv = document.createElement("div");
            teamDiv.className = "team";
            const teamHeader = document.createElement("p");
            teamHeader.className = "teamHeader"; 
            teamHeader.innerText = `Team ${i + 1}`; 

            const namesDiv = document.createElement("div");
            namesDiv.className = "namesDiv";

            pairedInterns[i].forEach(intern => {
                const internName = document.createElement("p");
                internName.style.margin = "0px";
                internName.innerText = intern.name;
                namesDiv.appendChild(internName);
            });

            teamDiv.appendChild(teamHeader);
            teamDiv.appendChild(namesDiv);
            teamsContainer.appendChild(teamDiv);
        }
    };

    if (document.getElementById("teamsContainer")) {
        displayPairedInterns();
    }

    // Function to generate CSV content
    function generateCSVContent() {
        const pairedInterns = JSON.parse(sessionStorage.getItem("pairedInterns")) || [];
        let csvContent = "Team Number,Intern Name,Location,Department\n"; // CSV header

        pairedInterns.forEach((team, index) => {
            const teamNumber = index + 1;
            team.forEach(intern => {
                const internName = intern.name;
                const location = intern.location;
                const department = intern.department;
                csvContent += `${teamNumber},${internName},${location},${department}\n`;
            });
        });

        return csvContent;
    }

    // Function to create a downloadable CSV file
    function downloadCSV(content) {
        const blob = new Blob([content], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'intern_pairs.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    //event listener for the download button
    document.getElementById('downloadButton').addEventListener('click', () => {
        const csvContent = generateCSVContent();
        downloadCSV(csvContent);
    });
});
