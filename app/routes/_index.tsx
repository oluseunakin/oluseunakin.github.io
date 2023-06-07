import { V2_MetaFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ref, onValue } from "firebase/database";
import { database } from "~/firebase";
import styles from "../styles/_index.css";
import { Menu } from "~/components/menu";
import type { LinksFunction } from "@remix-run/react/dist/routeModules";
import { Media } from "~/components/Media";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "My Portfolio - feast your eyes on amazing hobby projects" },
    {
      name: "description",
      content: "This application showcases my amazing projects",
    },
  ];
};

export const links: LinksFunction = () => {
  return [{ href: styles, rel: "stylesheet" }];
};

export const loader = async () => {
  const p = new Promise((resolve, reject) => {
    onValue(
      ref(database, "portfolio"),
      (snapshot) => {
        resolve(snapshot.val());
      },
      (error) => {
        reject(error);
      }
    );
  }) 
  console.log(database)
  const ap = await p
  
  return json(ap)
};

export default function Index() {
  const projects = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      {projects && <Menu projects={projects} />}
      <header>
        <h1>Oluseun Akindoyin</h1>
        <h4>Scroll to see amazing projects</h4>
        <p>
          Many of my projects are built using HTML, CSS, Javascript, Node Js,
          Node Js Libraries and Frameworks (React, NextJS, Remix, Express) but
          I'm aware and can develop in other languages like Dart, Go, Java and
          Python
        </p>
      </header>
      <main>
        {projects &&
          Object.keys(projects).map((k, i) => {
            const project = projects[k] as any;
            const { tech, media, name, link, description } = project;
            return (
              <div key={i} id={k} className="project">
                <div>
                  <h2>{name}</h2>
                  <div>
                    <Link to={link}>{link}</Link>
                  </div>
                  <div>
                    {typeof tech === "string" ? (
                      <code>{tech}</code>
                    ) : (
                      tech.map((t: string, i: number) => (
                        <code key={i}>{t}</code>
                      ))
                    )}
                  </div>
                </div>
                <p>{description}</p>
                {typeof media[0] !== "object" && <Media sources={media} />}
              </div>
            );
          })}
      </main>
    </div>
  );
}
