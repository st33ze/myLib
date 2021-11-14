// CLASSES

class Library {
    constructor() {
        // this.node = document.getElementById("books-list");
    }
    
    static load(books) {
        // Gets books list as argument from firebase, and displays them.
        for (const bookID in books) this.#addRow(books[bookID], bookID);
        this.#updateView();
    }

    static clear() {
        const table = document.querySelector("tbody");
        while (table.firstChild) table.removeChild(table.firstChild);
        this.#updateView();

    }

    static #updateView() {
        // Don't show if no rows, else apply appropriate styles.
        const rows = document.querySelector("tbody").childElementCount;
        if (rows) {
            document.querySelector("main").style.justifyContent = "normal";
            document.getElementById("books-list").classList.remove("hidden");
        } else {
            document.querySelector("main").style.justifyContent = "center";
            document.getElementById("books-list").classList.add("hidden");
        }
    }

    static #addRow(book, id) {
        const row = document.querySelector("tbody").insertRow();
        row.className = "book";
        if (book.read) row.classList.add("read");
        row.dataset.id = id;

        [book.title, book.author, book.pages].forEach(property => {
            let cell = row.insertCell();
            let text = document.createTextNode(property);
            cell.appendChild(text);
        })

        // Select listener.
        row.addEventListener("click", () => {
            if (this.selectedBook) {
                this.selectedBook.classList.remove("selected");
                if (this.selectedBook.dataset.id === row.dataset.id) {
                    this.selectedBook = null;
                    // this.parent.menu.hide();
                    return;
                }
            }
            row.classList.add("selected");
            this.selectedBook = row;
            // if (this.parent.form.visible && this.parent.form.mode === "edit") this.parent.form.fill();
            // this.parent.menu.show();
        })
    }
    
}


class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }
}







// const app = new App();
// function App() {
//     // Components
//     this.loginButton = document.querySelector(".login");
//     this.logoutButton = document.querySelector(".logout");
//     this.library = new Library(this);
//     this.menu = new Menu(this);
//     this.form = new Form(this);
//     this.library.updateView();

//     this.showLoggedInComponents = function() {
//         this.showComponent(this.loginButton, false);
//         [this.logoutButton, this.menu].forEach(component => this.showComponent(component, true));

//         document.querySelector("header").style.justifyContent = "space-between";
//     }

//     this.showLoggedOutComponents = function() {
//         const loggedInComponents = [this.logoutButton, this.library, this.menu, this.form];
//         loggedInComponents.forEach(component => this.showComponent(component, false));
//         this.showComponent(this.loginButton, true);

//         document.querySelector("header").style.justifyContent = "flex-end";
//     } 

//     this.showComponent = function(component, show) {
//         if (component.node) {
//             show ? component.visible = true: component.visible = false;
//             component = component.node;
//         }
//         show ? component.classList.remove("hidden") : component.classList.add("hidden");
//     }

//     // Event listeners.
//     this.loginButton.addEventListener("click", () => firebase.auth().signInWithPopup(provider));

//     this.logoutButton.addEventListener("click", () => {
//         firebase.auth().signOut().then(() => {
//             app.library.clear();
//             app.library.updateView();
//         }).catch(error => console.log(error));  
//     });
// }

// function Library(parent) {
//     this.parent = parent;
//     this.node = document.getElementById("books-list");

//     this.display = function(books) {
//         for (bookID in books) this.addRow(books[bookID], bookID);
//         this.updateView();
//     }

//     this.clear = function() {
//         const  table = this.node.querySelector("tbody");
//         while (table.firstChild) table.removeChild(table.firstChild);
//         this.selectedBook = null;
//         this.parent.menu.hide();
//     }

//     this.updateView = function() {
//         const rows = this.node.querySelector("tbody").childElementCount;
//         if (rows && !this.visible) {
//             document.querySelector("main").style.justifyContent = "normal";
//             this.parent.showComponent(this, true);
//             this.parent.menu.node.style.alignSelf = "flex-end";
//             this.parent.menu.addButton.classList.remove("button-large");
//         } else if (!rows && this.visible) {
//             document.querySelector("main").style.justifyContent = "center";
//             this.parent.showComponent(this, false);
//             this.parent.menu.node.style.alignSelf = "center";
//             this.parent.menu.addButton.classList.add("button-large");
//         }
//     }

