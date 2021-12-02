// CLASSES
class App {
    static start() {
        // Add event listeners.
        document.querySelector(".login").addEventListener("click", () => {
            firebase.auth().signInWithPopup(provider);
        });
        document.querySelector(".logout").addEventListener("click", () => {
            firebase.auth().signOut().then(() => {
                Library.clear();
            }).catch(error => console.log(error));  
        });
        Menu.addListeners();
        Form.addListeners();
    }
}


class Library {
    static load(books) {
        // Gets books list as argument from firebase, and displays them.
        for (const bookID in books) this.#addRow(books[bookID], bookID);
        this.#updateView();
    }

    static clear() {
        const table = document.querySelector("tbody");
        while (table.firstChild) table.removeChild(table.firstChild);
        this.selectedBook = null;
        Menu.fold();
        Form.hide();
        this.#updateView();
    }

    static #updateView() {
        // Don't show table if there is no content, otherwise apply appropriate styles.
        const rows = document.querySelector("tbody").childElementCount;
        if (rows) {
            document.querySelector("main").style.justifyContent = "normal";
            document.getElementById("books-list").classList.remove("hidden");
            Menu.node.style.alignSelf = "flex-end";
            Menu.node.querySelector(".success").classList.remove("button-large");
        } else {
            document.querySelector("main").style.justifyContent = "center";
            document.getElementById("books-list").classList.add("hidden");
            Menu.node.style.alignSelf = "center";
            Menu.node.querySelector(".success").classList.add("button-large");
        }
    }

    static addBook(title, author, pages, read) {
        const book = new Book(title, author, pages, read);
        const bookRef = database.ref(`users/${App.user.uid}`).push(book);
        this.#addRow(book, bookRef.key);
        this.#updateView();
    }

    static deleteBook() {
        database.ref(`users/${App.user.uid}/${this.selectedBook.dataset.id}`).remove();
        this.selectedBook.remove();
        Menu.fold();
        this.#updateView();
    }

    static editBook(title, author, pages, read) {
        const book = new Book(title, author, pages, read);
        database.ref(`users/${App.user.uid}/${this.selectedBook.dataset.id}`).set(book);
        [title, author, pages].forEach((text, index) => {
            this.selectedBook.children[index].innerText = text}
        );
        if (read) this.selectedBook.classList.add("read");
        else this.selectedBook.classList.remove("read");
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
        });

        // Select listener.
        row.addEventListener("click", () => {
            if (this.selectedBook) {
                this.selectedBook.classList.remove("selected");
                if (this.selectedBook.dataset.id === row.dataset.id) {
                    this.selectedBook = null;
                    Menu.fold();
                    return;
                }
            }
            row.classList.add("selected");
            this.selectedBook = row;
            // If any of book is clicked, while editing, change the form contents.
            if (!Form.node.classList.contains("hidden") && Form.mode === "edit") Form.fill();
            Menu.expand();
        });
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


class Menu {
    static node = document.getElementById("menu");
    static #addButton = this.node.querySelector(".success");
    static #editButton = this.node.querySelector(".info");
    static #deleteButton = this.node.querySelector(".warning");

    static expand() {
        this.#editButton.style.display = "flex";
        this.#deleteButton.style.display = "flex";
    }

    static fold() {
        this.#editButton.style.display = "none";
        this.#deleteButton.style.display = "none";
    }

    static addListeners() {
        this.#addButton.addEventListener("click", e => Form.show(e));
        this.#deleteButton.addEventListener("click", () => Library.deleteBook());
        this.#editButton.addEventListener("click", e => {
            Form.fill();
            Form.show(e);
        });
    }
}


class Form {
    static node = document.querySelector("form");
    static #inputs = Array.from(this.node.querySelectorAll("input[type='text']"));
    static #validationWarning = document.getElementById("validation-warning");

    static addListeners() {
        // Inputs styling.
        this.#inputs.forEach(input => {
            input.style.fontSize = "0.7rem";
            input.addEventListener("focusin", e => {
                input.previousElementSibling.style.fontSize = "0.7rem";
                input.style.fontSize = "1rem";
            });
            input.addEventListener("focusout", e => {
                if (!input.value) {
                    input.previousElementSibling.style.fontSize = "1rem";
                    input.style.fontSize = "0.7rem";
                }
            });
        });

        // Input validation.
        this.#inputs.forEach(input => {
            input.addEventListener("input", e => this.#validateInput(input));
        });

        // Cancel button.
        this.node.querySelector(".warning").addEventListener("click", () => this.hide());

        // Form submit.
        this.node.addEventListener("submit", e => {
            e.preventDefault();
            // Validate text inputs.
            if(!this.#inputs.map(input => this.#validateInput(input))
                            .reduce((accumulator, currentValue) => accumulator && currentValue)) 
                return;
            
            const title = this.node.elements[0].value;
            const author = this.node.elements[1].value;
            const pages = this.node.elements[2].value;
            const read = this.node.elements[3].checked;
    
            if (this.mode === "add") 
                Library.addBook(title, author, pages, read);
            else if (this.mode === "edit") {
                if (!Library.selectedBook) return;
                Library.editBook(title, author, pages, read);
            }
                
            this.hide();
        });
    }

    static show(e) {
        Menu.node.classList.add("hidden");
        this.node.classList.remove("hidden");
        this.mode = e.srcElement.innerText;
    }

    static hide() {
        this.node.classList.add("hidden");
        Menu.node.classList.remove("hidden");
        this.node.reset();
        // Reset input styles.
        this.#inputs.forEach(input => {
            input.classList.remove("invalid");
            input.previousElementSibling.style.fontSize = "1rem";
            input.style.fontSize = "0.7rem";
            this.#validationWarning.style.visibility = "hidden";
        });
    }

    static fill() {
        const book = Library.selectedBook;
        this.#inputs.forEach((input, index) => {
            input.previousElementSibling.style.fontSize = "0.7rem";
            input.style.fontSize = "1rem";
            input.value = book.children[index].innerText;
        });
        this.node.querySelector(".checkbox-read input").checked = book.classList.contains("read");
    }

    static #validateInput(input) {
        const patterns = {
            title: /^[\p{L}\d,:\-']+$/u,
            author: /^[\p{L}\.\-,']+$/u,
            pages: /^\d+$/
        }

        let text = input.value.replaceAll(/\s\s*/g, " ");
        if (patterns[input.id].test(text.replaceAll(/\s/g, ""))) {
            input.classList.remove("invalid");
            for (let i = 0; i < this.#inputs.length; i++) 
                if (this.#inputs[i].classList.contains("invalid")) return true;
            this.#validationWarning.style.visibility = "hidden";
            return true;
        } else {
            input.classList.add("invalid");
            this.#validationWarning.style.visibility = "visible";
            return false;
        } 
    }
}


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
    App.user = user;
    if (user) {
        // Log in.
        // Show / hide components.
        document.querySelector(".login").classList.add("hidden");
        document.querySelector(".logout").classList.remove("hidden");
        // Update header styles.
        document.querySelector("header").style.justifyContent = "space-between";
        // Load database.
        database.ref().child("users").child(user.uid).get().then(snapshot => {
            if (snapshot.exists()) Library.load(snapshot.val());
            document.getElementById("menu").classList.remove("hidden");
        });
    } else {
        // Log out.
        // Show / hide components.
        document.querySelector(".login").classList.remove("hidden");
        document.querySelector(".logout").classList.add("hidden");
        document.getElementById("menu").classList.add("hidden");
        // Update header styles.
        document.querySelector("header").style.justifyContent = "flex-end";   
    }
});

App.start();