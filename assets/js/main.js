import loader from "./components/loader.js"
import showMenu from './components/showMenu.js'
//import getProducts from './components/helpers/getProducts.js'
import {products} from './components/products.js'
import {showItemCounts} from './components/cart.js'
//Loader
loader()

//Mostrar Menu
showMenu()

//const {db, printProducts} = products(await getProducts())
products()


showItemCounts()
