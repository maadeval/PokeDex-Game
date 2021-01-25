//peticion a la URL para tener por pokemons
const ALL_POKEMON_INFO = "https://pokeapi.co/api/v2/pokemon?limit=151";

//nombre de todos los pokemons
let allPokemons = []
//estado de la pokedex 
let pokedex = []
//pokemons por capturar
let remainingPokemons = []
//pokemons posibles
let listAnswers = []
//vidas totales
const lifeOptions = [3, 5, 10]

//genera un numero random de 0 a 151
const randomNumber = (max= 152) => Math.floor(Math.random() * max)

let allAnswers = []
let currentAnswer = ''
let currentPokeImage = ''
let pokedexInfo

//DOM
const loader = document.getElementById('loader')
const pokeSelect = document.getElementById('poke-select')
const imagePokemon = document.getElementById('image-pokemon')
const answerOptions = document.getElementById('answer-options')
const pokeList = document.getElementById('pokedex-list') 
const numPokeCatched = document.getElementById('numberPoke')
const modalGameCompleted = document.getElementById('game-completed-modal')
const gameCompletedCancel = document.getElementById('game-completed-btn-cancel')
const gameCompletedRestart = document.getElementById('game-completed-btn-newgame')


/*
    ORDEN DE EJECUCION
    1- Ver si ya tenemos una pokedex en localStorage,
    en caso contrario crearla.
    2- Rellenar los Array para saber que pokemons
    capturamos, y cuales nos faltan capturar.
    3- Dibujar la Pokedex y las respuestas posibles.
    4- Dibujar los pokemons capturados en la
    pokedex (imagen e info)
    5- Comenzar el juego.
*/

const checkPokedex = () => {
    //si ya tenemos pokedex la usamos
    if (localStorage.getItem('pokedex')) {
        pokedex = JSON.parse(localStorage.getItem('pokedex'))
        allPokemons = pokedex.map(pokemon => pokemon.name)
        fillRemainingPokemons()
    } else {
        //sino, hacemos la peticion y la creamos
        fetch(ALL_POKEMON_INFO)
            .then(res => res.json())
            .then(data => {
                allPokemons = data.results.map(pokemon => pokemon.name)
                pokedex = allPokemons.map((pokemon, id) => {
                    return {
                        id: id + 1,
                        name: pokemon,
                        catched: false
                    }
                })
                localStorage.setItem('pokedex', JSON.stringify(pokedex))
                fillRemainingPokemons()
            })
    }
}

const fillRemainingPokemons = () => {
    pokedex.forEach(pokemon => {
        //rellenamos con los pokemons que faltan
        if (!pokemon.catched) {
            remainingPokemons.push(pokemon.name)
        }
    })
    //dibujamos los pokemons
    createPokedex()
}

const createPokedex = () => {
    const fragment = document.createDocumentFragment()
    pokedex.forEach(pokemonInfo => {
        const pokeCard = document.createElement('DIV')
        const pokeCardFront = document.createElement('DIV')
        const pokeCardFrontImg = document.createElement('IMG')
        const pokeCardFrontContentTitle = document.createElement('H2')
        const pokeCardFrontContentId = document.createElement('SPAN')
        const pokeCardBack = document.createElement('DIV')

        pokeCard.classList.add('poke-card')
        pokeCardFront.classList.add('poke-card__front')
        pokeCardBack.classList.add('poke-card__back')

        if (pokemonInfo.catched) {
            pokeCard.classList.add('turn-card')
            pokeCardFrontContentId.classList.add('show-number-pokemon')
        }

        pokeCard.dataset.pokeId = pokemonInfo.id

        pokeCardFrontImg.setAttribute('SRC', `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonInfo.id}.svg`)
        pokeCardFrontContentTitle.textContent = `${pokemonInfo.name}`
        pokeCardFrontContentId.textContent = `${pokemonInfo.id}`

        pokeCardFront.appendChild(pokeCardFrontContentTitle)
        pokeCardFront.appendChild(pokeCardFrontImg)
        pokeCardFront.appendChild(pokeCardFrontContentId)
        pokeCard.appendChild(pokeCardFront)
        pokeCard.appendChild(pokeCardBack)
        fragment.appendChild(pokeCard)
    })
    pokeList.appendChild(fragment)

    //agarro la respuesta y las opciones posibles
    getAnswers()
}