//     this.addBook = function(title, author, pages, read) {
//         const book = new Book(title, author, pages, read);
//         const bookRef = database.ref(`users/${this.parent.user.uid}`).push(book);
//         this.addRow(book, bookRef.key);
//         this.updateView();
//     }

//     this.addRow = function(book, id) {
//         const row = this.node.querySelector("tbody").insertRow();
//         row.className = "book";
//         if (book.read) row.classList.add("read");
//         row.dataset.id = id;

//         [book.title, book.author, book.pages].forEach(property => {
//             let cell = row.insertCell();
//             let text = document.createTextNode(property);
//             cell.appendChild(text);
//         })

//         // Book select listener.
//         row.addEventListener("click", () => {
//             if (this.selectedBook) {
//                 this.selectedBook.classList.remove("selected");
//                 if (this.selectedBook.dataset.id === row.dataset.id) {
//                     this.selectedBook = null;
//                     this.parent.menu.hide();
//                     return;
//                 }
//             }
            
//             row.classList.add("selected");
//             this.selectedBook = row;
//             if (this.parent.form.visible && this.parent.form.mode === "edit") this.parent.form.fill();
//             this.parent.menu.show();
//         })
//     }

//     this.editBook = function(title, author, pages, read) {
//         const book = new Book(title, author, pages, read);
//         database.ref(`users/${this.parent.user.uid}/${this.selectedBook.dataset.id}`).set(book);
//         [title, author, pages].forEach((text, index) => this.selectedBook.children[index].innerText = text);
//         if (read) this.selectedBook.classList.add("read");
//         else this.selectedBook.classList.remove("read");
//     }

//     this.deleteBook = function() {
//         database.ref(`users/${this.parent.user.uid}/${this.selectedBook.dataset.id}`).remove();
//         this.selectedBook.remove();
//         this.parent.menu.hide();
//         this.updateView();
//     }
// }

// function Book(title, author, pages, read) {
//     this.title = title;
//     this.author = author;
//     this.pages = pages;
//     this.read = read;
// }

// function Menu(parent) {
//     this.parent = parent;
//     this.node = document.getElementById("menu");
//     this.addButton = this.node.querySelector(".success");
//     this.editButton = this.node.querySelector(".info");
//     this.deleteButton = this.node.querySelector(".warning");

//     this.show = function() {
//         this.editButton.style.display = "flex";
//         this.deleteButton.style.display = "flex";
//     }

//     this.hide = function() {
//         this.editButton.style.display = "none";
//         this.deleteButton.style.display = "none";
//     }

//     // Event listeners.
//     this.addButton.addEventListener("click", e => this.parent.form.show(e));
//     this.deleteButton.addEventListener("click", () => this.parent.library.deleteBook());   
//     this.editButton.addEventListener("click", e => {
//         this.parent.form.fill();
//         this.parent.form.show(e);
//     });
    
// }

// function Form(parent) {
//     this.parent = parent;
//     this.node = document.querySelector("form");
//     this.visible = false;
//     // Components.
//     this.inputs = Array.from(this.node.querySelectorAll("input[type='text']"));
//     this.checkbox = this.node.querySelector(".checkbox-read input");
//     this.saveButton = this.node.querySelector(".success");
//     this.cancelButton = this.node.querySelector(".warning");
//     this.validationWarning = document.getElementById("validation-warning");

//     // Inputs styling.
//     this.inputs.forEach(input => {
//         input.style.fontSize = "0.7rem";
//         input.addEventListener("focusin", e => {
//             input.previousElementSibling.style.fontSize = "0.7rem";
//             input.style.fontSize = "1rem";
//         })
//         input.addEventListener("focusout", e => {
//             if (!input.value) {
//                 input.previousElementSibling.style.fontSize = "1rem";
//                 input.style.fontSize = "0.7rem";
//             }
//         })
//     })

//     // Event listeners.
//     this.cancelButton.addEventListener("click", () => this.hide());

