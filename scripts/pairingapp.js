document.addEventListener("DOMContentLoaded", () => {
    const resetButton = document.getElementById("resetButton");
    const cancelButton = document.getElementById("cancelButton");
    const modalResetId = document.getElementById("modalResetId");
    const resetToggle = document.getElementById("resetToggle");
    const modalWarning = document.getElementById("modalWarning");
    const anotherCancelButton = document.getElementById("anotherCancelButton");
    const accuracyDiv = document.getElementById("accuracyDiv");
    const resetAndAccContainer = document.getElementById("resetAndAccContainer");

    let teamIndexToAddIntern;
    let unpairedInterns = [];
    let isEditMode = false;
    let modalDisplayed = false;
    const groupsOfThree = sessionStorage.getItem("groupsOfThree");
    const accObject = JSON.parse(sessionStorage.getItem("acc"));

    const pTag = document.createElement("p");
    resetAndAccContainer.classList.add("resetAndAccContainerStyle")
    pTag.innerText = `${accObject[0].Pairing_accuracy}% Accuracy`;
    resetAndAccContainer.appendChild(pTag);



    if (groupsOfThree === "1" && !modalDisplayed) {
        modalWarning.classList.remove("hidden");
        modalDisplayed = true;
    }

    anotherCancelButton.addEventListener("click", () => {
        modalWarning.classList.add("hidden");
    })


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
            const teamRow = document.createElement("tr");
            teamRow.className = "teamRow";
    
            const nameCell = document.createElement("td");
            const departmentCell = document.createElement("td");
            const locationCell = document.createElement("td");
    
            nameCell.className = "mergedCell";
            departmentCell.className = "mergedCell";
            locationCell.className = "mergedCell";
    
            team.forEach((intern, internIndex) => {
                const internNameDiv = document.createElement("div");
                internNameDiv.innerText = intern.name;
                nameCell.appendChild(internNameDiv);
    
                const internDepartmentDiv = document.createElement("div");
                internDepartmentDiv.innerText = intern.department;
                departmentCell.appendChild(internDepartmentDiv);
    
                const internLocationDiv = document.createElement("div");
                internLocationDiv.innerText = intern.location;
                locationCell.appendChild(internLocationDiv);
    
                if (isEditMode) {
                    const removeButton = document.createElement("button");
                    removeButton.classList.add("remove-button");
                    removeButton.innerText = "x";
                    removeButton.style.marginLeft = "5px";
                    removeButton.style.cursor = "pointer";
                    removeButton.addEventListener("click", () => {
                        removeIntern(teamIndex, internIndex);
                    });
    
                    internNameDiv.appendChild(removeButton);
                }
            });
    
            teamRow.appendChild(nameCell);
            teamRow.appendChild(departmentCell);
            teamRow.appendChild(locationCell);
    
            if (isEditMode) {
                const actionsCell = document.createElement("td");
                actionsCell.rowSpan = 1;
                actionsCell.className = "actionsCell";
    
                const addButton = document.createElement("button");
                addButton.classList.add("add-button");
                addButton.innerText = "+";
                addButton.style.marginTop = "10px";
                addButton.style.cursor = "pointer";
                addButton.addEventListener("click", () => {
                    openModal(teamIndex);
                });
    
                actionsCell.appendChild(addButton);
                teamRow.appendChild(actionsCell);
            }
    
            tbody.appendChild(teamRow);
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
    window.addEventListener("click", function (event) {
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
