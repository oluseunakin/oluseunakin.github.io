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
import type { ActionArgs } from "@remix-run/node";
import type { LinksFunction } from "@remix-run/react/dist/routeModules";
import styles from "../styles/addproj.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const loader = () => {
  return null;
};

export const action = async ({ request }: ActionArgs) => {
  const contentTypes = Array<string>()
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
        contentTypes.push(contentType)
        return url
      },
      unstable_createMemoryUploadHandler()
    )
  );
  const name = data.get("name");
  const databaseRef = Ref(database, `portfolio/${name}`);
  let link = data.get("link") as string;
  const description = data.get("description");
  const techs = data.get("tech") as string;
  let tech: string | string[] = techs;
  const m = data.getAll("media");
  const media = m.map((mm, i) => ({url: mm, ct: contentTypes[i]}))
  if (!link.startsWith("https://")) link = `https://${link}`;
  if (techs.includes(",")) tech = techs.split(",");
  await set(databaseRef, { name, link, tech, media, description });
  return redirect("/");
};

export default function AddProject() {
  const navigation = useNavigation();
  if (navigation.state === "submitting") return <div className="spinner"></div>;
  return (
    <div className="addproj">
      <h1>Add Project</h1>
      <div>
        <Form method="post" encType="multipart/form-data">
          <input placeholder="Project Name" name="name" />
          <textarea
            placeholder="Project Description"
            name="description"
          ></textarea>
          <input placeholder="Project Link" name="link" />
          <input placeholder="Technology used" name="tech" />
          <input name="media" type="file" multiple />
          <input type="submit" />
        </Form>
      </div>
    </div>
  );
}
