const addBtn = document.querySelector(".btnAdd button");
const formSection = document.querySelector("section");
const cancelBtn = document.querySelector(".btn-cancel");
const inputUrl = document.getElementById("url");
const image = document.getElementById("image");
const form = document.getElementById("workerForm");
const workersBox = document.querySelector(".box_workers");
const experiencesContainer = document.getElementById("experiencesContainer");
const closeSelectBtn = document.getElementById("CloseSelect");
const buttons = document.querySelectorAll(".AjouteWorker");

let workers = JSON.parse(localStorage.getItem("workers")) || [];

addBtn.addEventListener("click", () => formSection.style.display = "flex");
cancelBtn.addEventListener("click", closeForm);
formSection.addEventListener("click", e => { if (e.target === formSection) closeForm(); });
inputUrl.addEventListener("input", () => image.src = inputUrl.value);

document.addEventListener("DOMContentLoaded", () => {
    closeworker()
    renderWorkers();
    workerszone();

    const btnAddExp = document.querySelector(".btnexperience button");
    btnAddExp.addEventListener("click", () => {
        const block = document.createElement("div");
        block.classList.add("experience-block");
        block.innerHTML = `
            <label>Company :</label>
            <input type="text" name="company">
            <label>Role :</label>
            <select required>
                <option value="Receptionist">Receptionist</option>
                <option value="It guy">It guy</option>
                <option value="cleaning">Cleaning</option>
                <option value="other">Other</option>
            </select>
            <label>From :</label>
            <input type="date" name="from">
            <label>To :</label>
            <input type="date" name="to">
            <button type="button" class="deleteExp">Remove</button>
        `;
        experiencesContainer.appendChild(block);
        block.querySelector(".deleteExp").addEventListener("click", () => block.remove());
    });
});

function closeForm() {
    formSection.style.display = "none";
    form.reset();
    image.src = "image.png";
}

function validateForm() {
    let isValid = true;

    let rules = {
        name: { regex: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{3,}$/, message: "Nom invalide (min 3 lettres)" },
        email: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email invalide" },
        phone: { regex: /^(\+?\d{1,3}[- ]?)?\d{8,12}$/, message: "phone invalide" },
        url: { regex: /^https?:\/\/.+/, message: "URL invalide" },
        role: { regex: /^[A-Za-z\s]+$/, message: "Role invalide" }
    };

    const fields = ["name", "email", "phone", "url", "role"];

    fields.forEach(field => {
        const input = form[field];
        const span = input.nextElementSibling;

        if (!rules[field].regex.test(input.value.trim())) {
            input.style.border = "3px solid red";
            span.textContent = rules[field].message;
            isValid = false;
        } else {
            input.style.border = "3px solid green";
            span.textContent = "";
        }
    });

    const expBlocks = document.querySelectorAll(".experience-block");
    for (let block of expBlocks) {
        const from = block.querySelector("input[name='from']").value;
        const to = block.querySelector("input[name='to']").value;

        if (from && to && new Date(from) > new Date(to)) {
            alert("La date 'From' doit être avant la date 'To'.");
            isValid = false;
            break;
        }
    }

    return isValid;
}

form.addEventListener("submit", e => {
    e.preventDefault();
    if (!validateForm()) return;

    const experiences = [];
    document.querySelectorAll(".experience-block").forEach(exp => {
        experiences.push({
            company: exp.querySelector("input[name='company']").value,
            role: exp.querySelector("select").value,
            from: exp.querySelector("input[name='from']").value,
            to: exp.querySelector("input[name='to']").value
        });
    });

    const worker = {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        role: form.role.value,
        image: form.url.value,
        assigned: false,
        experiences
    };

    workers.push(worker);
    localStorage.setItem("workers", JSON.stringify(workers));

    renderWorkers();
    closeForm();
});

function renderWorkers() {
    workersBox.innerHTML = "";

    workers.forEach((worker) => {

        if (worker.assigned) return;

        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${worker.image}" onerror="this.src='image.png'">
            <div class="nameBox">
                <h4>${worker.name}</h4>
                <p>${worker.role}</p>
            </div>
        `;

        workersBox.appendChild(card);
    });
}

closeSelectBtn.addEventListener("click", () => WorkerZone.style.display = "none");

const maxWorkersPerZone = {
    conférence: 2,
    serveurs: 2,
    sécurité: 2,
    Réception: 2,
    personnel: 2,
    archives: 2
};

function workerszone() {
    const roomsRoles = {
        conférence: ["Cleaning", "Manager", "Other"],
        serveurs: ["It guy", "Manager", "Cleaning"],
        sécurité: ["security", "Manager", "Cleaning"],
        Réception: ["Receptionist", "Cleaning", "Manager"],
        personnel: ["Cleaning", "Manager", "Other"],
        archives: ["Manager", "Other"]
    };

    const displayWorkers = document.getElementById("displayWorkers");

    buttons.forEach(button => {
        button.addEventListener("click", () => {

            WorkerZone.style.display = "flex";

            displayWorkers.innerHTML = "";
            const nameRoom = button.getAttribute("data-room");

            const filteredWorkers = workers.filter(
                w => roomsRoles[nameRoom].includes(w.role)
            );

            filteredWorkers.forEach((worker) => {

                const card = document.createElement("div");
                card.classList.add("cardAffichage");
                card.style.display = "flex";

                card.innerHTML = `
                    <img src="${worker.image}" onerror="this.src='image.png'">
                    <div class="nameBox">
                        <h4>${worker.name}</h4>
                        <p>${worker.role}</p>
                    </div>
                `;

                card.addEventListener("click", () => {
                    addWorkerToZone(worker, button);
                    worker.assigned = true;
                    localStorage.setItem("workers", JSON.stringify(workers));
                    renderWorkers();
                    card.remove();
                });

                displayWorkers.appendChild(card);
            });
        });
    });
}

function addWorkerToZone(worker, zoneButton) {

    const zoneDiv = zoneButton.closest(".zoneColor");
    const zoneName = zoneButton.getAttribute("data-room");

    if (!zoneDiv) return;

    const currentWorkers = zoneDiv.querySelectorAll(".cardAffichage").length;
    if (currentWorkers >= maxWorkersPerZone[zoneName]) {
        alert("Cette zone a déjà 2 workers !");
        return;
    }

    const div = document.createElement("div");
    div.classList.add("cardAffichage");
    div.style.display = "flex";

    div.innerHTML = `
        <img src="${worker.image}" onerror="this.src='image.png'">
        <div class="nameBox">
            <h4>${worker.name}</h4>
            <p>${worker.role}</p>
            <button class="closeBtn">X</button>
        </div>
    `;
    zoneDiv.appendChild(div);
    closeworker()
}
function closeworker() {
    const closeBtns = document.querySelectorAll(".closeBtn");

    closeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const cardDiv = btn.closest(".cardAffichage");
            const name = cardDiv.querySelector("h4").textContent;
            let allWorkers = JSON.parse(localStorage.getItem("workers")) || [];
            const worker = allWorkers.find(w => w.name === name);
            if (worker) {
                worker.assigned = false;
            }
            localStorage.setItem("workers", JSON.stringify(allWorkers));
            renderWorkers();
            cardDiv.remove();
        });
    });
}
