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

const loadInterns = () => {
    tableBody.innerHTML = '';

    const totalPages = Math.ceil(interns.length / pageSize);
    
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const filteredInterns = interns.slice(start, end);

    const selectedInterns = JSON.parse(sessionStorage.getItem("selected")) || {};

    filteredInterns.forEach((intern, index) => {
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
