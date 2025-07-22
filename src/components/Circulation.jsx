import React, { useState, useEffect } from 'react';
import { Book, User, Search } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';
import { libraryAPI } from '../services/api';
import useDebounce from '../hooks/useDebounce';

const Circulation = () => {
  const [issueBookQuery, setIssueBookQuery] = useState('');
  const [issueUserQuery, setIssueUserQuery] = useState('');
  const [bookResults, setBookResults] = useState([]);
  const [userResults, setUserResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isBookLoading, setIsBookLoading] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);

  const [returnQuery, setReturnQuery] = useState('');
  const [borrowingResults, setBorrowingResults] = useState([]);
  const [selectedBorrowing, setSelectedBorrowing] = useState(null);
  const [isReturnLoading, setIsReturnLoading] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);

  const debouncedBookQuery = useDebounce(issueBookQuery, 300);
  const debouncedUserQuery = useDebounce(issueUserQuery, 300);
  const debouncedReturnQuery = useDebounce(returnQuery, 300);

  const { showError, showSuccess } = useNotification();

  useEffect(() => {
    if (debouncedBookQuery) {
      setIsBookLoading(true);
      libraryAPI.getBooks({ search: debouncedBookQuery, limit: 5 })
        .then(data => setBookResults(data.books))
        .catch(() => showError('Failed to search for books'))
        .finally(() => setIsBookLoading(false));
    } else {
      setBookResults([]);
    }
  }, [debouncedBookQuery]);

  useEffect(() => {
    if (debouncedUserQuery) {
      setIsUserLoading(true);
      libraryAPI.getUsers({ search: debouncedUserQuery, limit: 5 })
        .then(data => setUserResults(data.data))
        .catch(() => showError('Failed to search for users'))
        .finally(() => setIsUserLoading(false));
    } else {
      setUserResults([]);
    }
  }, [debouncedUserQuery]);

  useEffect(() => {
    if (debouncedReturnQuery) {
      setIsReturnLoading(true);
      libraryAPI.searchBorrowings(debouncedReturnQuery)
        .then(data => setBorrowingResults(data))
        .catch(() => showError('Failed to search for borrowings'))
        .finally(() => setIsReturnLoading(false));
    } else {
      setBorrowingResults([]);
    }
  }, [debouncedReturnQuery]);

  const handleIssueBook = (e) => {
    e.preventDefault();
    if (!selectedBook || !selectedUser) {
      showError('Please select a book and a student.');
      return;
    }
    
    setIsIssuing(true);
    libraryAPI.issueBook(selectedUser.id, selectedBook.id)
      .then(() => {
        showSuccess(`Book "${selectedBook.title}" issued to ${selectedUser.username}.`);
        // Reset form
        setSelectedBook(null);
        setSelectedUser(null);
        setIssueBookQuery('');
        setIssueUserQuery('');
      })
      .catch(err => {
        showError(err.response?.data?.error || 'Failed to issue book.');
      })
      .finally(() => {
        setIsIssuing(false);
      });
  };

  const handleReturnBook = (e) => {
    e.preventDefault();
    if (!selectedBorrowing) {
      showError('Please select a borrowed book to return.');
      return;
    }
    
    setIsReturning(true);
    libraryAPI.returnBook(selectedBorrowing.borrowing_id)
      .then(() => {
        showSuccess(`Book "${selectedBorrowing.title}" has been returned.`);
        // Reset form
        setSelectedBorrowing(null);
        setReturnQuery('');
      })
      .catch(err => {
        showError(err.response?.data?.error || 'Failed to return book.');
      })
      .finally(() => {
        setIsReturning(false);
      });
  };

  const handleRenewBook = (e) => {
    e.preventDefault();
    if (!selectedBorrowing) {
      showError('Please select a borrowed book to renew.');
      return;
    }

    setIsRenewing(true);
    libraryAPI.renewBook(selectedBorrowing.borrowing_id)
      .then(() => {
        showSuccess(`Book "${selectedBorrowing.title}" has been renewed.`);
        // Reset form
        setSelectedBorrowing(null);
        setReturnQuery('');
      })
      .catch(err => {
        showError(err.response?.data?.error || 'Failed to renew book.');
      })
      .finally(() => {
        setIsRenewing(false);
      });
  };

  return (
    <div className="space-y-8">
      {/* Issue Book Form */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Issue Book</h3>
        <form onSubmit={handleIssueBook} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User Search */}
            <div>
              <label htmlFor="user-search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Student
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="user-search"
                  value={issueUserQuery}
                  onChange={(e) => setIssueUserQuery(e.target.value)}
                  className="form-input pl-10"
                  placeholder="Enter name or email..."
                />
                {userResults.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
                    {userResults.map(user => (
                      <li
                        key={user.id}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setSelectedUser(user);
                          setIssueUserQuery(user.username);
                          setUserResults([]);
                        }}
                      >
                        {user.username} ({user.email})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Book Search */}
            <div>
              <label htmlFor="book-search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Book
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Book className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="book-search"
                  value={issueBookQuery}
                  onChange={(e) => setIssueBookQuery(e.target.value)}
                  className="form-input pl-10"
                  placeholder="Enter title or ISBN..."
                />
                {bookResults.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
                    {bookResults.map(book => (
                      <li
                        key={book.id}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setSelectedBook(book);
                          setIssueBookQuery(book.title);
                          setBookResults([]);
                        }}
                      >
                        {book.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <button type="submit" className="btn-primary" disabled={isIssuing}>
              {isIssuing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Issuing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Issue Book
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Return Book Form */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Return Book</h3>
        <form onSubmit={handleReturnBook} className="space-y-4">
          <div>
            <label htmlFor="return-search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Borrowed Book
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="return-search"
                value={returnQuery}
                onChange={(e) => setReturnQuery(e.target.value)}
                className="form-input pl-10"
                placeholder="Enter book title, ISBN, or student name..."
              />
              {borrowingResults.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
                  {borrowingResults.map(borrowing => (
                    <li
                      key={borrowing.borrowing_id}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setSelectedBorrowing(borrowing);
                        setReturnQuery(`${borrowing.title} (by ${borrowing.username})`);
                        setBorrowingResults([]);
                      }}
                    >
                      {borrowing.title} (Borrowed by: {borrowing.username})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {selectedBorrowing && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-semibold">Selected Borrowing:</h4>
              <p>{selectedBorrowing.title}</p>
              <p className="text-sm text-gray-600">Borrowed by: {selectedBorrowing.username}</p>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={handleRenewBook} className="btn-secondary" disabled={isRenewing}>
                  {isRenewing ? 'Renewing...' : 'Renew'}
                </button>
                <button type="submit" className="btn-primary" disabled={isReturning}>
                  {isReturning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Returning...
                    </>
                  ) : (
                    'Return Book'
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Circulation; 