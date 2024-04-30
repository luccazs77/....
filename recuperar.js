const getPokemonUrl = id => `https://pokeapi.co/api/v2/pokemon/${id}`;

console.log(getPokemonUrl);

const generatePokemonPromises = () => Array(403).fill().map((_, index) =>
    fetch(getPokemonUrl(index + 1)).then(response => response.json()));

const generateHTML = pokemons => pokemons.reduce((accumulator, { name, id, types }) => {
    const elementTypes = types.map(typeInfo => typeInfo.type.name);

    accumulator += `
        <button class="card ${elementTypes[0]}">
            <h1 class="card-title">${id}</h1>
            <h2 class="card-title1">${name}</h2>
            <img class="card-image" alt="${name}" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png"/>
            <p class"card-subtitle">${elementTypes.join(' | ')}</p>
        </button>
        `;
    return accumulator;
}, '');

const inserirPokemons = pokemons => {
    const ul = document.querySelector('[data-js="pokedex"]'); //pegando pelo atributo
    ul.innerHTML = pokemons; // retorna o conteúdo HTML
};

const fetchPokemonDataBeforeRedirect = async id => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch Pokemon species data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch Pokemon data before redirect:', error);
        return null;
    }
};


const pokemonPromises = generatePokemonPromises();


Promise.all(pokemonPromises)
    .then(pokemons => {
        const html = generateHTML(pokemons);
        inserirPokemons(html);

        const listItems = document.querySelectorAll('.card');
        listItems.forEach(listItem => {
            listItem.addEventListener("click", async () => {
                const pokemonID = listItem.querySelector('.card-title').textContent;
                const success = await fetchPokemonDataBeforeRedirect(pokemonID);
                if (success) {
                    window.location.href = `./detail.html?id=${pokemonID}`;
                }
            });
        });
    })
    .catch(error => {
        console.error('Failed to fetch Pokemon data:', error);
    });

fetch('https://pokeapi.co/api/v2/type')
    .then(response => response.json())
    .then(data => {
        const types = data.results.map(type => type.name);

        const tipoButton = document.querySelector('[data-js="type-buttons"]');
        types.forEach(type => {
            if (type !== 'unknown' && type !== 'shadow') {
                const button = document.createElement('button');

                
                switch (type) {
                    
                    case 'fighting':
                        button.textContent = 'Lutador';
                        break;
                    default:
                        button.textContent = type.charAt(0).toUpperCase() + type.slice(1);
                }
                button.classList.add('button', `button-${type.toLowerCase()}`);
               
                button.addEventListener('click', () => {
                    const allButtons = document.querySelectorAll('.button-grid button');
                    allButtons.forEach(btn => {
                        if (btn.textContent !== button.textContent) {
                            btn.classList.toggle('collapsed');
                        }
                    });

                    const lis = document.querySelectorAll('.card');
                    lis.forEach(li => {
                        li.style.display = 'none';
                    });

                    const pokemonsOfType = document.querySelectorAll(`.${type}`);
                    pokemonsOfType.forEach(pokemon => {
                        pokemon.style.display = 'block';
                    });
                });
                tipoButton.appendChild(button);
            }
        });
    })
    .catch(error => {
        console.error('Erro de Pokémon:', error);
    });
