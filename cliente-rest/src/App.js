import logo from './dog.jfif';
import logo2 from './dog-meme.gif';
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const [dogs, setDogs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8084/dogs1')
      .then(response => {
        console.log(response.data); // Exemplo: exibir os dados no console
        const dogBreeds = Object.keys(response.data.message);
        setDogs(dogBreeds);
      })
      .catch(error => {
        console.error('Erro ao obter dados do servidor:', error);
      });
  }, []);

  const addToFavorites = (image) => {
    axios.post('http://localhost:8084/dogs/favorites', { image })
      .then(response => {
        console.log(response.data.message);
      })
      .catch(error => {
        console.error('Erro ao adicionar imagem aos favoritos:', error);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="logo" />
        <img src={logo2} alt="img" />
        <p>
          {dogs.map((breed, index) => (
            <button key={index} onClick={() => addToFavorites(breed)}>
              {breed}
            </button>
          ))}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Cliente interagindo com servidor
        </a>
      </header>
    </div>
  );
}

export default App;
