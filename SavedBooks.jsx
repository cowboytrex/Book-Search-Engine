import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);

  const userData = data?.me || {};

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({
        variables: { bookId },
      });

      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <div>
      <h1>Viewing saved books!</h1>
      {userData.savedBooks?.length ? (
        <div>
          {userData.savedBooks.map((book) => (
            <div key={book.bookId}>
              <h3>{book.title}</h3>
              <p>{book.description}</p>
              <button onClick={() => handleDeleteBook(book.bookId)}>Remove this Book!</button>
            </div>
          ))}
        </div>
      ) : (
        <h2>No saved books</h2>
      )}
    </div>
  );
};

export default SavedBooks;
