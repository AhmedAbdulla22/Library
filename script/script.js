const myLibrary = [{id:"1234-2324-3fs4-2d54",name:"the book",pages:453,status:false}];

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
