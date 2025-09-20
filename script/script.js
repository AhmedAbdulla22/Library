const myLibrary = JSON.parse(localStorage.getItem("books")) ||
[
    {
    id:"1234-2324-3fs4-2d54",
    title:"the book of the narnia",
    author: 'hmm',
    total_pages:453,
    pages_read: 53,
    status:false
    },
    {
    id:"1234-2324-33s4-3d54",
    title:"the Cook",
    author: 'voldmort',
    total_pages:413,
    pages_read: 5,
    status:true
    },
];

// data Model Layer
function Book(title,author,total_pages,pages_read,status) {

    if(!new.target) {
        throw Error("You Must include new when create new Obj!");
    }

    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.total_pages = total_pages;
    this.pages_read = pages_read;
    this.status = status;
}

Book.prototype.info = function () {
    let info = this.name + ', ' + this.pages + ' pages' + ', ' + (this.status ? "completed":"not read yet"); 
    return info;
}

function addNewBook(name,pages,status) {
    const newBook = new Book(name,pages,status);
    
    //add new book to the library
    myLibrary.push(newBook);
}

// presentation Layer
function showBooks() {
    myLibrary.forEach((book) => {
        console.log(book);
    })
}

// -- show all books --
const libraryContainer = document.querySelector('.library-container');

function showBooks() {
    libraryContainer.innerHTML = ""; // clean UI

    myLibrary.forEach((book) => {
        const newBookCard = document.createElement("div");
        newBookCard.classList.add("book-container");
        newBookCard.innerHTML = `
        <button id="delete-button" class="btn">X</button>
        <div class="book-header">
            <h2 class="title">${book.title}</h2>        
        </div>
        <div class="book-inforamtion">
            <p class="author">Author: <span>${book.author}</span></p>
            <p>Pages: <span contenteditable="true">${book.pages_read}</span> /
                      <span contenteditable="true">${book.total_pages}</span></p>
          </div>
          <div class="button-container">
            <button id="edit-button" class="btn">Edit</button>
            <button id="status-button" class="btn">Complete</button>
          </div>`;
        libraryContainer.appendChild(newBookCard);
    })
}

showBooks();

function openBookDialog() {
    const container = document.querySelector(".container");
    const dialogBox = document.createElement("dialog");
    dialogBox.classList.add("add-book-dialog");
    dialogBox.setAttribute("id","add-book-dialog");
    dialogBox.innerHTML = `<form method="dialog" class="new-book-form">
    <div class="dialog-header">
    <h2>Add New Book</h2>
    <button class="close-button" >x</button>
    </div>
    
    <div class="form-body">
    <div class="form-field">
    <label for="title">Title:</label>
    <input id="title" type="text" name="title" required>
    </div>
    
    <div class="form-field">
    <label for="author">Author:</label>
    <input id="author" type="text" name="author" required>
    </div>

            <div class="form-field-group">
            <div class="form-field">
            <label for="total-page">Total Page:</label>
            <input id="total-page" type="number" name="total-page" min="0">
            </div>
            
            <div class="form-field">
            <label for="completed-page">Pages Read:</label>
            <input id="completed-page" type="number" name="completed-page" min="0">
            </div>
            </div>
            
            <div class="form-field checkbox-field">
            <input id="status" type="checkbox" name="status">
            <label for="status">Have you finished this book?</label>
            </div>
            <div class="dialog-actions">
            <button class="btn btn-primary" type="submit">Add Book</button>
              <button class="btn btn-secondary" type="button" formnovalidate>Cancel</button>
              </div>
              </div>
              </form>`;
            
            // add dialog to DOM
            container.appendChild(dialogBox);

            const closeButtons = document.querySelectorAll('.close-button, .btn-secondary');
            closeButtons.forEach((btn) => {
                btn.addEventListener('click',(e) => {
                    closeBookDialog();
                })
            })
            
            const addBookButton = document.querySelector(".btn-primary");
            addBookButton.addEventListener("click",(e) => {
                addNewBook();
            })
            
            
            dialogBox.showModal();
              
}

function closeBookDialog() {
    const container = document.querySelector(".container");
    const dialogBox = document.querySelector(".add-book-dialog");
    
    dialogBox.close();
    container.removeChild(dialogBox);
}

// -- add books --
const addNewBookBtn = document.querySelector('#show-dialog-button');
addNewBookBtn.addEventListener("click",(e) => {    
                    openBookDialog();
            })

function addNewBook() {
    const newBookForm = document.querySelector(".new-book-form");

    if (newBookForm) {
        newBookForm.addEventListener("submit",(e) => {
            e.preventDefault();

            //get data
            const title = newBookForm.querySelector("#title").value.trim();
            const author = newBookForm.querySelector("#author").value.trim();
            const total_pages = parseInt(newBookForm.querySelector("#total-page").value,10) || 0;
            const completedPages = parseInt(newBookForm.querySelector("#completed-page").value,10) || 0;
            const status = newBookForm.querySelector("#status").checked;

            const newBook = new Book(
                title,
                author,
                total_pages,
                completedPages,
                status
            )

            myLibrary.push(newBook);
            
            //save to localStorage
            localStorage.setItem("books",JSON.stringify(myLibrary));

            showBooks();
        })
    }
}