//     this.inputs.forEach(input => {
//         input.addEventListener("input", e => this.validateInput(input));
//     });
    
//     this.node.addEventListener("submit", e => {
//         e.preventDefault();
//         // Validate text inputs.
//         if(!this.inputs.map(input => this.validateInput(input))
//                        .reduce((accumulator, currentValue) => accumulator && currentValue)) 
//             return;
        
//         const title = this.node.elements[0].value;
//         const author = this.node.elements[1].value;
//         const pages = this.node.elements[2].value;
//         const read = this.node.elements[3].checked;

//         if (this.mode === "add") this.parent.library.addBook(title, author, pages, read);
//         else if (this.mode === "edit") this.parent.library.editBook(title, author, pages, read);
         
//         this.hide();
//     })

//     // Other functions.
//     this.show = function(e) {
//         this.parent.showComponent(this.parent.menu, false);
//         this.parent.showComponent(this, true);
//         this.mode = e.srcElement.innerText;
//     }

//     this.hide = function() {
//         this.parent.showComponent(this, false);
//         this.parent.showComponent(this.parent.menu, true);
//         this.node.reset();
//         // Reset inputs styles.
//         this.inputs.forEach(input => {
//             input.classList.remove("invalid");
//             input.previousElementSibling.style.fontSize = "1rem";
//             input.style.fontSize = "0.7rem";
//             this.validationWarning.style.visibility = "hidden";
//         })
//     }

//     this.fill = function() {
//         const book = this.parent.library.selectedBook;
//         this.inputs.forEach((input, index) => {
//             input.previousElementSibling.style.fontSize = "0.7rem";
//             input.style.fontSize = "1rem";
//             input.value = book.children[index].innerText;
//         })
//         this.checkbox.checked = book.classList.contains("read");
//     }

//     this.validateInput = function(input) {
//         const patterns = {
//             title: /^[\p{L}\d,:\-']+$/u,
//             author: /^[\p{L}\.\-']+$/u,
//             pages: /^\d+$/
//         }

//         let text = input.value.replaceAll(/\s\s*/g, " ");
//         if (patterns[input.id].test(text.replaceAll(/\s/g, ""))) {
//             input.classList.remove("invalid");
//             for (let i = 0; i < this.inputs.length; i++) 
//                 if (this.inputs[i].classList.contains("invalid")) return true;
//             this.validationWarning.style.visibility = "hidden";
//             return true;
//         } else {
//             input.classList.add("invalid");
//             this.validationWarning.style.visibility = "visible";
//             return false;
//         } 
//     }
// }


// Initialize Firebase.
const firebaseConfig = {
    apiKey: "AIzaSyAbBsL1v4wVaxC76GW947KFwyKaejv4Xzk",
    authDomain: "library-45465.firebaseapp.com",
    projectId: "library-45465",
    storageBucket: "library-45465.appspot.com",
    messagingSenderId: "576876775408",
    appId: "1:576876775408:web:e9a269eef36814b804bf35",
    measurementId: "G-HW2BGF3GP5"
}
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Firebase Authentication.
const provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().useDeviceLanguage();
firebase.auth().onAuthStateChanged(user => {
    // app.user = user;
    if (user) {
        login();
        database.ref().child("users").child(user.uid).get().then(snapshot => {
            if (snapshot.exists()) Library.load(snapshot.val());
        })
    } else logout();
});

// Login, Logout event listeners.
document.querySelector(".login").addEventListener("click", () => {
    firebase.auth().signInWithPopup(provider)
});

document.querySelector(".logout").addEventListener("click", () => {
    firebase.auth().signOut().then(() => {
        Library.clear();
    }).catch(error => console.log(error));  
});


function login() {
    // Show / hide components.
    document.querySelector(".login").classList.add("hidden");
    document.querySelector(".logout").classList.remove("hidden");
    // Update header styles.
    document.querySelector("header").style.justifyContent = "space-between";
}

function logout() {
    // Show / hide components.
    document.querySelector(".login").classList.remove("hidden");
    document.querySelector(".logout").classList.add("hidden");
    // Update header styles.
    document.querySelector("header").style.justifyContent = "flex-end";
}