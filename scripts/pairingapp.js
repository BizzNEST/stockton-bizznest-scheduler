document.addEventListener("DOMContentLoaded", () => {
    const displayPairedInterns = () => {
        const pairingTableBody = document.getElementById("pairTableBody");

        const pairedInterns = JSON.parse(sessionStorage.getItem("pairedInterns")) || [];
        pairingTableBody.innerHTML = ""; 
        if (pairedInterns.length === 0) {
            pairingTableBody.innerHTML = '<tr><td colspan="2">No pairs available</td></tr>';
            return;
        }

        pairedInterns.forEach((pair, index) => {
            const row = document.createElement("tr");
            row.className = `${index % 2 === 0 ? "rowBgDarkGreen" : "rowBgLightGreen"}`;

            const nameCol = document.createElement("td");
            nameCol.classList.add("noBorder"); 
            nameCol.innerHTML = pair.map(intern => intern.name).join("<br>"); 
            row.appendChild(nameCol);
            
            const departCol = document.createElement("td");
            departCol.classList.add("noBorder");
            departCol.innerHTML = pair.map(intern => intern.department).join("<br>"); 
            row.appendChild(departCol);
            
            pairingTableBody.appendChild(row);
        });
    };

    if (document.getElementById("pairTableBody")) {
        displayPairedInterns();
    }
});
