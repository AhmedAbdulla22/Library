let myLibrary = JSON.parse(localStorage.getItem("books")) || [];

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

Book.prototype.toggleStatus = function () {
    this.status = !this.status;
};

//add sample books
const book1 = new Book("The Pragmatic Programmer", "Andrew Hunt", 352, 120, true);
const book2 = new Book("Clean Code", "Robert C. Martin", 464, 80, false);
const book3 = new Book("You Don’t Know JS", "Kyle Simpson", 278, 0, false);
const book4 = new Book("Atomic Habits", "James Clear", 320, 100, true);

myLibrary.push(book1, book2, book3, book4);

// -- show all books --
const libraryContainer = document.querySelector('.library-container');

function showBooks() {
    libraryContainer.innerHTML = ""; // clean UI

    myLibrary.forEach((book) => {
        const newBookCard = document.createElement("div");
        newBookCard.setAttribute("book-id",book.id);
        newBookCard.classList.add("book-container");
        newBookCard.innerHTML = `
        <button class="delete-button btn" book-id="${book.id}">X</button>
        <div class="book-header">
            <h2 class="title">${book.title}</h2>        
        </div>
        <div class="book-inforamtion">
            <p class="author">Author: <span>${book.author}</span></p>
            <p>Pages: <span contenteditable="true">${book.pages_read}</span> /
                      <span contenteditable="true">${book.total_pages}</span></p>
          </div>
          <div class="button-container">
            <button class="edit-button btn" book-id="${book.id}">Edit</button>
            <button class="status-button btn ${book.status ? "completed":""}" book-id="${book.id}">${book.status ? "Completed":"Ongoing"}</button>
          </div>`;
        libraryContainer.appendChild(newBookCard);
    });

    const deleteButtons = libraryContainer.querySelectorAll(".delete-button");
    deleteButtons.forEach((btnDelete) => {
        btnDelete.addEventListener("click",(e) => {
            myLibrary = myLibrary.filter((book) => {
                return book.id !== btnDelete.getAttribute("book-id");
            })

            //update
            updateLibrary();
            showBooks();
        })
    })

    const editButtons = libraryContainer.querySelectorAll(".edit-button");
    editButtons.forEach((btnEdit) => {
        btnEdit.addEventListener("click",(e) => {
            let book;
             myLibrary.forEach((item) => 
                {
                    if(item.id === btnEdit.getAttribute("book-id")) {
                        book = item;
                    }
                }
            );
            openBookDialog(true,book);

            //update
            updateLibrary();
            showBooks();
        })
    })
    
    const statusButtons = libraryContainer.querySelectorAll(".status-button");
    statusButtons.forEach((btnStatus) => {
        btnStatus.addEventListener("click",(e) => {
            let bookId = btnStatus.getAttribute("book-id");

            //update
            changeStatus(bookId);
        })
    })


}

showBooks();

function openBookDialog(modify = false, book = null) {
    const container = document.querySelector(".container");
    const dialogBox = document.createElement("dialog");
    const classAndId = (modify) ? "modify-book-dialog":"add-book-dialog";
    dialogBox.classList.add(classAndId);
    dialogBox.setAttribute("id",classAndId);
    dialogBox.innerHTML = `<form method="dialog" class="new-book-form">
    <div class="dialog-header">
    <h2>${modify ? "Update The Book":"Add New Book"}</h2>
    <button class="close-button" >x</button>
    </div>
    
    <div class="form-body">
    <div class="form-field">
    <label for="title">Title:</label>
    <input id="title" type="text" name="title" required value="${book ? book.title : ""}">
    </div>
    
    <div class="form-field">
    <label for="author">Author:</label>
    <input id="author" type="text" name="author" required value="${book ? book.author : ""}">
    </div>

            <div class="form-field-group">
            <div class="form-field">
            <label for="total-page">Total Page:</label>
            <input id="total-page" type="number" name="total-page" min="0" value="${book ? book.total_pages : ""}">
            </div>
            
            <div class="form-field">
            <label for="completed-page">Pages Read:</label>
            <input id="completed-page" type="number" name="completed-page" min="0" value="${book ? book.pages_read : ""}">
            </div>
            </div>
            
            <div class="form-field checkbox-field">
            <input id="status" type="checkbox" name="status" ${book?.status ? "checked":""}>
            <label for="status">Have you finished this book?</label>
            </div>
            <div class="dialog-actions">
            <button class="btn btn-primary" type="submit">${modify ? "Edit":"Add"} Book</button>
              <button class="btn btn-secondary" type="button" formnovalidate>Cancel</button>
              </div>
              </div>
              </form>`;
            
            // add dialog to DOM
            container.appendChild(dialogBox);

            const closeButtons = document.querySelectorAll('.close-button, .btn-secondary');
            closeButtons.forEach((btn) => {
                btn.addEventListener('click',(e) => {
                    closeBookDialog(modify);
                })
            })

            if (modify) {
                const addBookButton = document.querySelector(".btn-primary");
                addBookButton.addEventListener("click",(e) => {
                    modifyBook(book.id);
                })
            } else {
                const addBookButton = document.querySelector(".btn-primary");
                addBookButton.addEventListener("click",(e) => {
                    addNewBook();
                })
            }
            
            
            
            dialogBox.showModal();
              
}

function closeBookDialog(modify = false) {
    const container = document.querySelector(".container");
    const dialogBox = document.querySelector(modify ? ".modify-book-dialog":".add-book-dialog");
    
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

            updateLibrary();
            closeBookDialog();
            showBooks();
        })
    }
}

function modifyBook(bookId) {
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

            myLibrary.forEach((book) => {
                if (book.id === bookId) {
                    book.title = title;
                    book.author = author;
                    book.total_pages = total_pages;
                    book.pages_read = completedPages;
                    book.status = status;
                }
            })

            updateLibrary();
            closeBookDialog(true);
            showBooks();
        })
    }
}


function updateLibrary() {
    //save to localStorage
    localStorage.setItem("books",JSON.stringify(myLibrary));
}

function changeStatus(bookId) {
    myLibrary.forEach((book) => {
        if (book.id === bookId) {
            console.log(book);
            book.toggleStatus();
        }
    })

    updateLibrary();
    showBooks();
}