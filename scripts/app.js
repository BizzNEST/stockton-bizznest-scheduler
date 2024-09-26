const modalComponentID = document.getElementById("modalComponentID");
const startPairingButton = document.getElementById("startPairingButton");
const closeModalButton = document.getElementById("closeModalButton");
const tableBody = document.getElementById("tableBody");
const currentPageNumber = document.getElementById("currentPageNumber");
const prevPageButton = document.getElementById("prevPageButton");
const nextPageButton = document.getElementById("nextPageButton");
const selectAllButton = document.getElementById("selectAllButton");
const deselectAllButton = document.getElementById("deselectAllButton");

let currentPage = 1;
let interns = [];
let pageSize = 8;

closeModalButton.addEventListener("click", () => {
    modalComponentID.classList.add("hidden");
    currentPage = 1;
});

startPairingButton.addEventListener("click", () => {
    modalComponentID.classList.remove("hidden");
    currentPage = 1;
    loadItems();
});

const apiFetch = async () => {
    const promise = await fetch("./seedata/interns.json");
    const data = await promise.json();
    return data;
};

const loadItems = async () => {
    interns = await apiFetch();
    loadInterns();
};



const departmentDropdown = document.getElementById("departments");
const locationDropdown = document.getElementById("locations");

// Function to update the checkbox selection state
const updateDropdownCheckboxes = (checkboxes, selectedItems) => {
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectedItems.includes(checkbox.value);
    });
};

// Function to toggle the dropdown content
const setupDropdownToggle = (buttonId, contentId) => {
    const button = document.getElementById(buttonId);
    const content = document.getElementById(contentId);

    let isDropdownVisible = false;

    button.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent the click from propagating to the document
        isDropdownVisible = !isDropdownVisible;
        content.classList.toggle('show', isDropdownVisible);
    });

    // Hide the dropdown when clicking outside of it
    document.addEventListener('click', function(event) {
        if (!button.contains(event.target) && !content.contains(event.target)) {
            isDropdownVisible = false;
            content.classList.remove('show');
        }
    });
};

// Setup dropdown toggle for departments
setupDropdownToggle('dropdownButton1', 'departments');

// Setup dropdown toggle for locations
setupDropdownToggle('dropdownButton2', 'locations');

// Example usage for departments
const departmentCheckboxes = document.querySelectorAll('#departments input[type="checkbox"]');
let selectedDepartments = [];


// Example usage for locations
const locationCheckboxes = document.querySelectorAll('#locations input[type="checkbox"]');
let selectedLocations = [];


// Event listeners for checkbox changes
departmentCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const value = checkbox.value;

        if (value === "Department") {
            // Reset all selections if "Department" is checked
            if (checkbox.checked) {
                selectedDepartments = []; // Keep only "Department"
                departmentCheckboxes.forEach(cb => {
                    if (cb.value !== "Department") {    
                        cb.checked = false; // Uncheck other boxes
                    }
                });
            }
        } else {
            // Handle regular department selections
            if (checkbox.checked) {
                if (!selectedDepartments.includes(value)) {
                    selectedDepartments.push(value);
                }
            } else {
                selectedDepartments = selectedDepartments.filter(item => item !== value);
            }
        }

        updateDropdownCheckboxes(departmentCheckboxes, selectedDepartments);
        loadInterns(); // Uncomment if needed
    });
});

// Event listener for the location dropdown
locationCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const value = checkbox.value;

        if (value === "Location") {
            // Reset all selections if "Location" is checked
            if (checkbox.checked) {
                selectedLocations = []; // Keep only "Location"
                locationCheckboxes.forEach(cb => {
                    if (cb.value !== "Location") {    
                        cb.checked = false; // Uncheck other boxes
                    }
                });
            }
        } else {
            // Handle regular location selections
            if (checkbox.checked) {
                if (!selectedLocations.includes(value)) {
                    selectedLocations.push(value);
                }
            } else {
                selectedLocations = selectedLocations.filter(item => item !== value);
            }
        }

        updateDropdownCheckboxes(locationCheckboxes, selectedLocations);
        loadInterns(); // Uncomment if needed
    });
});



const loadInterns = () => {
    tableBody.innerHTML = '';

    let filteredInterns = interns;

    if (selectedDepartments.length > 0) {
        filteredInterns = filteredInterns.filter(intern => selectedDepartments.includes(intern.department));
    }

    if (selectedLocations.length > 0) {
        filteredInterns = filteredInterns.filter(intern => selectedLocations.includes(intern.location));
    }

    if (filteredInterns.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">No interns found</td></tr>';
        return;
    }

    const totalPages = Math.ceil(filteredInterns.length / pageSize);
    
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const paginatedInterns = filteredInterns.slice(start, end);

    const selectedInterns = JSON.parse(sessionStorage.getItem("selected")) || {};

    paginatedInterns.forEach((intern, index) => {
        const row = document.createElement("tr");

        const checkCol = document.createElement("td");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        const internIndex = start + index;
        checkbox.checked = selectedInterns[internIndex] || false;
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                selectedInterns[internIndex] = true;
                row.style.backgroundColor = 'rgba(121, 200, 163, 0.4)';
            } else {
                delete selectedInterns[internIndex];
                row.style.backgroundColor = '';
            }
            sessionStorage.setItem("selected", JSON.stringify(selectedInterns));
        });

        if (checkbox.checked) {
            row.style.backgroundColor = 'rgba(121, 200, 163, 0.4)';
        }
        checkCol.appendChild(checkbox);
        
        const nameCol = document.createElement("td");
        nameCol.textContent = intern.name;
        
        const departCol = document.createElement("td");
        departCol.textContent = intern.department;
        
        const locationCol = document.createElement("td");
        locationCol.textContent = intern.location;

        row.appendChild(checkCol);
        row.appendChild(nameCol);
        row.appendChild(departCol);
        row.appendChild(locationCol);

        tableBody.appendChild(row);
    });

    
    selectAllButton.addEventListener("click", () => {
        
        interns.forEach((intern, index) => {
            selectedInterns[index] = true;
        });
        sessionStorage.setItem("selected", JSON.stringify(selectedInterns));

        
        const checkboxes = document.querySelectorAll('#tableBody input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change'));
        });
    });
    
    
    deselectAllButton.addEventListener("click", () => {
        
        interns.forEach((intern, index) => {
            delete selectedInterns[index];
        });
        sessionStorage.setItem("selected", JSON.stringify(selectedInterns));

        
        const checkboxes = document.querySelectorAll('#tableBody input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
            checkbox.checked = false;
            checkbox.dispatchEvent(new Event('change'));
        });
    });

    currentPageNumber.textContent = currentPage;
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
};

prevPageButton.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        loadInterns();
    }
});

nextPageButton.addEventListener("click", () => {
    if ((currentPage * pageSize) < interns.length) {
        currentPage++;
        loadInterns();
    }
});
