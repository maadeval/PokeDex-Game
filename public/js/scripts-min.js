"use strict";function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function _iterableToArray(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}var pokedexInfo,ALL_POKEMON_INFO="https://pokeapi.co/api/v2/pokemon?limit=151",allPokemons=[],pokedex=[],remainingPokemons=[],listAnswers=[],lifeOptions=[3,5,10],randomNumber=function(e){var t=0<arguments.length&&void 0!==e?e:152;return Math.floor(Math.random()*t)},allAnswers=[],currentAnswer="",currentPokeImage="",loader=document.getElementById("loader"),pokeSelect=document.getElementById("poke-select"),imagePokemon=document.getElementById("image-pokemon"),answerOptions=document.getElementById("answer-options"),pokeList=document.getElementById("pokedex-list"),numPokeCatched=document.getElementById("numberPoke"),modalGameCompleted=document.getElementById("game-completed-modal"),gameCompletedCancel=document.getElementById("game-completed-btn-cancel"),gameCompletedRestart=document.getElementById("game-completed-btn-newgame"),headerOptions=document.getElementById("header__options"),menuOpctions=document.getElementById("menu-options"),btnCancelOptionsStep1=document.getElementById("btn-cancel-options-step-1"),btnCancelOptionsStep2=document.getElementById("btn-cancel-options-step-2"),inputDesafios=document.getElementById("input-desafios"),inputOpciones=document.getElementById("input-opciones"),descriptionDesafios=document.getElementById("description-desarios"),descriptionOpciones=document.getElementById("description-opciones"),typeOptions=document.getElementsByName("type-option"),checkPokedex=function(){localStorage.getItem("pokedex")?(pokedex=JSON.parse(localStorage.getItem("pokedex")),allPokemons=pokedex.map(function(e){return e.name}),fillRemainingPokemons()):fetch(ALL_POKEMON_INFO).then(function(e){return e.json()}).then(function(e){allPokemons=e.results.map(function(e){return e.name}),pokedex=allPokemons.map(function(e,t){return{id:t+1,name:e,catched:!1}}),localStorage.setItem("pokedex",JSON.stringify(pokedex)),fillRemainingPokemons()})},fillRemainingPokemons=function(){pokedex.forEach(function(e){e.catched||remainingPokemons.push(e.name)}),createPokedex()},createPokedex=function(){var r=document.createDocumentFragment();pokedex.forEach(function(e){var t=document.createElement("DIV"),n=document.createElement("DIV"),o=document.createElement("IMG"),s=document.createElement("H2"),a=document.createElement("SPAN"),i=document.createElement("DIV");t.classList.add("poke-card"),n.classList.add("poke-card__front"),i.classList.add("poke-card__back"),e.catched&&(t.classList.add("turn-card"),a.classList.add("show-number-pokemon")),t.dataset.pokeId=e.id,o.setAttribute("SRC","https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/".concat(e.id,".svg")),s.textContent="".concat(e.name),a.textContent="".concat(e.id),n.appendChild(s),n.appendChild(o),n.appendChild(a),t.appendChild(n),t.appendChild(i),r.appendChild(t)}),pokeList.appendChild(r),getAnswers()},getAnswers=function(e){var t=0<arguments.length&&void 0!==e?e:3;if(0!==listAnswers.length&&(listAnswers=[]),0===remainingPokemons.length)gameFinished();else{for(listAnswers.push(remainingPokemons[randomNumber(remainingPokemons.length)]);listAnswers.length<t;){var n=allPokemons[randomNumber(allPokemons.length)];listAnswers.includes(n)||listAnswers.push(n)}currentAnswer=listAnswers[0],listAnswers=listAnswers.sort(function(){return Math.random()-.5}),createImage()}},gameFinished=function(){modalGameCompleted.classList.add("game-completed__show"),loader.style.display="none",numberPoke.textContent=allPokemons.length;var e=document.createDocumentFragment(),t=document.createElement("H2");t.textContent="Felicidades por capturar los ".concat(allPokemons.length," pokemons!"),t.classList.add("congratulation-message"),e.appendChild(t),pokeSelect.appendChild(e)},createImage=function(){imagePokemon.setAttribute("SRC","https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/".concat(pokedex.findIndex(function(e){return e.name===currentAnswer})+1,".svg")),imagePokemon.classList.remove("show"),removeLoader()},removeLoader=function(){imagePokemon.addEventListener("load",function(){loader.style.display="none"}),createOptions()},createOptions=function(){answerOptions.textContent="";var n=document.createDocumentFragment();listAnswers.forEach(function(e){var t=document.createElement("LI");t.textContent=e,n.appendChild(t)}),answerOptions.appendChild(n),numberPokemonsCatched()},numberPokemonsCatched=function(){numPokeCatched.textContent=allPokemons.length-remainingPokemons.length},catchPokemon=function(){var e=pokedex.findIndex(function(e){return currentAnswer===e.name})+1,t=remainingPokemons.findIndex(function(e){return currentAnswer===e});remainingPokemons.splice(t,1),pokedex.map(function(e){e.name===currentAnswer&&(e.catched=!0)}),localStorage.setItem("pokedex",JSON.stringify(pokedex)),goToPokemonCatched(e)},goToPokemonCatched=function(e){var t=_toConsumableArray(document.querySelectorAll(".poke-card"))[e-1];setTimeout(function(){pokeList.scrollTo({top:t.offsetTop-100,behavior:"smooth"})},1500),setTimeout(function(){t.classList.add("turn-card"),setTimeout(function(){t.firstElementChild.children[2].classList.add("show-number-pokemon")},2e3)},2e3),removeDarkFilter()},removeDarkFilter=function(){imagePokemon.classList.add("show"),setTimeout(function(){getAnswers()},3e3)},changeSteps=function(){inputDesafios.cheched?(descriptionDesafios.classList.remove("menu-options__description-block--hidden"),descriptionOpciones.classList.add("menu-options__description-block--hidden")):(descriptionDesafios.classList.add("menu-options__description-block--hidden"),descriptionOpciones.classList.remove("menu-options__description-block--hidden"))};changeSteps(),answerOptions.addEventListener("click",function(e){"LI"===e.target.tagName&&e.target.textContent===currentAnswer&&catchPokemon()}),gameCompletedCancel.addEventListener("click",function(){modalGameCompleted.classList.remove("game-completed__show")}),gameCompletedRestart.addEventListener("click",function(){modalGameCompleted.classList.remove("game-completed__show"),localStorage.removeItem("pokedex"),pokeSelect.textContent="",checkPokedex()}),headerOptions.addEventListener("click",function(){menuOpctions.classList.add("menu-options--show")}),btnCancelOptionsStep1.addEventListener("click",function(){menuOpctions.classList.remove("menu-options--show")}),btnCancelOptionsStep2.addEventListener("click",function(){menuOpctions.classList.remove("menu-options--show")}),checkPokedex();