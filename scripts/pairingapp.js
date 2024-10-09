document.addEventListener("DOMContentLoaded", () => {
    const resetButton = document.getElementById("resetButton");
    const cancelButton = document.getElementById("cancelButton");
    const modalResetId = document.getElementById("modalResetId");
    const resetToggle = document.getElementById("resetToggle");

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

        // Create table structure
        const table = document.createElement("table");
        table.className = "mainTableContainer";
        const thead = document.createElement("thead");
        thead.className = "tableHeaderStyling";
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = `
            <th>Name</th>
            <th>Department</th>
            <th>Location</th>
            ${isEditMode ? '<th>Add</th>' : ''}
        `;
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        tbody.id = "tableBody";
        tbody.className = "tableBodyStyling";

        pairedInterns.forEach((team, teamIndex) => {

            team.forEach((intern, internIndex) => {
                const teamMembersCell = document.createElement("tr");
                teamMembersCell.className = "teamMembersCell";

                const nameCell = document.createElement("td");
                nameCell.innerText = intern.name;
                teamMembersCell.appendChild(nameCell);

                const departmentCell = document.createElement("td");
                departmentCell.innerText = intern.department;
                teamMembersCell.appendChild(departmentCell);

                const locationCell = document.createElement("td");
                locationCell.innerText = intern.location;
                teamMembersCell.appendChild(locationCell);

                if (isEditMode) {
                    const removeButton = document.createElement("button");
                    removeButton.classList.add("remove-button");
                    removeButton.innerText = "x";
                    removeButton.style.marginLeft = "5px";
                    removeButton.style.cursor = "pointer";
                    removeButton.addEventListener("click", () => {
                        removeIntern(teamIndex, internIndex);
                    });

                    nameCell.appendChild(removeButton);
                }
                // Check if this is the last intern in the team
                if (internIndex === team.length - 1) {
                    nameCell.style.borderBottom = "2px solid green";
                    departmentCell.style.borderBottom = "2px solid green";
                    locationCell.style.borderBottom = "2px solid green";
                }

                if (isEditMode && internIndex === 0) {
                    const actionsCell = document.createElement("td");
                    actionsCell.rowSpan = team.length;
                    actionsCell.style.borderBottom = "2px solid green";
                    
                    const addButton = document.createElement("button");
                    addButton.classList.add("add-button");
                    addButton.innerText = "+";
                    addButton.style.marginTop = "10px";
                    addButton.style.cursor = "pointer";
                    addButton.addEventListener("click", () => {
                        openModal(teamIndex);
                    });
    
                    actionsCell.appendChild(addButton);
                    teamMembersCell.appendChild(actionsCell);
                }
        
                tbody.appendChild(teamMembersCell);
            });
             
        });

        table.appendChild(tbody);
        teamsContainer.appendChild(table);
    };

    if (document.getElementById("teamsContainer")) {
        displayPairedInterns();
    }

    resetButton.addEventListener("click", () => {
        sessionStorage.clear();
        window.location.href = "/";
    })

    cancelButton.addEventListener("click", () => {
        modalResetId.classList.add("hidden");
    })

    resetToggle.addEventListener("click", () => {
        modalResetId.classList.remove("hidden");
    })


    
        
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
    const addNewIntern = (internObj) => {
        const pairedInterns = JSON.parse(sessionStorage.getItem("pairedInterns")) || [];

        pairedInterns[teamIndexToAddIntern].push(internObj);

        // Remove added intern from the unpaired array
        unpairedInterns = unpairedInterns.filter(intern => intern.name !== internObj.name);

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
            internDiv.classList.add("unpaired-intern");
            internDiv.innerHTML = `${intern.name} - ${intern.department} - ${intern.location}`; // Display all details

            internDiv.addEventListener("click", () => {
            addNewIntern(intern); 
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
