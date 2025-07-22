import React, { useState, useEffect } from 'react';
import { libraryAPI } from '../services/api';
import { Plus, Search, BookOpen } from 'lucide-react';
import LoadingSpinner, { ButtonLoader, SkeletonLoader } from './LoadingSpinner';
import { useNotification } from '../contexts/NotificationContext';
import { Modal } from './Modal';
import EmptyState from './EmptyState';

// Create FormField component for consistent form styling
const FormField = ({ label, children, required }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const BookManagement = () => {
  const { showError, showSuccess } = useNotification();

  // Book List State
  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [booksError, setBooksError] = useState(null);

  // Add Book State
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [addBookLoading, setAddBookLoading] = useState(false);
  const [addBookError, setAddBookError] = useState(null);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    description: '',
    publisher: '',
    published_year: '',
    cover_image_url: '',
    total_copies: 1,
  });

  // Edit Book State
  const [editBook, setEditBook] = useState(null);
  const [editBookLoading, setEditBookLoading] = useState(false);
  const [editBookError, setEditBookError] = useState(null);

  // Book Search State
  const [bookSearch, setBookSearch] = useState('');

  // Fetch books
  const fetchBooks = async (search = '') => {
    setBooksLoading(true);
    setBooksError(null);
    try {
      const res = await libraryAPI.getBooks({ search });
      setBooks(res.books || []);
    } catch (err) {
      setBooksError(err.message || 'Failed to fetch books');
    } finally {
      setBooksLoading(false);
    }
  };

  // Add book handler
  const handleAddBook = async (e) => {
    e.preventDefault();
    setAddBookLoading(true);
    setAddBookError(null);
    try {
      await libraryAPI.addBook(newBook);
      showSuccess('Book added successfully!');
      setNewBook({ title: '', author: '', isbn: '', genre: '', description: '', publisher: '', published_year: '', cover_image_url: '', total_copies: 1 });
      fetchBooks(bookSearch);
      setTimeout(() => {
        setIsAddBookOpen(false);
      }, 1000);
    } catch (err) {
      setAddBookError(err.message || 'Failed to add book');
    } finally {
      setAddBookLoading(false);
    }
  };

  // Edit book handlers
  const handleEditBook = (book) => {
    setEditBook(book);
    setEditBookError(null);
  };
  const handleEditBookChange = (e) => {
    setEditBook({ ...editBook, [e.target.name]: e.target.value });
  };
  const handleEditBookSubmit = async (e) => {
    e.preventDefault();
    setEditBookLoading(true);
    setEditBookError(null);
    try {
      await libraryAPI.updateBook(editBook.id, editBook);
      showSuccess('Book updated successfully!');
      fetchBooks(bookSearch);
      setTimeout(() => {
        setEditBook(null);
      }, 1000);
    } catch (err) {
      setEditBookError(err.message || 'Failed to update book');
    } finally {
      setEditBookLoading(false);
    }
  };

  // Delete book
  const handleDeleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await libraryAPI.deleteBook(id);
      fetchBooks(bookSearch);
      showSuccess('Book deleted successfully!');
    } catch (err) {
      showError(err.message || 'Failed to delete book');
    }
  };

  // Initial fetch and search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBooks(bookSearch);
    }, 500); // Debounce API call

    return () => clearTimeout(timer);
  }, [bookSearch]);

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
          <h3 className="text-lg font-medium text-gray-900">Book Management</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or author..."
                value={bookSearch}
                onChange={(e) => setBookSearch(e.target.value)}
                className="input-field pl-9"
              />
            </div>
            <button onClick={() => setIsAddBookOpen(true)} className="btn-primary flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add Book
            </button>
          </div>
        </div>
        {booksLoading ? (
          <SkeletonLoader lines={5} />
        ) : booksError ? (
          <div className="text-red-600">{booksError}</div>
        ) : books.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title={bookSearch ? "No Books Found" : "No Books in Library"}
            message={bookSearch ? "Try adjusting your search terms." : "Get started by adding a new book to your library."}
            actionText="Add New Book"
            onAction={() => setIsAddBookOpen(true)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Copies</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {books.map((book) => (
                  <tr key={book.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{book.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{book.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{book.available_copies} / {book.total_copies}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button onClick={() => handleEditBook(book)} className="btn-secondary mr-2">Edit</button>
                      <button onClick={() => handleDeleteBook(book.id)} className="btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={isAddBookOpen} onClose={() => setIsAddBookOpen(false)} title="Add New Book">
        <form className="space-y-4" onSubmit={handleAddBook}>
          {addBookError && <div className="text-red-600 mb-4">{addBookError}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Title" required>
              <input
                type="text"
                className="input-field w-full"
                required
                value={newBook.title}
                onChange={e => setNewBook({ ...newBook, title: e.target.value })}
                placeholder="Enter book title"
              />
            </FormField>

            <FormField label="Author" required>
              <input
                type="text"
                className="input-field w-full"
                required
                value={newBook.author}
                onChange={e => setNewBook({ ...newBook, author: e.target.value })}
                placeholder="Enter author name"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="ISBN" required>
              <input
                type="text"
                className="input-field w-full"
                required
                value={newBook.isbn}
                onChange={e => setNewBook({ ...newBook, isbn: e.target.value })}
                placeholder="Enter ISBN"
              />
            </FormField>

            <FormField label="Genre">
              <input
                type="text"
                className="input-field w-full"
                value={newBook.genre}
                onChange={e => setNewBook({ ...newBook, genre: e.target.value })}
                placeholder="Enter genre"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Publisher">
              <input
                type="text"
                className="input-field w-full"
                value={newBook.publisher}
                onChange={e => setNewBook({ ...newBook, publisher: e.target.value })}
                placeholder="Enter publisher"
              />
            </FormField>

            <FormField label="Published Year">
              <input
                type="number"
                className="input-field w-full"
                value={newBook.published_year}
                onChange={e => setNewBook({ ...newBook, published_year: Number(e.target.value) })}
                placeholder="Enter year"
              />
            </FormField>
          </div>

          <FormField label="Description">
            <textarea
              className="input-field w-full h-24 resize-none"
              value={newBook.description}
              onChange={e => setNewBook({ ...newBook, description: e.target.value })}
              placeholder="Enter book description"
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Cover Image URL">
              <input
                type="text"
                className="input-field w-full"
                value={newBook.cover_image_url}
                onChange={e => setNewBook({ ...newBook, cover_image_url: e.target.value })}
                placeholder="Enter image URL"
              />
            </FormField>

            <FormField label="Total Copies" required>
              <input
                type="number"
                className="input-field w-full"
                required
                min="1"
                value={newBook.total_copies}
                onChange={e => setNewBook({ ...newBook, total_copies: Number(e.target.value) })}
                placeholder="Enter number of copies"
              />
            </FormField>
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsAddBookOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={addBookLoading}
            >
              {addBookLoading ? <ButtonLoader /> : 'Add Book'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!editBook} onClose={() => setEditBook(null)} title="Edit Book">
        {editBook && (
          <form className="space-y-4" onSubmit={handleEditBookSubmit}>
            {editBookError && <div className="text-red-600 mb-4">{editBookError}</div>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Title" required>
                <input
                  name="title"
                  type="text"
                  className="input-field w-full"
                  required
                  value={editBook.title}
                  onChange={handleEditBookChange}
                  placeholder="Enter book title"
                />
              </FormField>

              <FormField label="Author" required>
                <input
                  name="author"
                  type="text"
                  className="input-field w-full"
                  required
                  value={editBook.author}
                  onChange={handleEditBookChange}
                  placeholder="Enter author name"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="ISBN" required>
                <input
                  name="isbn"
                  type="text"
                  className="input-field w-full"
                  required
                  value={editBook.isbn}
                  onChange={handleEditBookChange}
                  placeholder="Enter ISBN"
                />
              </FormField>

              <FormField label="Genre">
                <input
                  name="genre"
                  type="text"
                  className="input-field w-full"
                  value={editBook.genre || ''}
                  onChange={handleEditBookChange}
                  placeholder="Enter genre"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Publisher">
                <input
                  name="publisher"
                  type="text"
                  className="input-field w-full"
                  value={editBook.publisher || ''}
                  onChange={handleEditBookChange}
                  placeholder="Enter publisher"
                />
              </FormField>

              <FormField label="Published Year">
                <input
                  name="published_year"
                  type="number"
                  className="input-field w-full"
                  value={editBook.published_year || ''}
                  onChange={handleEditBookChange}
                  placeholder="Enter year"
                />
              </FormField>
            </div>

            <FormField label="Description">
              <textarea
                name="description"
                className="input-field w-full h-24 resize-none"
                value={editBook.description || ''}
                onChange={handleEditBookChange}
                placeholder="Enter book description"
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Cover Image URL">
                <input
                  name="cover_image_url"
                  type="text"
                  className="input-field w-full"
                  value={editBook.cover_image_url || ''}
                  onChange={handleEditBookChange}
                  placeholder="Enter image URL"
                />
              </FormField>

              <FormField label="Total Copies" required>
                <input
                  name="total_copies"
                  type="number"
                  className="input-field w-full"
                  required
                  min="1"
                  value={editBook.total_copies}
                  onChange={handleEditBookChange}
                  placeholder="Enter number of copies"
                />
              </FormField>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <button
                type="button"
                onClick={() => setEditBook(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={editBookLoading}
              >
                {editBookLoading ? <ButtonLoader /> : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default BookManagement; 