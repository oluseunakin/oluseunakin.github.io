import { useState } from "react";

export const Menu = (props: { projects: string[] }) => {
  const { projects } = props;
  const [menu, setMenu] = useState({ display: false, clicked: false });

  return (
    <div>
      <div className="menu">
        <button className="material-symbols-outlined"
          onClick={(e) => {
            setMenu((prevMenu) => ({
              display: !prevMenu.display,
              clicked: !prevMenu.clicked,
            }));
          }}
        >
          Menu
        </button>
      </div>
      {menu.display && (
        <ul
          className="menuitems"
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
    </div>
  );
};
