import { useState } from "react";

export const Menu = (props: { projects: string[] }) => {
  const { projects } = props;
  const [menu, setMenu] = useState({ display: false, clicked: false });

  return (
    <>
      <div>
        <button
          onClick={(e) => {
            setMenu((prevMenu) => ({
              display: !prevMenu.display,
              clicked: !prevMenu.clicked,
            }));
          }}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
      {menu.display && (
        <ul
          onClick={(e) => {
            setMenu((prevMenu) => ({
              display: !prevMenu.display,
              clicked: !prevMenu.clicked,
            }));
          }}
        >
          {Object.keys(projects).map((proj, i) => (
            <li key={i}>
              <a href={`#${proj}`}>{proj}</a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
