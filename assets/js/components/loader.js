function loader(){
    window.addEventListener('load',() => {
        const loader = document.querySelector('.loader')
        loader.classList.add('loader--hidden')
    })
}

export default loader