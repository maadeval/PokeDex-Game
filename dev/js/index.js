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
//vidas elegidas para jugar
let typeLife = JSON.parse(localStorage.getItem("numLife"))

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
const headerOptions = document.getElementById('header__options')
const menuOpctions = document.getElementById('menu-options')
const btnCancelOptionsStep1 = document.getElementById('btn-cancel-options-step-1')
const btnCancelOptionsStep2 = document.getElementById('btn-cancel-options-step-2')
const inputDesafios = document.getElementById('input-desafios') 
const inputOpciones = document.getElementById('input-opciones') 
const descriptionDesafios = document.getElementById('description-desarios')
const descriptionOpciones = document.getElementById('description-opciones')
const typeOptions = document.getElementsByName('type-option')
const menuOptionsTabs = document.getElementById('menu-options__tabs')
const reiniciarButton = document.getElementById('btn-reiniciar')
const modalStartGame = document.getElementById('choose-mode')
const buttonStartGame = document.getElementById('choose-mode__btn-start')
const numberLife = document.getElementById('count-life__number')
const modalGameOver = document.getElementById("game-over")
const buttonRestartGame = document.getElementById('game-over__btn-restart')
const modalNumLife = document.getElementById('count-life')
const backgroundModes = document.getElementById('background-modes')
const listBackgroundModes = document.getElementsByName('background-mode')
const aceptButtonOptionStep1 = document.getElementById('btn-acept-options-step-1')

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
    //si tenemos un theme en el local storage, lo usamos
    if (localStorage.getItem("theme") != null) {
        const styles = document.documentElement.style
        const localTheme = JSON.parse(localStorage.getItem("theme"))
        const nameStyles = Object.keys(localTheme)
        nameStyles.forEach(style => {
            styles.setProperty(style, localTheme[style])
        })
    }
    //si ya tenemos pokedex la usamos
    if (localStorage.getItem('pokedex')) {
        pokedex = JSON.parse(localStorage.getItem('pokedex'))
        allPokemons = pokedex.map(pokemon => pokemon.name)
        fillRemainingPokemons()
        if (JSON.parse(localStorage.getItem("numLife")) != null) {
            numberLife.textContent = JSON.parse(localStorage.getItem("numLife"))
        } else {
            numberLife.textContent = "inf."
        }
    } else {
        //sino, hacemos la peticion y la creamos
        modalStartGame.classList.add('choose-mode__show'); //elige el tipo de juego que vas a usar
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

const changeSteps = () => {
    if (inputDesafios.checked) {
        descriptionDesafios.classList.remove('menu-options__description-block--hidden')
        descriptionOpciones.classList.add('menu-options__description-block--hidden')
    } else {        
        descriptionDesafios.classList.add('menu-options__description-block--hidden')
        descriptionOpciones.classList.remove('menu-options__description-block--hidden')
    }
}

//saca vidas en caso de equivocarse en la respuesta
const subtractLives = () => {
    typeLife --
    numberLife.textContent = typeLife
    localStorage.setItem("numLife", JSON.stringify(typeLife))
    if (typeLife === 0) {
        // crear modal para avisar que el juego se termino
        modalGameOver.classList.add('game-over__show')
    }
}

//se ejecura cuando damos click a un pokemon de la lista
answerOptions.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        if (e.target.textContent === currentAnswer) {
            //captura el pokemon en localStorage
            catchPokemon()
        } else {
            //funciona en caso de que se quiera jugar con vidas
            if (JSON.parse(localStorage.getItem("numLife")) != -1 && JSON.parse(localStorage.getItem("numLife")) != null) {
                subtractLives()
            }
        }
    }
})

const themeOriginal = {
    '--blue': '#0063b1',
    '--yellow': '#ffcb00',
    '--darkGrey': '#333',
    '--white': '#f7f7f7',
    '--red': '#e80125',
    '--light-red': '#f08080'
}

const themeGhost = {
    '--blue': '#464646',
    '--yellow': '#949494',
    '--darkGrey': '#000000',
    '--white': '#f7f7f7',
    '--red': '#2D2D2D',
    '--light-red': '#949494'
}

