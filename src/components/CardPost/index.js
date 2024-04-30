import { memo } from "react";
import { Card, CardBody, CardTitle, CardText, Button } from "reactstrap";
import { FaPencilAlt, FaTrash, FaComment } from "react-icons/fa";

const CardPost = memo(
  ({
    title,
    body,
    onClickUpdate = () => {},
    onClickDelete = () => {},
    onClickComment = () => {},
  }) => {
    return (
      <Card
        style={{
          minHeight: 200,
        }}
      >
        <CardBody className="d-flex flex-column justify-content-between">
          <div>
            {title ? <CardTitle tag="h5">{title}</CardTitle> : null}
            {body ? <CardText>{body}</CardText> : null}
          </div>

          <div className="d-flex justify-content-end mt-4">
            <Button className="me-3" onClick={onClickComment}>
              <FaComment />
            </Button>
            <Button color="warning" className="me-3" onClick={onClickUpdate}>
              <FaPencilAlt />
            </Button>
            <Button color="danger" onClick={onClickDelete}>
              <FaTrash />
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }
);

export default CardPost;
