const poke_container = document.querySelector(".poke-container");
const search = document.querySelector(".search");
const searchInput = document.querySelector(".searchInput");
const searchBtn = document.querySelector(".searchBtn");
const toggleFavoritesBtn = document.querySelector(".toggle-favorites");

const pokemon_count = 151;

const bg_color = {
  grass: "#8BD369",
  fire: "#FF603F",
  water: "#3399FF",
  bug: "#AABB22",
  normal: "#AAAA99",
  flying: "#9AA8FA",
  poison: "#B76EA4",
  electric: "#FFD34E",
  ground: "#E2C56A",
  fairy: "#F1A8EC",
  psychic: "#FF6EA4",
  fighting: "#C56E5C",
  rock: "#C5B679",
  dragon: "#7766EE",
  ice: "#66CCFF",
};

let allPokemons = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let showOnlyFavorites = false;

searchBtn.addEventListener("click", () => {
  search.classList.toggle("active");
  if (!search.classList.contains("active")) {
    searchInput.value = "";
    renderPokemons();
  }
});

searchInput.addEventListener("input", () => {
  const searchValue = searchInput.value.toLowerCase();
  renderPokemons(searchValue);
});

toggleFavoritesBtn.addEventListener("click", () => {
  showOnlyFavorites = !showOnlyFavorites;
  toggleFavoritesBtn.innerText = showOnlyFavorites
    ? "Show All"
    : "Show Favorites";
  renderPokemons(searchInput.value.toLowerCase());
});

const fetchPokemons = async () => {
  for (let i = 1; i <= pokemon_count; i++) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const data = await res.json();
    allPokemons.push(data);
  }
  renderPokemons();
};

const renderPokemons = (searchValue = "") => {
  poke_container.innerHTML = "";

  const filtered = allPokemons.filter((pokemon) => {
    const isFav = favorites.includes(pokemon.id);
    const matchesSearch = pokemon.name.toLowerCase().includes(searchValue);
    return (!showOnlyFavorites || isFav) && matchesSearch;
  });

  filtered.forEach(createPokemonCard);
};

const createPokemonCard = (pokemon) => {
  const pokemonEl = document.createElement("div");
  pokemonEl.classList.add("pokemon");

  const type = pokemon.types[0].type.name;
  const bg = bg_color[type];
  const isFavorite = favorites.includes(pokemon.id);

  pokemonEl.style.backgroundColor = bg;

  pokemonEl.innerHTML = `
    <div class="image-container">
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
        pokemon.id
      }.png" alt="${pokemon.name}" />
    </div>
    <div class="poke-info">
      <span class="poke-id">#${pokemon.id.toString().padStart(3, "0")}</span>
      <h3 class="poke-name">${pokemon.name}</h3>
      <div class="small">
        <small class="poke-exp"><i class="fa-solid fa-flask"></i> <span>${
          pokemon.base_experience
        } Exp</span></small>
        <small class="poke-weight"><i class="fa-solid fa-weight-scale"></i> <span>${
          pokemon.weight
        } Kg</span></small>
      </div>
      <div class="poke-type"><i class="fa-brands fa-uncharted"></i> <span>${type}</span></div>
    </div>
    <button class="favorite-btn ${isFavorite ? "favorited" : ""}" data-id="${
    pokemon.id
  }">
      <i class="fa-solid fa-heart"></i>
    </button>
  `;

  poke_container.appendChild(pokemonEl);
};

// Favori butonuna tıklamayı dinle
poke_container.addEventListener("click", (e) => {
  const favBtn = e.target.closest(".favorite-btn");
  if (!favBtn) return;

  const id = parseInt(favBtn.getAttribute("data-id"));
  if (favorites.includes(id)) {
    favorites = favorites.filter((favId) => favId !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderPokemons(searchInput.value.toLowerCase());
});

// Pokemonları getir
fetchPokemons();