const themeElectric = {
    '--blue': '#FFD726',
    '--yellow': '#000',
    '--darkGrey': '#A9A07A',
    '--white': '#fff',
    '--red': '#FFB400',
    '--light-red': '#A9A07A'
}

const themeFireBall = {
    '--blue': '#FF0000',
    '--yellow': '#ffcb00',
    '--darkGrey': '#808080',
    '--white': '#fff',
    '--red': '#800000',
    '--light-red': '#FF0000'
}

const themeNatura = {
    '--blue': '#148E43',
    '--yellow': '#0D250F',
    '--darkGrey': '#40634E',
    '--white': '#f7f7f7',
    '--red': '#8BB1B4',
    '--light-red': '#148E43'
}

const themeArtico = {
    '--blue': '#00B0BD',
    '--yellow': '#E8FDFF',
    '--darkGrey': '#093D1D',
    '--white': '#f7f7f7',
    '--red': '#093D1D',
    '--light-red': '#00B0BD'
}

//cambia el estilo global
const changeTheme = (theme, id) => {
    const styles = document.documentElement.style
    const nameProperties = Object.keys(theme)
    for (const style of nameProperties) {
        styles.setProperty(style, theme[style])
    }
    localStorage.setItem("theme", JSON.stringify(theme))
}

//detecta cuando cambiamos de background
backgroundModes.addEventListener("click", (e) => {
    //valor del name de los imputs
    const nameValue = listBackgroundModes[0].name
    if (e.target.name === nameValue) {
        switch (Number(e.target.value)) {
            case 1:
                changeTheme(themeOriginal, 0)
                break;
            case 2:
                changeTheme(themeGhost, 1)
                break;
            case 3:
                changeTheme(themeElectric, 2)
                break;
            case 4:
                changeTheme(themeFireBall, 3)
                break;
            case 5:
                changeTheme(themeNatura, 4)
                break;
            case 6:
                changeTheme(themeArtico, 5)
                break;
            default:
                break;
        }
    }
})

//boton que aparece en el modal de game over, es para reiniciar el juego
buttonRestartGame.addEventListener('click', () => {
    localStorage.removeItem('pokedex')
    localStorage.removeItem("numLife")
    location.reload()
})

//activa el juego cuando recien lo empezamos
buttonStartGame.addEventListener('click', () => {
    modalStartGame.classList.remove('choose-mode__show');
    const allStartOptions = document.getElementsByName('start-mode-game');
    [...allStartOptions].map(option => {
        if (option.checked && option.defaultValue != -1) {
            typeLife = option.defaultValue
            localStorage.setItem("numLife", typeLife)
            numberLife.textContent = typeLife
        } else if (option.defaultValue == -1) {
            numberLife.textContent = "inf."
        }
    })
})

//saca el modal cuando completas toda la pokedex
gameCompletedCancel.addEventListener('click', () => {
    modalGameCompleted.classList.remove('game-completed__show')
})

//reinicia el juego y limpia el local storage
gameCompletedRestart.addEventListener('click', () => {
    modalGameCompleted.classList.remove('game-completed__show')
    localStorage.removeItem('pokedex')
    localStorage.removeItem("numLife")
    pokeSelect.textContent = ''
    checkPokedex()
})

//abre el modal de opciones
headerOptions.addEventListener('click', () => {
    menuOpctions.classList.add('menu-options--show')
    inputDesafios.checked = "true"
    changeSteps()
})

//detecta si se cambio de pestana
menuOptionsTabs.addEventListener('click', () => {
    changeSteps()
})

//cierra el modal de opciones en el step 1
btnCancelOptionsStep1.addEventListener('click', () => {
    menuOpctions.classList.remove('menu-options--show')
})

//cierra el modal de opciones en el step 1
aceptButtonOptionStep1.addEventListener("click", () => {
    menuOpctions.classList.remove('menu-options--show')
})

//cierra el modal de opciones en el step 1
btnCancelOptionsStep2.addEventListener('click', () => {
    menuOpctions.classList.remove('menu-options--show')
})

//se aplica cuando reinicias el juego desde la modal de opciones
reiniciarButton.addEventListener('click', () => {
    localStorage.removeItem('pokedex')
    localStorage.removeItem("numLife")
    location.reload()
    menuOpctions.classList.remove('menu-options--show')
})

checkPokedex()