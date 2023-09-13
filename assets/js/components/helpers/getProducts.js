//usando async await
async function getProducts (){   
    try{
        const rest = await window.fetch('https://yurikrz.github.io/bd_project/bd.json')
        const data = await rest.json()
        return data
    } catch (error) {
        console.log(error)
    }
}


export default getProducts