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
});
