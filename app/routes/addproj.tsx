import {
  redirect,
  unstable_parseMultipartFormData,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
} from "@remix-run/node";
import { Form, useNavigation } from "@remix-run/react";
import { set, ref as Ref } from "firebase/database";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { database, storage } from "~/firebase";
import type { ActionArgs, LinksFunction } from "@remix-run/node";
import { useState } from "react";
import styles from "../styles/addproj.css";

export const links: LinksFunction = () => {
  return [{ href: styles, rel: "stylesheet" }];
};

export const action = async ({ request }: ActionArgs) => {
  const contentTypes = Array<string>();
  const data = await unstable_parseMultipartFormData(
    request,
    unstable_composeUploadHandlers(
      async ({ name, filename, data, contentType }) => {
        if (name !== "media") {
          return undefined;
        }
        const storageRef = ref(storage, `portfolio/${filename}`);
        const dataArray = Array<Uint8Array>();
        let length = 0;
        for await (const d of data) {
          dataArray.push(d);
          length += d.length;
        }
        const dataAsUint8 = new Uint8Array(length);
        let offset = 0;
        dataArray.forEach((data) => {
          dataAsUint8.set(data, offset);
          offset += data.length;
        });
        await uploadBytes(storageRef, dataAsUint8, {
          contentType,
        });
        const url = await getDownloadURL(storageRef);
        contentTypes.push(contentType);
        return url;
      },
      unstable_createMemoryUploadHandler()
    )
  );
  const name = data.get("name");
  const databaseRef = Ref(database, `portfolio/${name}`);
  let link = data.get("link") as string;
  const features = JSON.parse(data.get("features") as string);
  const techs = data.get("tech") as string;
  let tech: string[] = [];
  const m = data.getAll("media");
  const media =
    m.length > 0 ? m.map((mm, i) => ({ url: mm, ct: contentTypes[i] })) : [];
  if (!link.startsWith("https://")) link = `https://${link}`;
  if (techs.includes(",")) tech = techs.split(",");
  else tech = [techs];
  await set(databaseRef, { name, link, tech, media, features });
  return redirect("/");
};

export default function AddProject() {
  const navigation = useNavigation();
  const [more, addMore] = useState(false);
  const [features, setFeatures] = useState<string[]>([]);
  const [f, setF] = useState("");

  if (navigation.state === "submitting")
    return (
      <div className="spinner">
        <div></div>
      </div>
    );
  return (
    <div className="addproj">
      <h1>Add Project</h1>
      <Form method="post" encType="multipart/form-data">
        <input type="hidden" name="features" value={JSON.stringify(features)} />
        <input placeholder="Project Name" name="name" />
        <div>
          <input
            placeholder="Features"
            value={f}
            onChange={(e) => {
              setF(e.target.value);
            }}
          />
          <button
            onClick={(e) => {
              addMore(true);
              setFeatures([...features, f]);
              setF("");
              e.preventDefault();
            }}
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
        {more && features.length > 0 && (
          <ul>
            {features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
        )}
        <input placeholder="Project Link" name="link" />
        <input placeholder="Technology used" name="tech" />
        <input name="media" type="file" multiple />
        <button type="submit">Add Project</button>
      </Form>
    </div>
  );
}
