export function generateTestData(count: number) {
    const books = [];
    const authors = ['Matti Meikäläinen', 'Liisa Virtanen', 'Jukka Niemi', 'Anna Korhonen', 'Pekka Laine'];
    const titles = ['Matka maailman ympäri', 'Salaisuuksien saari', 'Kadonneen kaupungin arvoitus', 'Aika varkaat', 'Tähtien tuolla puolen'];
  
    for (let i = 0; i < count; i++) {
      const book = {
        id: String(i + 1),
        book: titles[Math.floor(Math.random() * titles.length)],
        author: authors[Math.floor(Math.random() * authors.length)],
        published: Math.floor(Math.random() * (2023 - 1900 + 1)) + 1900,
        isbn: 'ISBN' + Math.floor(Math.random() * 10000000000000),
        description: 'Tämä on testikirja ' + (i + 1) + '. Sen kirjoittaja on ' + authors[Math.floor(Math.random() * authors.length)] + ' ja se julkaistiin vuonna ' + (Math.floor(Math.random() * (2023 - 1900 + 1)) + 1900) + '.',
      };
      books.push(book);
    }
    return books;
  }