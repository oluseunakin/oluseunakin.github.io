const baseURL = "https://webserver.herokuapp.com"
//const baseURL = "http://localhost:3000";
function init() {
  const main = document.getElementById("main");
  main.innerHTML = "<p>Loading</p>";
  fetch(`${baseURL}/getprojects`)
    .then(async (response) => {
      const projects = await response.json();
      const projectsUL = document.getElementById("projects");
      Object.keys(projects).forEach((p, i) => {
        const proj = projects[p];
        const name = proj.name;
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = `${baseURL}/projects/${p}`;
        link.innerText = name;
        li.appendChild(link);
        projectsUL.appendChild(li);
        if (i === 0) {
          const title = document.createElement("h1");
          const description = document.createElement("p");
          const stack = document.createElement("h3");
          const s = document.createElement("code")
          main.innerHTML = "";
          title.innerText = name;
          description.innerText = proj.description;
          s.innerText = proj.tech
          stack.appendChild(s)
          main.appendChild(title);
          main.appendChild(stack);
          main.appendChild(description);
        }
      });
    })
    .catch((e) => {
      console.log(e);
    });
}
