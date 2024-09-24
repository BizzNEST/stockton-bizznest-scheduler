const modalComponentID = document.getElementById("modalComponentID");
const startPairingButton = document.getElementById("startPairingButton");
const closeModalButton = document.getElementById("closeModalButton")

startPairingButton.addEventListener("click", () => {
    modalComponentID.classList.remove("hidden");
});

closeModalButton.addEventListener("click", () => {
    modalComponentID.classList.add("hidden");
});
