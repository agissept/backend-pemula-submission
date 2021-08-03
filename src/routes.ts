import { addBookHandler, editBook, getAllBooksHandler, getBookById, deleteBook } from './handler'
import { ServerRoute } from '@hapi/hapi'

const routes: Array<ServerRoute> = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler
  }, {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookById
  }, {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBook
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBook
  }
]

export default routes
