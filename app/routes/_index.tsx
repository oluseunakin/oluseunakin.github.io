import type { V2_MetaFunction } from "@remix-run/node";
import { defer } from "@remix-run/node";
import { Await, Link, useLoaderData } from "@remix-run/react";
import { ref, onValue } from "firebase/database";
import { database } from "~/firebase";
import styles from "../styles/index.css";
import { Menu } from "~/components/menu";
import type { LinksFunction } from "@remix-run/react/dist/routeModules";
import { MediaComponent } from "~/components/Media";
import { Suspense } from "react";

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
        return resolve(snapshot.val());
      },
      (error) => {
        reject(error);
        return null;
      }
    );
  });
  return defer({ p });
};

export default function Index() {
  const { p } = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={<div className="spinner"></div>}>
      <Await resolve={p}>
        {(p) =>
          p && (
            <>
              <header>
                <Menu projects={p} />
                <h1>Oluseun Akindoyin</h1>
                <p>
                  <em>Web, Mobile and Destop Programmer</em>
                </p>
                <p>
                  <b>Email: akindoyinoluseun@gmail.com</b>
                </p>
                <div>
                  <p>
                    I am a Computer Science and Engineering graduate of the
                    Obafemi Awolowo University Nigeria and i enjoy playing
                    chess.
                  </p>
                  <p>
                    Many of my projects are built using HTML, CSS, Javascript,
                    Node Js, Node Js Libraries and Frameworks (React, NextJS,
                    Remix, Express) but I'm aware and can develop in other
                    languages like Dart, Go, Java and Python.
                  </p>
                </div>
              </header>
              <main>
                {p &&
                  Object.keys(p).map((k, i) => {
                    const project = p[k] as any;
                    const { tech, media, name, link, features, description } =
                      project;
                    return (
                      <div key={i} id={k} className="project">
                        <div>
                          <h2>{name}</h2>
                          <div>
                            <Link to={link}>{link}</Link>
                          </div>
                          <div>
                            <h3>Tech stack:</h3>
                            <ul>
                              {tech.map((t: string, i: number) => (
                                <li key={i}>
                                  <code>{t}</code>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        {features && (
                          <>
                            <h3>Features</h3>
                            <ul>
                              {features.map((feature: string, i: number) => (
                                <li key={i}><h4>{feature}</h4></li>
                              ))}
                            </ul>
                          </>
                        )}
                        <p>{description}</p>
                        <MediaComponent sources={media} />
                      </div>
                    );
                  })}
              </main>
            </>
          )
        }
      </Await>
    </Suspense>
  );
}
