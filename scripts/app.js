const modalComponentID = document.getElementById("modalComponentID");
const startPairingButton = document.getElementById("startPairingButton");
const closeModalButton = document.getElementById("closeModalButton");
const tableBody = document.getElementById("tableBody");
const selectAllButton = document.getElementById("selectAllButton");
const deselectAllButton = document.getElementById("deselectAllButton");

closeModalButton.addEventListener("click", () => {
    modalComponentID.classList.add("hidden");
});

startPairingButton.addEventListener("click", () => {
    modalComponentID.classList.remove("hidden");
    loadInterns();
});

const apiFetch = async () => {
    const promise = await fetch("./seedata/interns.json");
    const data = await promise.json();
    return data;
}

const loadInterns = async () => {
    const interns = await apiFetch();
    
    const filterInterns = interns.splice(0,10);

    tableBody.innerHTML = '';

    filterInterns.forEach(intern => {
        const row = document.createElement("tr");

        const checkCol = document.createElement("td");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                row.style.backgroundColor = 'rgba(121, 200, 163, 0.4)'; // Change to green if checked
            } else {
                row.style.backgroundColor = ''; // Reset background if unchecked
            }
        });

        checkCol.appendChild(checkbox);
        
        const nameCell = document.createElement("td");
        nameCell.textContent = intern.name;
        
        const departCol = document.createElement("td");
        departCol.textContent = intern.department;
        
        const locationCol = document.createElement("td");
        locationCol.textContent = intern.location;

        row.appendChild(checkCol);
        row.appendChild(nameCell);
        row.appendChild(departCol);
        row.appendChild(locationCol);

        tableBody.appendChild(row);
    });

    selectAllButton.addEventListener("click", () => {
        const checkboxes = document.querySelectorAll('#tableBody input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change'));
        });
    });
    
    
    deselectAllButton.addEventListener("click", () => {
        const checkboxes = document.querySelectorAll('#tableBody input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.dispatchEvent(new Event('change'));
        });
    });
}