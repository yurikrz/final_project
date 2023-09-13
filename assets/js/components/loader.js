function loader(){
    console("1")
    window.addEventListener('load',() => {
        console.log("2")
        const loader = document.querySelector('.loader')
        loader.classList.add('loader--hidden')
        console.log(loader)
    })
}

export default loader