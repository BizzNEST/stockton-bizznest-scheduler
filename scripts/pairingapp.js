document.addEventListener("DOMContentLoaded", () => {
    let teamIndexToAddIntern;
    let unpairedInterns = [];
    let isEditMode = false;
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

            pairedInterns[i].forEach((intern, internIndex) => {
                const internContainer = document.createElement("div");
                internContainer.style.display = "flex";
                internContainer.style.alignItems = "center";

                const internName = document.createElement("p");
                internName.style.margin = "0px";
                internName.innerText = intern.name;
                
                internContainer.appendChild(internName);

                
                if (isEditMode) {
                    const removeButton = document.createElement("button");
                    removeButton.innerText = "x";
                    removeButton.style.marginLeft = "10px";
                    removeButton.style.cursor = "pointer";
                    removeButton.addEventListener("click", () => {
                        removeIntern(i, internIndex);
                    });

                    internContainer.appendChild(removeButton);
                }
                internContainer.appendChild(internName);
                namesDiv.appendChild(internContainer);
            });

            if (isEditMode) {
                const addButton = document.createElement("button");
                addButton.innerText = "+";
                addButton.style.marginTop = "10px";
                addButton.style.cursor = "pointer";
                addButton.addEventListener("click", () => {
                    openModal(i);
                });

                namesDiv.appendChild(addButton);
            }


            teamDiv.appendChild(teamHeader);
            teamDiv.appendChild(namesDiv);
            teamsContainer.appendChild(teamDiv);
        }
    };

    const removeIntern = (teamIndex, internIndex) => {
        const pairedInterns = JSON.parse(sessionStorage.getItem("pairedInterns")) || [];
        const removedIntern = pairedInterns[teamIndex][internIndex];
        pairedInterns[teamIndex].splice(internIndex, 1); 

        
        if (pairedInterns[teamIndex].length === 0) {
            pairedInterns.splice(teamIndex, 1);
        }

        unpairedInterns.push(removedIntern);

        sessionStorage.setItem("pairedInterns", JSON.stringify(pairedInterns));
        displayPairedInterns(); 
    };

    const openModal = (teamIndex) => {
        teamIndexToAddIntern = teamIndex;
        document.getElementById("addInternModal").style.display = "block";
        displayUnpairedInterns();
    };

    // Close the modal when clicking the "x"
    const closeModal = () => {
        document.getElementById("addInternModal").style.display = "none";
    };

    // Add a new intern to the selected team
    const addNewIntern = (internName) => {
        const pairedInterns = JSON.parse(sessionStorage.getItem("pairedInterns")) || [];

        pairedInterns[teamIndexToAddIntern].push({ name: internName });

        // Remove added intern from the unpaired array
        unpairedInterns = unpairedInterns.filter(intern => intern.name !== internName);

        sessionStorage.setItem("pairedInterns", JSON.stringify(pairedInterns));
        closeModal();
        displayPairedInterns();
    };

    const displayUnpairedInterns = (searchTerm = "") => {
        const modalContent = document.querySelector(".modal-content");
        let unpairedList = document.getElementById("unpairedList");
        if (!unpairedList) {
            unpairedList = document.createElement("div");
            unpairedList.id = "unpairedList";
            modalContent.appendChild(unpairedList);
        }

        unpairedList.innerHTML = '';  

        const filteredInterns = unpairedInterns.filter(intern => 
            intern.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filteredInterns.forEach(intern => {
            const internDiv = document.createElement("div");
            internDiv.innerText = intern.name;
            internDiv.style.cursor = "pointer";
            internDiv.addEventListener("click", () => {
                addNewIntern(intern.name);
            });
            unpairedList.appendChild(internDiv);
        });


    };

    const toggleEditMode = () => {
        isEditMode = !isEditMode;  // Toggle edit mode state

        const editButton = document.getElementById("editButton");
        editButton.innerText = isEditMode ? "Exit Edit Mode" : "Edit Mode";  // Change button text based on mode

        displayPairedInterns();  // Re-render with/without edit buttons
    };

    const editButton = document.getElementById("editButton");
    if (editButton) {
        editButton.addEventListener("click", toggleEditMode);
    }

    const modalCloseButton = document.querySelector(".modal .close");
    modalCloseButton.addEventListener("click", closeModal);

    const searchUnpairedInternInput = document.getElementById("searchUnpairedIntern");
    searchUnpairedInternInput.addEventListener("input", (event) => {
        displayUnpairedInterns(event.target.value); 
    });

    // If clicked outside the modal, close it
    window.addEventListener("click", function(event) {
        const modal = document.getElementById("addInternModal");
        if (event.target === modal) {
            closeModal();
        }
    });

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
