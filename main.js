const books = []
const RENDER_EVENT = 'render-books'

function addBook() {
  const title = document.getElementById('inputBookTitle').value
  const author = document.getElementById('inputBookAuthor').value
  const statusBooks = document.getElementById('inputBookIsComplete').checked
  const tahun = document.getElementById('inputBookYear').value
  const generetedID = genereteId()

  const dataBooks = genereteDataBooks(
    generetedID,
    title,
    author,
    tahun,
    statusBooks
  )
  books.push(dataBooks)
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
}

function genereteId() {
  return +new Date()
}

function genereteDataBooks(id, title, author, tahun, isCompleted) {
  return {
    id,
    title,
    author,
    tahun,
    isCompleted,
  }
}

function makeBooks(dataBooks) {
  const id = dataBooks.id

  const book_items = document.createElement('article')
  book_items.classList.add('book_item')
  book_items.setAttribute('id', id)

  const titleBook = document.createElement('h3')
  titleBook.innerText = dataBooks.title

  const authorBook = document.createElement('p')
  authorBook.innerText = `Penulis: ${dataBooks.author}`

  const yearsBook = document.createElement('p')
  yearsBook.innerText = `Tahun: ${dataBooks.tahun}`

  const action = document.createElement('div')
  action.classList.add('action')

  const statusBtn = document.createElement('button')
  statusBtn.classList.add('green')

  if (dataBooks.isCompleted) {
    statusBtn.innerText = `Belum selesai dibaca`
    statusBtn.addEventListener('click', function () {
      moveBooksToInCompleted(dataBooks.id)
    })
  } else {
    statusBtn.innerText = `Selesai Dibaca`
    statusBtn.addEventListener('click', function () {
      moveBooksToCompleted(dataBooks.id)
    })
  }

  const trashBookBtn = document.createElement('button')
  trashBookBtn.innerText = `Hapus Buku`
  trashBookBtn.classList.add('red')
  trashBookBtn.addEventListener('click', function () {
    removeBookList(dataBooks.id)
  })

  action.append(statusBtn, trashBookBtn)
  book_items.append(titleBook, authorBook, yearsBook, action)
  return book_items
}

document.addEventListener(RENDER_EVENT, () => {
  const completedBooksBox = document.getElementById('completeBookshelfList')
  const inCompletedBooksBox = document.getElementById('incompleteBookshelfList')
  completedBooksBox.innerHTML = ''
  inCompletedBooksBox.innerHTML = ''

  for (const book of books) {
    book.isCompleted
      ? completedBooksBox.append(makeBooks(book))
      : inCompletedBooksBox.append(makeBooks(book))
  }
})

function findBook(bookId) {
  for (const book of books) {
    if (book.id === bookId) return book
  }
  return null
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) return index
  }

  return -1
}

function moveBooksToCompleted(bookId) {
  const bookTarget = findBook(bookId)
  if (bookTarget == null) return

  bookTarget.isCompleted = true
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
}

function moveBooksToInCompleted(bookId) {
  const bookTarget = findBook(bookId)
  if (bookTarget == null) return

  bookTarget.isCompleted = false
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
}

function removeBookList(bookId) {
  const bookTarget = findBookIndex(bookId)

  if (bookTarget == -1) return

  books.splice(bookTarget, 1)
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData()
}

document.addEventListener('DOMContentLoaded', () => {
  const formBooks = document.getElementById('inputBook')
  formBooks.addEventListener('submit', (e) => {
    e.preventDefault()
    addBook()
  })

  if (isStorageExist()) {
    loadDataFromStorage()
  }

  const formSearchBook = document.getElementById('searchBook')
  formSearchBook.addEventListener('submit', (e) => {
    e.preventDefault()
    searchBook()
  })
})

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books)
    localStorage.setItem(STORAGE_KEY, parsed)
    document.dispatchEvent(new Event(SAVED_EVENT))
  }
}

const STORAGE_KEY = 'BOOKS_DATA'
const SAVED_EVENT = 'saved-book'

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert('Browser tidak mendukung local storage')
    return false
  }

  return true
}

function loadDataFromStorage() {
  const getDataBook = localStorage.getItem(STORAGE_KEY)
  let data = JSON.parse(getDataBook)

  if (data !== null) {
    for (const book of data) {
      books.push(book)
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT))
}

function searchBook() {
  const searchInput = document
    .getElementById('searchBookTitle')
    .value.toLowerCase()

  const searchResult = []

  for (const book of books) {
    const bookTitle = book.title.toLowerCase()

    if (bookTitle.includes(searchInput)) {
      searchResult.push(book)
    }
  }

  displaySearchResults(searchResult)
}

function displaySearchResults(results) {
  const inCompletedBooksBox = document.getElementById('incompleteBookshelfList')
  const completedBooksBox = document.getElementById('completeBookshelfList')

  inCompletedBooksBox.innerHTML = ''
  completedBooksBox.innerHTML = ''

  if (results.length === 0) {
    inCompletedBooksBox.innerHTML = 'Tidak ada hasil yang ditemukan.'
    completedBooksBox.innerHTML = 'Tidak ada hasil yang ditemukan.'
  } else {
    for (const result of results) {
      const resultItem = makeBooks(result)
      if (result.isCompleted) {
        completedBooksBox.appendChild(resultItem)
      } else {
        inCompletedBooksBox.appendChild(resultItem)
      }
    }
  }
}
