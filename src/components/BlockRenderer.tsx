import { type Block } from "../utils/types";

interface Props {
  block: Block;
}

export default function BlockRenderer({ block }: Props) {
  const { blockType, props, children } = block;
  switch (blockType) {
    case "text":
      return (
        <div className="resume-item">
          <div className="resume-item-value resume-item-string">
            {props?.text}
          </div>
        </div>
      );

    case "heading":
      return (
        <div className="resume-item">
          <div className="resume-item-name">{props?.text}</div>
        </div>
      );

    case "image":
      return (
        <div className="resume-item">
          <div className="resume-item-value resume-item-image">
            <img src={props?.src} className="resume-image" />
          </div>
        </div>
      );

    case "link":
      return (
        <div className="resume-item">
          <a
            className="resume-item-value resume-item-string"
            href={props?.url}
            target="_blank"
          >
            {props?.text}
          </a>
        </div>
      );

    case "divider":
      return <hr className="resume-divider" />;

    case "list":
      return (
        <div className="resume-item-value resume-item-array">
          {children?.map((child) => (
            <BlockRenderer key={child.id} block={child} />
          ))}
        </div>
      );

    default:
      return null;
  }
}
