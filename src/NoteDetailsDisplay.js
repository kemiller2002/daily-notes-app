import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useParams } from "react-router";
import { formatDateString } from "./SupportingFunctions";

export default function NoteDetailsDisplay({ noteAdministrator }) {
  const defaultNote = new Proxy({}, (prop) => {
    return this[prop] || "";
  });

  const { id } = useParams();

  const [note, updateNote] = useState(defaultNote);

  useEffect(() => {
    noteAdministrator.getNote({ id }).then((x) => updateNote(x || defaultNote));
  }, []);

  return (
    <div>
      <h1>NOTE DETAILS</h1>
      <section>
        <h2>{note.title}</h2>
        <div>
          <div>
            <span>Entered:</span>
            <span>{formatDateString(note.date)}</span>
          </div>
          <div>
            <span>Follow Up:</span>
            <span>{formatDateString(note.date)}</span>
          </div>
        </div>
        <Markdown remarkPlugins={[]}>{note.note}</Markdown>
      </section>
    </div>
  );
}
