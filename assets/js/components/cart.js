const ls = window.localStorage
let cart = JSON.parse(ls.getItem('cart')) || []

const notifyDOM = document.querySelector('.notify')
    
export function addToCart (id, colorCode, sizeId, qty = 1){
    const itemFinded = cart.find( i => i.id === id && i.colorCode === colorCode && i.sizeId === sizeId)
    
    if (itemFinded){
        itemFinded.qty += qty
    } else {
        cart.push({id, colorCode, sizeId, qty })
    }
    
    updateCart(cart)
}

function updateCart(cart){
     ls.setItem('cart', JSON.stringify(cart))
     showItemCounts()
}

export function getItemCard(id, colorCode, sizeId){
    const itemFinded = cart.find( i => i.id === id && i.colorCode === colorCode && i.sizeId === sizeId)
    
    if (itemFinded) {
        return itemFinded
    } else {
        return {qty: 0}
    }
        
}

export function showItemCounts (){
    let suma = 0

    cart.forEach(item => {
        suma += item.qty
    })

    notifyDOM.innerHTML = suma

    if (suma === 0)
    {
        notifyDOM.classList.remove('show--notify')
    } else {
        notifyDOM.classList.add('show--notify')
    }
    return suma
}


//function cart (db, printProducts){

export function cartMain (db){
  //   let cart = []

    //Elementos del DOM
    const articleDOM = document.querySelector('.article__container')
    const countDOM = document.querySelector('.cart__subTotal h3 span')
    const subTotalDOM = document.querySelector('.cart__subTotal>span')
    const ivaDOM = document.querySelector('.cart__iva>span')
    const granTotalDOM = document.querySelector('.cart__granTotal>span')
    const checkoutDOM = document.querySelector('.btn--checkout')
    const modal = document.querySelector('.modal')
    const modalMessage = document.querySelector('.modal__message')
    const modalTitle = document.querySelector('.modal__title')
    //const cartDOM = document.querySelector('.cart__body')
    // const notifyDOM = document.querySelector('.notify')
    // const totalDOM = document.querySelector('.cart__total--item')
    

    function printCart (){
        let htmlCart = ''

        if (cart.length === 0){
            htmlCart = 
                `<div class="cart__empty">
                    <i class="bx bx-cart"></i>
                    <p class="cart__empty--text">No hay productos en el carrito</p>
                </div>`
            notifyDOM.classList.remove('show--notify')
        } else {
            cart.forEach(item => {
                const product = db.find(p => p.id === item.id)
                const color = product.colors_sizes.find(c => c.code === item.colorCode)
                const size = color.sizes.find(s => s.id === item.sizeId)
                
            
                htmlCart += 
                    `<article class="article">
                        <div class="article__image ">
                            <img src="${color.img}" alt="${product.description}">
                        </div>
                        <h4 class="article__style">Style: ${product.style}</h4>
                        <h3 class="article__title">${product.description}</h3> 
                        <h3 class="article__color--size">${color.name} / ${size.size_descrp}</h3> 

                        <div class="article__price">
                            <span class="cart__TotalPrice">$${product.price}</span>
                        </div>
                        
                        <div class="article__quantity">
                            <button type="button" class="article__quantity-btn article--minus" data-id="${product.id}" data-colorcode="${color.code}" data-sizeid="${size.id}">
                                <i class="bx bx-minus"></i>
                            </button>
                            <span class="article__quantity-text">${item.qty}</span>
                            <button type="button" class="article__quantity-btn article--plus" data-id="${product.id}" data-colorcode="${color.code}" data-sizeid="${size.id}">
                                <i class="bx bx-plus"></i>
                            </button>
                        </div>
                        <button type="button" class="article__btn remove-from-cart" data-id="${product.id}" data-colorcode="${color.code}" data-sizeid="${size.id}">
                            <i class="bx bx-trash"></i> Eliminar
                        </button>
            
                          
                    </article>`    
            })
            notifyDOM.classList.add('show--notify')
        }
        
        ls.setItem('cart',JSON.stringify(cart))
    
        const total = showTotal()

        
        articleDOM.innerHTML = htmlCart
        notifyDOM.innerHTML= showItemCounts()
        countDOM.innerHTML= showItemCounts() + (showItemCounts()===1 ? ' árticulo': ' árticulos')
        subTotalDOM.innerHTML= "$"+total.subTotal
        ivaDOM.innerHTML= "$"+ total.iva
        granTotalDOM.innerHTML= "$"+ total.granTotal

    }

    function addToCart (id, colorCode, sizeId, qty = 1){
        const itemFinded = cart.find( i => i.id === id && i.colorCode === colorCode && i.sizeId === sizeId)
        
        const checkStockResult = checkStock(id, colorCode, sizeId, itemFinded.qty + qty)

        if (checkStockResult.status){
            if (itemFinded){
                itemFinded.qty += qty
            } else {
                cart.push({id, colorCode, sizeId, qty })
            }
    
            printCart()
        } else {
            modal.classList.add('modal--show')
            modalTitle.innerHTML='Inventario límitado.'
            modalMessage.innerHTML= "Solamente tenemos " +
                checkStockResult.stock + (checkStockResult.stock===1 ? ' árticulo disponible.': ' árticulos disponibles.') 
        }
    }

    function checkStock (id, colorCode, sizeId,qty){
        const product = db.find(p => p.id === id)
        const color = product.colors_sizes.find(c => c.code === colorCode)
        const size = color.sizes.find(s => s.id === sizeId)

        const availableStock = size.stock - qty

        if (availableStock < 0){
            return {status: false, stock: size.stock} 
        }
        return {status: true, stock: size.stock}
    }

    function removeFromCart (id, colorCode, sizeId, qty =1) {
        const itemFinded = cart.find( i => i.id === id && i.colorCode === colorCode && i.sizeId === sizeId)
        const indexFinded = cart.findIndex( i => i.id === id && i.colorCode === colorCode && i.sizeId === sizeId)
        
        const result = itemFinded.qty - qty 

        if (result > 0) {
            itemFinded.qty -= qty
        } else {
            cart.splice(indexFinded,1)
        } 

        printCart()
    }
    
    function deleteFromCart (id, colorCode, sizeId) {
        const indexFinded = cart.findIndex( i => i.id === id && i.colorCode === colorCode && i.sizeId === sizeId)
        console.log(indexFinded)
        cart.splice(indexFinded,1)
        printCart()
    }

    function showTotal (){
        let subTotal = 0
        let iva = 0
        let granTotal = 0
        cart.forEach(item => {
            const productFinded = db.find(p => p.id === item.id)
            subTotal += item.qty * productFinded.price
        })

        subTotal = parseFloat(subTotal.toFixed(2))
        iva = parseFloat((subTotal * 0.15).toFixed(2))
        granTotal = parseFloat((subTotal + iva).toFixed(2))
        
        return {subTotal,iva,granTotal}
    }

    function checkout(){
        if (cart.length> 0){
            cart.forEach(item =>{
                const product = db.find(p => p.id === item.id)
                const color = product.colors_sizes.find(c => c.code === item.colorCode)
                const size = color.sizes.find(s => s.id === item.sizeId)

                size.stock -= item.qty
            })

            cart = []
            printCart()
            ls.setItem('db',JSON.stringify(db))
            //printProducts()
            modal.classList.add('modal--show')
            modalMessage.innerHTML= 'Gracias por su compra'
            modalTitle.innerHTML='Fashion & Simple.'
        } else {
            modal.classList.add('modal--show')
            modalMessage.innerHTML= 'No hay árticulos en el carrito.'
            modalTitle.innerHTML='Fashion & Simple.'
        }
            
            
    }

    printCart()

    // //EVENTOS

    articleDOM.addEventListener('click', e =>{
        if (e.target.closest('.article--minus')){
            const id = +e.target.closest('.article--minus').dataset.id
            const colorCode = e.target.closest('.article--minus').dataset.colorcode
            const sizeId = +e.target.closest('.article--minus').dataset.sizeid
            removeFromCart(id,colorCode,sizeId)
        }

        if (e.target.closest('.article--plus')){
            const id = +e.target.closest('.article--plus').dataset.id
            const colorCode = e.target.closest('.article--plus').dataset.colorcode
            const sizeId = +e.target.closest('.article--plus').dataset.sizeid
            addToCart(id,colorCode,sizeId,true)
        }

        if (e.target.closest('.remove-from-cart')){
            const id = +e.target.closest('.remove-from-cart').dataset.id
            const colorCode = e.target.closest('.remove-from-cart').dataset.colorcode
            const sizeId = +e.target.closest('.remove-from-cart').dataset.sizeid
            
            deleteFromCart(id,colorCode,sizeId)
        }

    })

    modal.addEventListener('click', e =>{
        modal.classList.remove('modal--show')
    })

    checkoutDOM.addEventListener('click', () =>{
        checkout()
    })
}
