import loader from "./components/loader.js"
import showMenu from './components/showMenu.js'
//import getProducts from './components/helpers/getProducts.js'
import {products} from './components/products.js'
import {showItemCounts} from './components/cart.js'
//Loader
loader()

console.log('cargo loader')
//Mostrar Menu
showMenu()

console.log('cargo menu')

//const {db, printProducts} = products(await getProducts())
products()


console.log('cargo productos')

showItemCounts()