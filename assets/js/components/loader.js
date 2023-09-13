function loader(){
    window.addEventListener('load',() => {
        const loader = document.querySelector('.loader')
        loader.classList.add('loader--hidden')
        console.log(loader)
    })
}

export default loader