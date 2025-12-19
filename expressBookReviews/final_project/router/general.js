const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Axios'u kullanacağız

// Task 7: Yeni kullanıcı kaydı
public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (username && password) {
    const userExists = users.some(u => u.username === username);
    if (!userExists) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "Kullanıcı başarıyla kaydedildi."});
    }
    return res.status(404).json({message: "Kullanıcı zaten mevcut!"});
  }
  return res.status(404).json({message: "Kullanıcı adı veya şifre eksik."});
});

// Task 10: Tüm kitapları getir (Async/Await kullanarak)
public_users.get('/', async function (req, res) {
  try {
    const allBooks = await Promise.resolve(books); // Veritabanı simülasyonu
    res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    res.status(500).json({message: "Kitaplar yüklenirken hata oluştu"});
  }
});

// Task 11: ISBN ile getir (Promises kullanarak)
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) resolve(books[isbn]);
    else reject("Kitap bulunamadı");
  })
  .then(book => res.status(200).send(JSON.stringify(book, null, 4)))
  .catch(err => res.status(404).json({message: err}));
});

// Task 12: Yazara göre getir
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const filtered = Object.values(books).filter(b => b.author === author);
    res.status(200).send(JSON.stringify(filtered, null, 4));
});

// Task 13: Başlığa göre getir
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const filtered = Object.values(books).filter(b => b.title === title);
    res.status(200).send(JSON.stringify(filtered, null, 4));
});

// Task 6: Kitap yorumlarını getir
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;