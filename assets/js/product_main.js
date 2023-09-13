
import loader from "./components/loader.js";
import showMenu from './components/showMenu.js'
import {productById} from './components/products.js'
import productDetail from './components/productDetail.js';
import {showItemCounts} from './components/cart.js'
//Loader
loader()

//Mostrar Menu
showMenu()


const url = new URL(window.location.href)

const productId = +url.searchParams.get('productId')

const product = productById(productId)

productDetail(product) 

showItemCounts()
