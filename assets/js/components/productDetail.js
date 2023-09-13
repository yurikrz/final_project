import {addToCart} from "./cart.js"
import {getItemCard} from "./cart.js"

function productDetail (product){
    const productDOM = document.querySelector('.products__container')
        
    function printProduct (){
        let htmlProduct = ''
        let colors = ''
        let arrSizes = []
        let sizes =''

        product.colors_sizes.forEach((e) => {
            colors += 
            `<div class='color-container'>
                <div class='color' style='background-color: ${e.color}' data-ColorCode='${e.code}' data-status='' data-act='Y'>
                </div>  
            </div>`
            arrSizes = [...arrSizes,...e.sizes]  
        })

        const sortSizes = arrSizes.filter( (e, i, a) => a.findIndex( t => t.id === e.id ) === i).sort((a,b)=> a.id - b.id)
        
        sortSizes.forEach(e =>{
            sizes += 
                `<div class='size-container'> 
                <div class='size' data-SizeId='${e.id}' data-SizeDescrp='${e.size_descrp}' data-status='' data-act='Y'>
                    ${e.size}
                </div>  
                </div>`
        })

        htmlProduct += 
            `<article class="product__detail">
                <h4 class="product__detail--style">Style: <span>${product.style}</span></h4>
                <h3 class="product__detail--title">${product.description}</h3> 
                <div class="product__detail--price product__price">
                    <span class="product__actualPrice">$${product.price}</span>
                    <span class="product__originalPrice">$${product.originalPrice}</span>
                </div>
                
                <div class="product__detail--image--container">
                    <div class="product__detail--image ">
                        <img src="${product.colors_sizes[0].img}" alt="${product.description}">
                    </div>
                </div>
                
                <div class='product__detail--info'>
                    <fieldset>
                        <h3 class="product__detail--label-color">Color: <span></span></h3>
                        <h6 class="err errSelectColor error--hidden"><i class='bx bxs-error'></i> Por favor seleccione un color:</h6>
                        <div class='product__detail--colorBox'>
                            ${colors}
                        </div>
                    
                        <h3 class="product__detail--label-size">Size: <span></span></h3>
                        <h6 class="err errSelectSize error--hidden"><i class='bx bxs-error'></i> Por favor seleccione una talla:</h6>
                        <div class='product__detail--sizeBox'>
                            ${sizes}
                        </div>
                    </fieldset>
                    
                    <div class='btn-container'>
                        <button type="button" class="product__btn add--to--cart">
                            <i class="bx bxs-cart-alt"></i>
                            <span>Add to Cart</span>
                        </button>
                    </div> 
                </div>
            </article>`
        
        productDOM.innerHTML = htmlProduct
    }

    printProduct()
    
    const imageDOM = document.querySelector('.product__detail--image img')
    const titleColorDOM = document.querySelector('.product__detail--label-color span')
    const titleSizeDOM = document.querySelector('.product__detail--label-size span')
    // const stockDOM = document.querySelector('.product__detail--stock span')
    const sizesDOM = document.querySelectorAll('.size') 
    const colorsDOM = document.querySelectorAll('.color') 
    const errorColorDOM = document.querySelector('.errSelectColor') 
    const errorSizeDOM = document.querySelector('.errSelectSize') 
    const modal = document.querySelector('.modal')
    const modalMessage = document.querySelector('.modal__message')
    const modalTitle = document.querySelector('.modal__title')

    //FUNCIONES
    
    function DisableColors(pSize,pUnSelectedColor){
        colorsDOM.forEach(eColor => {
            const varColorCode = eColor.dataset.colorcode
            const arrColor = product.colors_sizes.find(color => color.code === varColorCode) 
            
            if(arrColor.sizes.find(size => size.id === pSize)){
                eColor.setAttribute('data-act','Y')
            }else {        
                eColor.setAttribute('data-act','N')
                if (pUnSelectedColor){
                    if (eColor.dataset.status){
                        titleColorDOM.textContent=''
                    }
                    eColor.setAttribute('data-status','')
                }
            }
        })
    }

    function DisableSizes(pColor,pUnSelectedSize){
        sizesDOM.forEach(size => { 
            const varSizeId = +size.dataset.sizeid
            const varStatus = size.dataset.status
            const selectedSizeDOM = document.querySelector(".size[data-status='selected']")

            if (pColor.sizes.find(e => e.id === varSizeId)) {
                size.setAttribute('data-act','Y')
            } else {
                size.setAttribute('data-act','N')
                
                if (pUnSelectedSize && varStatus){
                    titleSizeDOM.textContent=''
                    size.setAttribute('data-status','')
                }
            }
            
            if (selectedSizeDOM===null) {
                EnableAllColors()
            }
        })
    }

    function EnableAllColors(){
        colorsDOM.forEach(color => {  
          color.setAttribute('data-act','Y')
        })
    }

    function EnableSizes(){
        const activeColorsDOM = document.querySelectorAll(".color[data-act='Y']")
        let arrSizes =[]
        activeColorsDOM.forEach((e) => {
            const arrColor = product.colors_sizes.find(color => color.code === e.dataset.colorcode)  
            arrSizes = [...arrSizes,...arrColor.sizes]
        })
        
        const sortSizes = arrSizes.filter( (e, i, a) => a.findIndex( t => t.id === e.id ) === i).sort((a,b)=> a.id - b.id)
        
        sizesDOM.forEach(esize => {  
            if(sortSizes.find(size => size.id === +esize.dataset.sizeid)){
                esize.setAttribute('data-act','Y')
            } else {
                esize.setAttribute('data-act','N')
            }
        })
    }

    function EnableAllSizes(){
        sizesDOM.forEach(size => {  
          size.setAttribute('data-act','Y')
        })
    }
     
    modal.addEventListener('click', e =>{
        modal.classList.remove('modal--show')
    })
    
    //EVENTOS

    productDOM.addEventListener('click',(e)=>{
        if (e.target.closest('.color')){
            const varDataColorCode = e.target.closest('.color').dataset.colorcode 
            const selectedColorDOM = document.querySelector(".color[data-status='selected']")
            const arrColor = product.colors_sizes.find(color => color.code === varDataColorCode)  

            if (selectedColorDOM!=null) {
                selectedColorDOM.setAttribute('data-status','')
            }
        
            e.target.setAttribute('data-status','selected')
            e.target.setAttribute('data-act','Y')
            errorColorDOM.classList.add('error--hidden')       
            DisableSizes(arrColor,'Y')
        }
    })

    productDOM.addEventListener('mouseover',(e)=>{
        if (e.target.closest('.color')){
            const varDataColorCode = e.target.closest('.color').dataset.colorcode 
            const arrColor = product.colors_sizes.find(color => color.code === varDataColorCode)  
        
            imageDOM.setAttribute('src',arrColor.img)
            titleColorDOM.textContent=arrColor.name
            DisableSizes(arrColor)
        }
    })

    productDOM.addEventListener('mouseout',(e)=>{
        if (e.target.closest('.color')){
            let varSelectedColor = document.querySelector(".color[data-status='selected']")
            
            if (varSelectedColor!=null) {
                varSelectedColor = varSelectedColor.dataset.colorcode 
                const arrSelectedColor = product.colors_sizes.find(color => color.code === varSelectedColor) 
                
                imageDOM.setAttribute('src',arrSelectedColor.img)
                titleColorDOM.textContent=arrSelectedColor.name
                DisableSizes(arrSelectedColor)
            } else {
                titleColorDOM.textContent=''
                const selectedSizeDOM = document.querySelector(".size[data-status='selected']")
                
                if (selectedSizeDOM!=null) {
                    EnableSizes()
                } else {
                    EnableAllSizes()
                }
            }
        }
    })

    productDOM.addEventListener('click',(e)=>{
        if (e.target.closest('.size')){
            const selectedSizeDOM = document.querySelector(".size[data-status='selected']")
            const varDataSizeId = +e.target.closest('.size').dataset.sizeid
            
            if (selectedSizeDOM!=null) {
                selectedSizeDOM.setAttribute('data-status','')
            }
        
            e.target.setAttribute('data-status','selected')
            e.target.setAttribute('data-act','Y')
            errorSizeDOM.classList.add('error--hidden')  

            DisableColors(varDataSizeId,'Y')
            EnableSizes()
        }
    })
      
    productDOM.addEventListener('mouseover',(e)=>{
        if (e.target.closest('.size')){
            const varDataSizeId = +e.target.closest('.size').dataset.sizeid
            const varSizeDescrp = e.target.closest('.size').dataset.sizedescrp

            titleSizeDOM.textContent=varSizeDescrp
            DisableColors(varDataSizeId)
        }
    })
      
    productDOM.addEventListener('mouseout',(e)=>{
        if (e.target.closest('.size')){
            const selectedSizeDOM = document.querySelector(".size[data-status='selected']")
            
            if (selectedSizeDOM!=null) {
                const varDataSizeId = +selectedSizeDOM.dataset.sizeid
                const varSizeDescrp = selectedSizeDOM.dataset.sizedescrp
        
                titleSizeDOM.textContent= varSizeDescrp
                DisableColors(varDataSizeId)
                
            } else {
                titleSizeDOM.textContent=''
                EnableAllColors()
            }
        }
    })

    
    productDOM.addEventListener('click', e => {
        if (e.target.closest('.add--to--cart')){
            const selectedSizeDOM = document.querySelector(".size[data-status='selected']")
            const selectedColorDOM = document.querySelector(".color[data-status='selected']")
            let errCon = 0
            
            if (selectedColorDOM!=null) {
                errCon++
            } else {
                errorColorDOM.classList.remove('error--hidden')
            }

            if (selectedSizeDOM!=null) {
                errCon++
            } else {
                errorSizeDOM.classList.remove('error--hidden')
            }

            if (errCon===2){ 
                const varId = product.id
                const varDataSizeId = +selectedSizeDOM.dataset.sizeid
                const varDataColorCode = selectedColorDOM.dataset.colorcode
                const arrColor = product.colors_sizes.find(color => color.code === varDataColorCode)  
                const Size = arrColor.sizes.find(size => size.id === varDataSizeId) 
                const itemCard = getItemCard(varId, varDataColorCode, varDataSizeId)
                
                if ((Size.stock - itemCard.qty ) < 1 ){
                    modal.classList.add('modal--show')
                    modalTitle.innerHTML='Inventario límitado.'
                    modalMessage.innerHTML= "Solamente tenemos " + Size.stock + (Size.stock===1 ? ' árticulo disponible.': ' árticulos disponibles.')                     
                } else {
                    addToCart(product.id,varDataColorCode,varDataSizeId)
                }
            }
        }
    })

    return printProduct
}

export default productDetail
