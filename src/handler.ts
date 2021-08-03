import database from './database'
import DetailBook from './model/DetailBook'
import BookRequest from './model/BookRequest'
import { Request, ResponseToolkit } from '@hapi/hapi'
import { nanoid } from 'nanoid'

export const addBookHandler = (request: Request, h: ResponseToolkit) => {
  const bookRequest = request.payload as BookRequest
  const finished = bookRequest.pageCount === bookRequest.readPage
  const bookId = nanoid(16)

  const book: DetailBook = {
    ...bookRequest,
    id: bookId,
    finished: finished,
    insertedAt: new Date().toDateString(),
    updatedAt: new Date().toDateString()
  }

  if (!bookRequest.name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    }).code(400)
  }

  if (bookRequest.readPage > bookRequest.pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400)
  }

  database.push(book)

  return h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: { bookId }
  }).code(201)
}

export const getAllBooksHandler = (request: Request) => {
  const { name, finished, reading } = request.query

  let filteredBooks = database

  if (name) {
    filteredBooks = database.filter(book => book.name.toLocaleLowerCase().includes(name.toLowerCase()))
  }

  if (finished) {
    filteredBooks = database.filter(book => book.finished === (finished === '1'))
  }

  if (reading) {
    filteredBooks = database.filter(book => book.reading === (reading === 1))
  }

  return {
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    }
  }
}

export const getBookById = (request: Request, h: ResponseToolkit) => {
  const { bookId } = request.params
  const book = database.find(book => bookId === book.id)

  if (book !== undefined) {
    return {
      status: 'success',
      data: { book }
    }
  }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  }).code(404)
}

export const editBook = (request: Request, h: ResponseToolkit) => {
  const { bookId } = request.params
  const bookRequest = request.payload as BookRequest

  if (!bookRequest.name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    }).code(400)
  }

  if (bookRequest.readPage > bookRequest.pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400)
  }

  const bookIndex = database.findIndex(book => bookId === book.id)

  if (bookIndex < 0) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    }).code(404)
  }
  const finished = bookRequest.pageCount === bookRequest.readPage
  database[bookIndex] = {
    ...database[bookIndex],
    ...bookRequest,
    finished,
    updatedAt: new Date().toDateString()
  }

  return {
    status: 'success',
    message: 'Buku berhasil diperbarui'
  }
}

export const deleteBook = (request: Request, h: ResponseToolkit) => {
  const { bookId } = request.params
  const bookIndex = database.findIndex(book => bookId === book.id)

  if (bookIndex < 0) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    }).code(404)
  }

  database.splice(bookIndex, 1)

  return {
    status: 'success',
    message: 'Buku berhasil dihapus'
  }
}
