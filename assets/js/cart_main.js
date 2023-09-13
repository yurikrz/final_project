import loader from "./components/loader.js";
import showMenu from './components/showMenu.js'

import {cartMain} from './components/cart.js'
import {getbd} from './components/products.js'

//Loader
loader()

//Mostrar Menu
showMenu()

cartMain(getbd())