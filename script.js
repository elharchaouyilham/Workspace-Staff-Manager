const addBtn = document.querySelector(".btnAdd button");
const formSection = document.querySelector("section");
const cancelBtn = document.querySelector(".btn-cancel");
const inputUrl = document.getElementById("url");
const image = document.getElementById("image");
const form = document.getElementById("workerForm");
const workersBox = document.querySelector(".box_workers");
const experiencesContainer = document.getElementById("experiencesContainer");

let workers = JSON.parse(localStorage.getItem("workers")) || [];

addBtn.addEventListener("click", () => formSection.style.display = "flex");
cancelBtn.addEventListener("click", closeForm);
formSection.addEventListener("click", e => { if (e.target === formSection) closeForm(); });
inputUrl.addEventListener("input", () => image.src = inputUrl.value);

function closeForm() {
    formSection.style.display = "none";
    form.reset();
    image.src = "image.png";
    form.querySelectorAll("input, select").forEach(i => i.style.border = "1px solid #ccc");
}

function validateForm() {
    let isValid = true;
    const inputs = form.querySelectorAll("input, select");
    inputs.forEach(input => {
        if (!input.checkValidity()) {
            input.style.border = "3px solid red";
            isValid = false;
        } else input.style.border = "3px solid green";
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
        image: form.url.value ,
        experiences
    };

    workers.push(worker);
    localStorage.setItem("workers", JSON.stringify(workers));
    renderWorkers();
    closeForm();
});


function renderWorkers() {
    workersBox.innerHTML = "";
    workers.forEach(worker => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <img src="${worker.image}" onerror="this.src='image.png'">
            <div>
                <h4>${worker.name}</h4>
                <p>${worker.role}</p>
            </div>
            <div>
                <button type="button" class="profilBtn">Profil</button>
            </div>
        `;
        card.querySelector(".profilBtn").addEventListener("click", () => showProfile(worker));
        workersBox.appendChild(card);
    });
}

function showProfile(worker) {
    let modalHTML = `
        <div id="profileModal" class="modal">
            <div class="modal-content">
                <img src="${worker.image}"  alt="">
                <h2>${worker.name}</h2>
                <p><strong>Email:</strong> ${worker.email}</p>
                <p><strong>Phone:</strong> ${worker.phone}</p>
                <p><strong>Role:</strong> ${worker.role}</p>
                <h3>Experiences</h3>
                <div id="profileExperiences">
                    ${worker.experiences.length === 0 ? "<p>Aucune expérience</p>" : worker.experiences.map(exp => `
                        <div class="exp-card">
                            <p><strong>Company:</strong> ${exp.company}</p>
                            <p><strong>Role:</strong> ${exp.role}</p>
                            <p><strong>From:</strong> ${exp.from}</p>
                            <p><strong>To:</strong> ${exp.to}</p>
                            <hr>
                        </div>
                    `).join("")}
                </div>
                <button id="closeProfile">Close</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
    document.getElementById("closeProfile").addEventListener("click", () => {
        document.getElementById("profileModal").remove();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderWorkers();

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
