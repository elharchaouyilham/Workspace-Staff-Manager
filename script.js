
const addBtn = document.querySelector(".btnAdd button");
const formSection = document.querySelector("section");
const cancelBtn = document.querySelector(".btn-cancel");
const inputUrl = document.getElementById('url');
const image = document.getElementById('image');

let form = document.getElementById("workerForm");
let validationRules = {
    name: {
        regex: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{3,}$/,
        errorMessage: "Invalid Name."
    },
    email: {
        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        errorMessage: "Invalid Email."
    },
    phone: {
        regex: /^(\+?\d{1,3}[- ]?)?\d{9,10}$/,
        errorMessage: "Invalid Phone."
    },
    url: {
        regex: /^(https?:\/\/.*\.)/i,
        errorMessage: "Invalid URL."
    },
    role: {
        regex: /^[A-Za-z\s]+$/,
        errorMessage: "Invalid Role."
    }
};

form.addEventListener('submit', validateFormEnhanced);
let isValid = false
function validateFormEnhanced(event) {
    event.preventDefault();

    let myInputs = form.querySelectorAll('input, select');

    myInputs.forEach(input => {
        let value = input.value.trim();
        let regex = validationRules[input.name] ? validationRules[input.name].regex : null;
        let errorSpan = document.querySelector(`.${input.name}.errorSpan`);

        if (regex && !value.match(regex)) {
            input.style.border = "3px solid red";
            errorSpan.innerText = validationRules[input.name].errorMessage;
            errorSpan.style.color = 'red';
        } else {
            input.style.border = "3px solid green";
            errorSpan.textContent = "";
            isValid = true

        }
    });
    if (isValid) {
        const worker = {
        name: form.name.value,
        role: form.role.value,
        image: form.url.value || "image.png"
    };

        addNewWorker(worker);
        formSection.style.display = "none";
        form.reset();
        image.src = "image.png";
        myInputs.forEach(input => input.style.border = "1px solid #ccc");
    }
}


addBtn.addEventListener("click", () => {
    formSection.style.display = "flex";
});

cancelBtn.addEventListener("click", () => {
    formSection.style.display = "none";
});


formSection.addEventListener("click", e => {
    if (e.target === formSection) formSection.style.display = "none";
});
function addImg() {
    inputUrl.onchange = function () {
        image.src = inputUrl.value;
    }
}

addImg();

function addNewWorker(worker) {
    const addcontainer = document.querySelector(".box_workers");

    const addWorker = document.createElement("div");
    addWorker.classList.add("card");

    addWorker.innerHTML = `
        <img src="${worker.image}">
        <div>
            <h4>${worker.name}</h4>
            <p>${worker.role}</p>
        </div>
        <div>
            <button type="button">edit</button>
        </div>
    `;

    addcontainer.appendChild(addWorker);
}
document.addEventListener("DOMContentLoaded", () => {
    const btnAddExp = document.querySelector(".btnexperience button");
    const container = document.getElementById("experiencesContainer");
    btnAddExp.addEventListener("click", () => {
        const moreexp = document.createElement("div");
        moreexp.classList.add("experience-block");

        moreexp.innerHTML = `
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

        container.appendChild(moreexp);

        moreexp.querySelector(".deleteExp").addEventListener("click", () => {
            moreexp.remove();
        });
    });
});
