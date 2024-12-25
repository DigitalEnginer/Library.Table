const books = [
    { id: 1, author: "Бердібек Соқпақбаев", title: "Балалық шаққа саяхат", genre: "Көркем әдебиет", year: 2023, pages: "276 бет", status: "Кітап қорында", rating: 0, reviews: [] },
    { id: 2, author: "Никколо Макиавелли", title: "Государь", genre: "Классика", year: 2023, pages: "318 бет", status: "Кітап қорында", rating: 0, reviews: [] },
    { id: 3, author: "Мэдсен Пири", title: "Пікірталас Өнері", genre: "Жеке даму", year: 2021, pages: "275 бет", status: "Оқырманда", rating: 0, reviews: [] },
];

const bookList = document.getElementById("book-list");
const bookSelect = document.getElementById("book-select");
const ratingStars = document.getElementById("rating-stars");
const reviewsContainer = document.getElementById("reviews-container");
let selectedRating = 0;

/**
 * Кітаптардың тізімін көрсету
 */
function displayBooks(bookArray = books) {
    bookList.innerHTML = "";
    bookArray.forEach(book => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${book.id}</td>
            <td>${book.author}</td>
            <td>${book.title}</td>
            <td>${book.genre}</td>
            <td>${book.year}</td>
            <td>${book.pages}</td>
            <td class="${book.status === "Кітап қорында" ? "available" : "borrowed"}">${book.status}</td>
            <td>${"★".repeat(book.rating)}${"☆".repeat(5 - book.rating)}</td>
        `;
        bookList.appendChild(row);
    });
}

/**
 * Таңдау үшін кітап тізімін толтыру
 */
function fillBookSelect() {
    bookSelect.innerHTML = "<option value=''>Кітапты таңдаңыз</option>";
    books.forEach(book => {
        const option = document.createElement("option");
        option.value = book.id;
        option.textContent = book.title;
        bookSelect.appendChild(option);
    });
}

/**
 * Рейтинг жұлдыздарының түсін өзгерту
 */
function highlightStars(value) {
    Array.from(ratingStars.children).forEach((star, index) => {
        star.style.color = index < value ? "gold" : "gray";
    });
}

/**
 * Барлық пікірлерді көрсету
 */
function displayReviewsForBooks(bookArray = books) {
    reviewsContainer.innerHTML = "";
    bookArray.forEach(book => {
        if (book.reviews.length > 0) {
            const reviewSection = document.createElement("div");
            reviewSection.innerHTML = `<h3>${book.title} - Пікірлер:</h3>`;
            book.reviews.forEach(review => {
                const reviewElement = document.createElement("p");
                reviewElement.innerHTML = `
                    <strong>Рейтинг: ${"★".repeat(review.stars)}${"☆".repeat(5 - review.stars)}</strong>
                    <br>Комментарий: ${review.text}
                `;
                reviewSection.appendChild(reviewElement);
            });
            reviewsContainer.appendChild(reviewSection);
        }
    });
}

/**
 * Кітаптарды сүзу функциясы
 */
function filterBooks(searchText, genreFilter, statusFilter) {
    return books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchText) || book.author.toLowerCase().includes(searchText);
        const matchesGenre = genreFilter ? book.genre.includes(genreFilter) : true;
        const matchesStatus = statusFilter ? book.status === statusFilter : true;
        return matchesSearch && matchesGenre && matchesStatus;
    });
}

/**
 * Кітаптарды жергілікті сақтау орнына сақтау
 */
function saveBooksToStorage() {
    localStorage.setItem("books", JSON.stringify(books));
}

/**
 * Кітаптарды жергілікті сақтау орнынан жүктеу
 */
function loadBooksFromStorage() {
    const savedBooks = localStorage.getItem("books");
    if (savedBooks) {
        books.length = 0;
        JSON.parse(savedBooks).forEach(book => books.push(book));
    }
}

/**
 * Бетті инициализациялау
 */
function initializePage() {
    loadBooksFromStorage();
    displayBooks();
    fillBookSelect();
    displayReviewsForBooks();
}

// Рейтинг жұлдыздарындағы оқиғаларды өңдеу
ratingStars.addEventListener("mousemove", (e) => {
    const hoveredValue = e.target.dataset.value ? Number(e.target.dataset.value) : 0;
    highlightStars(hoveredValue);
});

ratingStars.addEventListener("click", (e) => {
    if (e.target.dataset.value) {
        selectedRating = Number(e.target.dataset.value);
        highlightStars(selectedRating);
    }
});

// Пікір қосу формасының оқиғасы
document.getElementById("review-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const bookId = Number(bookSelect.value);
    const reviewText = document.getElementById("review-text").value.trim();
    if (!reviewText) {
        alert("Пікір жазу қажет!");
        return;
    }
    const book = books.find(b => b.id === bookId);
    if (book) {
        book.reviews.push({ text: reviewText, stars: selectedRating });
        const totalStars = book.reviews.reduce((acc, review) => acc + review.stars, 0);
        book.rating = Math.round(totalStars / book.reviews.length);
        saveBooksToStorage();
        displayBooks();
        displayReviewsForBooks();
    }
});

// Іздеу және сүзгілеу батырмасының оқиғасы
document.getElementById("search-button").addEventListener("click", () => {
    const searchText = document.getElementById("search").value.toLowerCase();
    const genreFilter = document.getElementById("genre-filter").value;
    const statusFilter = document.getElementById("status-filter").value;
    displayBooks(filterBooks(searchText, genreFilter, statusFilter));
});

// Қалпына келтіру батырмасының оқиғасы
document.getElementById("reset-button").addEventListener("click", () => {
    document.getElementById("search").value = "";
    document.getElementById("genre-filter").value = "";
    document.getElementById("status-filter").value = "";
    displayBooks();
});

initializePage();
