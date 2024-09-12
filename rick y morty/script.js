const toggleBtn = document.querySelector('.toggle_btn');
const toggleBtnIcon = document.querySelector('.toggle_btn i');
const dropDownMenu = document.querySelector('.dropdown_menu');

toggleBtn.onclick = function () {
    dropDownMenu.classList.toggle('open');
    const isOpen = dropDownMenu.classList.contains('open');

    toggleBtnIcon.classList = isOpen
        ? 'fa-solid fa-xmark'
        : 'fa-solid fa-bars';
};

// Función para llamar a la API
const apiRick = async (pagina = 1, nombre = '') => {
    let url = `https://rickandmortyapi.com/api/character/?page=${pagina}`;
    if (nombre) {
        url += `&name=${nombre}`; // Agrega el parámetro de búsqueda
    }

    const api = await fetch(url);
    const data = await api.json();
    console.log(data);

    const divRes = document.querySelector('#resultado');
    divRes.innerHTML = ''; // Limpiar resultados anteriores

    if (data.error) {
        divRes.innerHTML = `<p>No se encontraron personajes con el nombre "${nombre}".</p>`;
        return;
    }

    // Mostrar resultados
    data.results.map(item => {
        const divItem = document.createElement('div');
        divItem.innerHTML = `
        <div class="card" style="width: 18rem; margin-top:20px;">
            <img src="${item.image}" class="card-img-top" alt="${item.name}">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">Estatus: ${item.status}</p>
                    <p class="card-text">Especie: ${item.species}</p>
                </div>
        </div>
        `;
        divRes.appendChild(divItem);
    });
};

// Función para mostrar sugerencias
const showSuggestions = async (nombre) => {
    let url = `https://rickandmortyapi.com/api/character/?name=${nombre}`;

    const api = await fetch(url);
    const data = await api.json();

    const suggestionsDiv = document.querySelector('#suggestions');
    suggestionsDiv.innerHTML = ''; // Limpiar sugerencias anteriores

    if (data.error) {
        return; // No mostrar nada si no hay coincidencias
    }

    // Mostrar sugerencias
    data.results.slice(0, 5).forEach(item => { // Mostrar máximo 5 sugerencias
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.textContent = item.name;
        
        // Cuando el usuario haga clic en una sugerencia
        suggestionItem.onclick = () => {
            document.querySelector('#searchInput').value = item.name;
            suggestionsDiv.innerHTML = ''; // Limpiar sugerencias
            apiRick(1, item.name); // Mostrar los resultados de la búsqueda al hacer clic en la sugerencia
        };

        suggestionsDiv.appendChild(suggestionItem);
    });
};

// Llamada inicial para mostrar la primera página
apiRick(1);

// Escuchar el evento de búsqueda
const searchButton = document.querySelector('#searchButton');
const searchInput = document.querySelector('#searchInput');

// Llamar a la API cuando se escribe en el campo de búsqueda
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm.length > 2) {
        showSuggestions(searchTerm); // Mostrar sugerencias si hay más de 2 caracteres
    } else {
        document.querySelector('#suggestions').innerHTML = ''; // Limpiar sugerencias si se borra el texto
    }
});

// Buscar cuando se hace clic en el botón de búsqueda
searchButton.onclick = () => {
    const searchTerm = searchInput.value.trim();
    apiRick(1, searchTerm); // Llamar la API con el término de búsqueda
};


