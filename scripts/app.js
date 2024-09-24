const modalComponentID = document.getElementById("modalComponentID");
const startPairingButton = document.getElementById("startPairingButton");
const closeModalButton = document.getElementById("closeModalButton");
const tableBody = document.getElementById("tableBody");

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
}