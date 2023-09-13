import getProducts from "./helpers/getProducts.js"

const ls = window.localStorage
const db = JSON.parse(ls.getItem('db')) || await getProducts()

export function getbd(){
    return db
}

export function products () {
    //const db = JSON.parse(ls.getItem('db')) || [...products]
    const productsDOM = document.querySelector('.products__container')
    
    function printProducts (){
        let htmlProduct = ''

        db.forEach(product => {
            htmlProduct += 
            `<article class="product" data-id="${product.id}">
                <div class="product__image">
                    <img src="${product.colors_sizes[0].img}" alt="${product.description}">
                </div>
                <div class="product__content">
                    <h3 class="product__title">${product.description}</h3>
                    <div class="product__price">
                        <span class="product__actualPrice">$${product.price}</span>
                        <span class="product__originalPrice">$${product.originalPrice}</span>
                    </div>
                </div>
            </article>`
        })

        ls.setItem('db',JSON.stringify(db))
        productsDOM.innerHTML = htmlProduct
    }

    function searchProduct (id){
        const product = db.find(p => p.id === id)

        return product
    }

    printProducts()

    //EVENTOS
    productsDOM.addEventListener('click', e => {
        if (e.target.closest('.product')){
            const id = +e.target.closest('.product').dataset.id
            if(searchProduct(id)){
                window.location.href=`product.html?productId=${id}`
            } else {
                window.alert('Producto no encontrado')
            }
        }
    })

    return{
        db, printProducts
    }
}

export function productById(id){
    const product = db.find(p => p.id === id)
    
    ls.setItem('db',JSON.stringify(db))
    return product
}

