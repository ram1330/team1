const form = document.querySelector(".form");
const nameInput = document.querySelector(".nameInput");
const phoneInput = document.querySelector(".phoneInput");
const mailInput = document.querySelector(".mailInput");
const addBtn = document.querySelector(".addBtn");
const contactList = document.querySelector(".contactList");
const searchInput = document.querySelector(".search_input");
const select = document.querySelector(".filter_select");
const filterBtns = document.querySelectorAll(".filter_btn");

const state = {
    contacts: []
}

getContact();

function getContact() {
    fetch("http://localhost:8000/contacts")
        .then((response) => response.json())
        .then((data) => {
            state.contacts = data;
            render(state.contacts);
        });
}


function render(contact) {
    contactList.innerHTML = "";
    contact.forEach(el => {
        contactList.insertAdjacentHTML("beforeend", `
        <li data-id="${el.id}">
            <span>${el.name}</span>
            <span>${el.phoneNum}</span>
            <span>${el.mail}</span>
            <button class="btn_remove">Remove</button>
            <button class="edit_btn">Edit</button>
            <div class="hide">
                <input class="edit_name" type="text" value="${el.name}" placeholder="Edit name">
                <input class="edit_num" type="text" value="${el.phoneNum}" placeholder="Edit num">
                <input class="edit_mail" type="text" value="${el.mail}" placeholder="Edit mail">
                <select class="contact_select">
                    <option value="family" ${el.category === 'family' ? 'selected' : ''}>Family</option>
                    <option value="friends" ${el.category === 'friends' ? 'selected' : ''}>Friends</option>
                    <option value="colleagues" ${el.category === 'colleagues' ? 'selected' : ''}>Colleagues</option>
                </select>
                <button class="btn_save">Save</button>
            </div>
        </li>
    `)
    });
}



const addContact = (contact) => {
    fetch("http://localhost:8000/contacts", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(contact)
    })
    .then((response) => response.json())
    .then((data) => {
        state.contacts.push(data);
        render(state.contacts);
    })
    .catch((error) => {
        console.log("Error:", error);
    })
};


const removeContact = (id) => {
    fetch(`http://localhost:8000/contacts/${id}`, {
        method: "DELETE",
    })
    .then(response => response.json())
    .then(data => {
        state.contacts = state.contacts.filter(contact => contact.id !== id);
        render(state.contacts);
    })
    .catch(error => {
        console.log("Error:", error);
    });
};

const edit = (editObj, id) => {
    fetch(`http://localhost:8000/contacts/${id}`, {
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(editObj)
    })
    .then((response) => response.json())
    .then((data) => {
        state.contacts = state.contacts.map(el => {
            if (el.id === id) {
                return data;
            } else {
                return el;
            }
        })
        render(state.contacts);
    })
};


function searchContacts (value) {
    fetch(`http://localhost:8000/contacts?q=${value}`)
    .then(res => res.json())
    .then(data => {
        state.contacts = data;
        render(state.contacts);
    })
};


function filterContacts(status) {
    console.log("test")
    if (status === "family") {
        fetch("http://localhost:8000/contacts?human=family")
        .then(res => res.json())
        .then(data => {
            state.contacts = data;
            render(state.contacts);
        })
    } else if (status === "friends") {
        fetch("http://localhost:8000/contacts?human=friends")
        .then(res => res.json())
        .then(data => {
            state.contacts = data;
            render(state.contacts);
        })
    } else if (status === "colleagues") {
        fetch("http://localhost:8000/contacts?human=colleagues")
        .then(res => res.json())
        .then(data => {
            state.contacts = data;
            render(state.contacts);
        })
    } else {
        fetch("http://localhost:8000/contacts")
        .then(res => res.json())
        .then(data => {
            state.contacts = data;
            render(state.contacts);
        })
    }
}