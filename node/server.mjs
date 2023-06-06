import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import protobuf from 'protobufjs';
import fs from 'fs';

let DogData;
protobuf.load('dogData.proto', function (error, root) {
  if (error) {
    console.error('Erro ao carregar o arquivo dogData.proto:', error);
    return;
  }
  DogData = root.lookupType('mypackage.DogData'); // Substitua 'package' pelo pacote correto definido no arquivo .proto
});


const app = express();
const port = 8084;
let favorites = [];

app.use(cors());
app.use(bodyParser.json());

// // Definindo a rota para o CRUD de dados
app.get('/dogs1', async (req, res) => {
  try {
    // Fazendo uma requisição à API externa (DogAPI) para obter informações sobre os cachorros
    const response = await fetch('https://dog.ceo/api/breeds/list/all');
    const data = await response.json();

    // Retornando os dados obtidos como resposta
    res.json(data);
  } catch (error) {
    console.error('Erro ao obter dados da API externa:', error);
    res.status(500).json({ error: 'Erro ao obter dados da API externa' });
  }
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

app.post('/dogs/favorites', (req, res) => {
  const { image } = req.body;
  favorites.push(image);
  res.status(201).json({ message: 'Imagem adicionada aos favoritos' });
});

app.get('/dogs/favorites', (req, res) => {
  res.json(favorites);
});


// ...


app.get('/dogs', async (req, res) => {
  try {
    // Fazendo uma requisição à API externa (DogAPI) para obter informações sobre os cachorros
    const response = await fetch('https://dog.ceo/api/breeds/list/all');
    const data = await response.json();

    // Convertendo os dados para o formato Protocol Buffer
    const protobufData = DogData.encode(DogData.create(data)).finish();

    // Definindo o cabeçalho Content-Type como 'application/octet-stream' para indicar que é um Protocol Buffer
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(protobufData);
  } catch (error) {
    console.error('Erro ao obter dados da API externa:', error);
    res.status(500).json({ error: 'Erro ao obter dados da API externa' });
  }
});

// ...