const getAnswers = (answers = 3) => {
    if (listAnswers.length !== 0) listAnswers = []
    if (remainingPokemons.length === 0) {
        //se ejecuta cuando se capturan todos los pokemons
        gameFinished()
    } else {
        listAnswers.push(remainingPokemons[randomNumber(remainingPokemons.length)])
        while (listAnswers.length < answers) {
            const newOption = allPokemons[randomNumber(allPokemons.length)]
            if (!listAnswers.includes(newOption)) {
                listAnswers.push(newOption)
            }
        }
        currentAnswer = listAnswers[0]
        listAnswers = listAnswers.sort(() => Math.random() - 0.5)
        
        //mostramos la imagen del pokemon
        createImage()
    }
}

//muestra una modal para avisar que capturaste todos los pokemons
const gameFinished = () => {
    modalGameCompleted.classList.add('game-completed__show')
    loader.style.display = "none"
    numberPoke.textContent = allPokemons.length
    const fragment = document.createDocumentFragment()
    const contratulationMessage = document.createElement('H2')
    contratulationMessage.textContent = `Felicidades por capturar los ${allPokemons.length} pokemons!`
    contratulationMessage.classList.add('congratulation-message')
    fragment.appendChild(contratulationMessage)
    pokeSelect.appendChild(fragment)
}

const createImage = () => {
    imagePokemon.setAttribute('SRC', `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokedex.findIndex(pokemon => pokemon.name === currentAnswer) + 1}.svg`)
    imagePokemon.classList.remove('show')
    //saca el loader
    removeLoader()
}

const removeLoader = () => {
    imagePokemon.addEventListener("load", () => {
        loader.style.display = "none"
    })
    //mostramos las opciones
    createOptions()
}

const createOptions = () => {
    answerOptions.textContent = ''
    const fragment = document.createDocumentFragment()
    listAnswers.forEach(option => {
        const optionInList = document.createElement('LI')
        optionInList.textContent = option
        fragment.appendChild(optionInList)
    })
    answerOptions.appendChild(fragment)
    //agrega la cantidad de pokemons atrapados
    numberPokemonsCatched()
}

const numberPokemonsCatched = () => {
    numPokeCatched.textContent = allPokemons.length - remainingPokemons.length
}

const catchPokemon = () => {
    //agrego el pokemon como capturado
    const pokemonRemoving = pokedex.findIndex(pokemon => currentAnswer === pokemon.name) + 1
    const IdpokemonRemoving = remainingPokemons.findIndex(pokemon => currentAnswer === pokemon)
    remainingPokemons.splice(IdpokemonRemoving, 1)
    pokedex.map(pokemon => {
        if (pokemon.name === currentAnswer) {
            pokemon.catched = true
        }
    })
    localStorage.setItem('pokedex', JSON.stringify(pokedex))
    //y luego muevo el scroll hasta el pokemon
    goToPokemonCatched(pokemonRemoving)
}

const goToPokemonCatched = (idPokemon) => {
    const pokemonCards = [...document.querySelectorAll('.poke-card')]
    const pokemonCatchedCard = pokemonCards[idPokemon - 1]
    setTimeout(() => {
        pokeList.scrollTo({
            top: pokemonCatchedCard.offsetTop - 100,
            behavior: 'smooth'
        })
    }, 1500)
    setTimeout(() => {
        pokemonCatchedCard.classList.add('turn-card')
        setTimeout(() => {
            pokemonCatchedCard.firstElementChild.children[2].classList.add('show-number-pokemon')
        }, 2000);
    }, 2000);
    //desvanece la oscuridad de la imagen
    removeDarkFilter()
}

const removeDarkFilter = () => {
    imagePokemon.classList.add('show')
    setTimeout(() => {
        //inicio el juego otra vez
        getAnswers()
    },3000)
}

answerOptions.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        if (e.target.textContent === currentAnswer) {
            //captura el pokemon en localStorage
            catchPokemon()
        } else {
            //funciona en caso de que se quiera jugar con vidas
        }
    }
})

//saca el modal cuando completas toda la pokedex
gameCompletedCancel.addEventListener('click', () => {
    modalGameCompleted.classList.remove('game-completed__show')
})

//reinicia el juego y limpia el local storage
gameCompletedRestart.addEventListener('click', () => {
    modalGameCompleted.classList.remove('game-completed__show')
    localStorage.removeItem('pokedex')
    pokeSelect.textContent = ''
    checkPokedex()
})


checkPokedex()