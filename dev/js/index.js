const ALL_POKEMON_INFO = "https://pokeapi.co/api/v2/pokemon?limit=151";

let allPokemons = []
let allAnswers = []
let currentAnswer = ''
let currentPokeImage = ''
let pokedexInfo

//DOM
const loader = document.getElementById('loader')
const imagePokemon = document.getElementById('image-pokemon')
const answerOptions = document.getElementById('answer-options')
const pokeList = document.getElementById('pokedex-list') 
const numPokeCatched = document.getElementById('numberPoke')


const getAllPokemons = () => {
    fetch(ALL_POKEMON_INFO)
        .then(res => res.json())
        .then(pokemons => {
            if (localStorage.getItem('pokedex')) {
                allPokemons = JSON.parse(localStorage.getItem('pokedex'))
            } else {
                const pokemonsListAPI = [...pokemons.results]
                allPokemons = pokemonsListAPI.map((pokemon, id) => {
                    return {
                        name: pokemon.name,
                        id: id + 1,
                        catched: false
                    }
                })
                localStorage.setItem('pokedex', JSON.stringify(allPokemons))
            }
            printPokedex()
            printNumberPokemonsCatched()
            getAnswers()
           
        })
}

const pokeLocalStorage = (pokemon) => {
    const catchPokemon = JSON.parse(localStorage.getItem('pokedex')).find(({ name }) => pokemon === name)
    console.log(catchPokemon)
    allPokemons[catchPokemon.id - 1].catched = true 
    localStorage.setItem("pokedex", JSON.stringify(allPokemons))

    printNumberPokemonsCatched()
    printPokedex()
}

const printNumberPokemonsCatched = () => {
    let pokemonsCatched = []
    allPokemons.map(pokemon => {
        if (pokemon.catched) {
            pokemonsCatched.push(pokemon.name)
        }
    })

    numPokeCatched.textContent = pokemonsCatched.length
}

const printPokedex = () => {
    const fragment = document.createDocumentFragment()
    pokeList.innerHTML = ""
    allPokemons.forEach((pokemon, id) => {
        const pokeCard = document.createElement('DIV')
        pokeCard.classList.add('poke-card')
        const pokeCardBack = document.createElement('DIV')
        pokeCardBack.classList.add('poke-card__back')
        const pokeCardFront = document.createElement('DIV')
        pokeCardFront.classList.add('poke-card__front')

        if (pokemon.catched) pokeCardBack.style.backgroundColor = "red"
        pokeCard.appendChild(pokeCardBack)
        pokeCard.appendChild(pokeCardFront)
        fragment.appendChild(pokeCard)
    })
    pokeList.appendChild(fragment)
}

const randomNumber = (max = 151, min = 1) => Math.floor(Math.random() * (max - min)) + min;

const getAnswers = (answers = 3) => {
    hidePokeSelector()
    let currentPokemon = allPokemons[randomNumber()]
    currentAnswer = currentPokemon.name
    currentPokeImage = currentPokemon.id
    allAnswers = []
    allAnswers.push(currentAnswer)
    while(allAnswers.length < answers) {
        if (allAnswers.find(({ name }) => allPokemons[randomNumber()].name != name)) allAnswers.push(allPokemons[randomNumber()].name)
    }
    printImage(currentPokeImage)
    imagePokemon.addEventListener('load', e => {
        showPokeSelect()
        printAnswer()
    })
}

const hidePokeSelector = () => {
    loader.classList.remove('hiden')
    imagePokemon.classList.add('hiden')
    answerOptions.classList.add('hiden')
}

const showPokeSelect = () => {
    loader.classList.add('hiden')
    imagePokemon.classList.remove('hiden')
    answerOptions.classList.remove('hiden')
}

const printImage = id => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
        .then(res => res.json())
        .then(image => imagePokemon.src = image.sprites.other.dream_world.front_default)
}

const printAnswer = () => {
    allAnswers = allAnswers.sort(() => Math.random() - 0.5)
    const fragment = document.createDocumentFragment()
    for(const answer of allAnswers) {
        const option = document.createElement('LI')
        option.textContent = answer
        fragment.append(option)
    }
    answerOptions.textContent = ''
    answerOptions.append(fragment)
   
}

getAllPokemons()

    answerOptions.addEventListener('click', e => e.target.textContent === currentAnswer 
        ?   (
            imagePokemon.classList.add('show'),
            setTimeout(() => {
                imagePokemon.classList.remove('show')
                getAnswers()
                pokeLocalStorage(currentAnswer)
            }, 2000)
            )
        :   console.log("INCORRECTO"))

