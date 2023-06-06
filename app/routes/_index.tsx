import type { V2_MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ref, onValue } from "firebase/database";
import { database } from "~/firebase";
import styles from "../styles/_index.css";
import initStyle from "../styles/init.css";
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
  return [
    { href: styles, rel: "stylesheet" },
    { rel: "stylesheet", href: initStyle },
  ];
};

export const loader = async () => {
  return new Promise((resolve, reject) => {
    onValue(
      ref(database, "portfolio"),
      (snapshot) => {
        resolve(snapshot.val());
      },
      (error) => {
        reject(error);
      }
    );
  });
};

export default function Index() {
  const projects = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <Menu projects={projects} />
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
