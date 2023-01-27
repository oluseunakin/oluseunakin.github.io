const baseURL = "https://webserver.herokuapp.com"

function init() {
    const main = document.getElementById('main')
    
    main.innerHTML = '<p>Loading</p>'
    fetch(`${baseURL}/getprojects`).then(async (response) => {
        const projectArray = await response.json()
        const projectsUL = document.getElementById('projects')
        projectArray.forEach(async (proj, i) => {
            const li = document.createElement('li')
            const path = proj.replace(".txt", "")
            const link = document.createElement('a')
            link.href = `${baseURL}/project/${path}`
            link.innerText = path
            li.appendChild(link)
            projectsUL.appendChild(li)
            if(i === 0) {
                const title = document.createElement('h1')
                const description = document.createElement('p')
                const stack = document.createElement('h3')
                let data = await (await fetch(`${baseURL}/data/${proj}`)).json()
                data = JSON.parse(data)
                main.innerHTML = ''
                title.innerText = data.name[0]
                description.innerText = data.description[0]
                data.tech.forEach(s => {
                    const span = document.createElement('span')
                    span.innerText = s
                    stack.appendChild(span)
                })
                main.appendChild(title)
                main.appendChild(stack)
                main.appendChild(description)
            }
        })
    }).catch(e => {
        console.log(e)
    })
}