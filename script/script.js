const myLibrary = [
    {
    id:"1234-2324-3fs4-2d54",
    name:"the book of the narnia",
    author: 'hmm',
    total_pages:453,
    pages_read: 53,
    status:false
    },
    {
    id:"1234-2324-33s4-3d54",
    name:"the Cook",
    author: 'voldmort',
    total_pages:413,
    pages_read: 5,
    status:true
    },
];

// data Model Layer
function Book(name,pages,status) {

    if(!new.target) {
        throw Error("You Must include new when create new Obj!");
    }

    this.id = crypto.randomUUID();
    this.name = name;
    this.pages = pages;
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


// -- add new book dialog --
const dialog = document.querySelector('#add-book-dialog');
const showDialogBtn = document.querySelector('#show-dialog-button');
const closeButtons = document.querySelectorAll('.close-button, .btn-secondary');

showDialogBtn.addEventListener("click",(e) => {    
        dialog.showModal();
})

closeButtons.forEach((btn) => {
    btn.addEventListener('click',(e) => {
        dialog.close();
    })
})

// -- show all books --
const libraryContainer = document.querySelector('.library-container');

function showBooks() {
    myLibrary.forEach((book) => {
        const newBookCard = document.createElement("div");
        newBookCard.classList.add("book-container");
        newBookCard.innerHTML = `
        <button id="delete-button" class="btn">X</button>
        <div class="book-header">
            <h2 class="title">${book.name}</h2>        
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

// -- add books --