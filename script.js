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

function closeForm() {
    formSection.style.display = "none";
    form.reset();
    image.src = "image.png";
    form.querySelectorAll("input, select").forEach(i => i.style.border = "1px solid #ccc");
    form.querySelectorAll(".errorSpan").forEach(span => span.textContent = "");
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
        Existe: false,
        experiences
    };

    workers.push(worker);
    localStorage.setItem("workers", JSON.stringify(workers));
    renderWorkers();
    closeForm();
});

function renderWorkers() {
    workersBox.innerHTML = "";
    workers.forEach((worker, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <img src="${worker.image}" onerror="this.src='image.png'">
            <div class ="nameBox">
                <h4>${worker.name}</h4>
                <p>${worker.role}</p>
            </div>
            <div class="boxBtn">
                <button type="button" class="editBtn">Modifier</button>
                <button type="button" class="profilBtn">Profil</button>
            </div>
        `;
        card.querySelector(".profilBtn").addEventListener("click", () => showProfile(worker));
        card.querySelector(".editBtn").addEventListener("click", () => {
            formSection.style.display = "flex";
            form.name.value = worker.name;
            form.email.value = worker.email;
            form.phone.value = worker.phone;
            form.role.value = worker.role;
            form.url.value = worker.image;
            image.src = worker.image;

            experiencesContainer.innerHTML = "";
            worker.experiences.forEach(exp => {
                const block = document.createElement("div");
                block.classList.add("experience-block");
                block.innerHTML = `
                    <label>Company :</label>
                    <input type="text" name="company" value="${exp.company}">
                    <label>Role :</label>
                    <select required>
                        <option value="Receptionist" ${exp.role == "Receptionist" ? "selected" : ""}>Receptionist</option>
                        <option value="It guy" ${exp.role == "It guy" ? "selected" : ""}>It guy</option>
                        <option value="cleaning" ${exp.role == "cleaning" ? "selected" : ""}>Cleaning</option>
                        <option value="other" ${exp.role == "other" ? "selected" : ""}>Other</option>
                    </select>
                    <label>From :</label>
                    <input type="date" name="from" value="${exp.from}">
                    <label>To :</label>
                    <input type="date" name="to" value="${exp.to}">
                    <button type="button" class="deleteExp">Remove</button>
                `;
                experiencesContainer.appendChild(block);
                block.querySelector(".deleteExp").addEventListener("click", () => block.remove());
            });

            form.onsubmit = function (e) {
                e.preventDefault();
                if (!validateForm()) return;

                const updatedExperiences = [];
                document.querySelectorAll(".experience-block").forEach(exp => {
                    updatedExperiences.push({
                        company: exp.querySelector("input[name='company']").value,
                        role: exp.querySelector("select").value,
                        from: exp.querySelector("input[name='from']").value,
                        to: exp.querySelector("input[name='to']").value
                    });
                });

                workers[index] = {
                    name: form.name.value,
                    email: form.email.value,
                    phone: form.phone.value,
                    role: form.role.value,
                    image: form.url.value,
                    experiences: updatedExperiences
                };
                localStorage.setItem("workers", JSON.stringify(workers));
                renderWorkers();
                closeForm();
                form.onsubmit = defaultSubmit;
            }
        });
        workersBox.appendChild(card);
    });
}

const defaultSubmit = form.onsubmit;

function showProfile(worker) {
    let modalHTML = `
        <div id="profileModal" class="modal">
            <div class="modal-content">
                <img src="${worker.image}" alt="">
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

closeSelectBtn.addEventListener("click", () => WorkerZone.style.display = "flex");
closeSelectBtn.addEventListener("click", () => WorkerZone.style.display = "none");
buttons.forEach(button => {
    button.addEventListener('click', () => {
        WorkerZone.style.display = "flex";
        workerszone();

    });
})

function workerszone() {
    const roomsRoles = {
        conférence: ["Cleaning", "Manager", "Other"],
        serveurs: ["It guy", "Manager", "Cleaning"],
        sécurité: ["security", "Manager", "Cleaning"],
        Réception: ["Receptionist", "Cleaning", "Manager"],
        personnel: ["Cleaning", "Manager", "Other"],
        archives: ["Manager", "Other"]
    };
    let workers = JSON.parse(localStorage.getItem("workers")) || [];
    const displayWorkers = document.getElementById("displayWorkers")
    
    buttons.forEach(button => {
        
        button.addEventListener("click", () => {
            displayWorkers.innerHTML = ""
            const nameRoom = button.getAttribute("data-room")
            console.log(nameRoom)
            workers.forEach(worker => {
                const workerRole = worker.role
                console.log(workerRole)
                if (roomsRoles[nameRoom].includes(workerRole)) {
                    displayWorkers.innerHTML += `
                       
                        <div class="cardAffichage" style="display:flex; overflow:auto">
        <img src="${worker.image}" onerror="this.src='image.png'">
            <div class ="nameBox">
                <h4>${worker.name}</h4>
                <p>${worker.role}</p>
            </div>
    </div>
                    
                    `
                    WorkersRomm(button,worker)
                }
            })
        })
    })


}
function WorkersRomm(button,worker){
    let workers = JSON.parse(localStorage.getItem("workers")) || [];
    const cardAffichage = document.querySelectorAll(".cardAffichage")

    cardAffichage.forEach(card => {
        card.addEventListener("click",()=>{
            const placeRoom = button.parentElement
            placeRoom.innerHTML += `
                <div class="cardAffichage" style="display:flex; overflow:auto">
        <img src="${worker.image}" onerror="this.src='image.png'">
            <div class ="nameBox">
                <h4>${worker.name}</h4>
                <p>${worker.role}</p>
            </div>
    </div>
            `
        })
    })
}
document.addEventListener("DOMContentLoaded", () => {
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
