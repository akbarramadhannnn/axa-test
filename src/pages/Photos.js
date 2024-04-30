import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ApiGetListPhotoAlbums } from "api/albums";
import { Spinner, CardPhoto } from "components";
import { Button, Row, Col } from "reactstrap";
import { FaArrowLeft } from "react-icons/fa";
import Layout from "layout";
import useGoBack from "hooks/useGoBack";

const Photos = () => {
  const { handleGoBack } = useGoBack();
  const params = useParams();

  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ApiGetListPhotoAlbums({ albumId: params.albumId }).then((response) => {
      setPhotos(response);
      setIsLoading(false);
    });
  }, [params]);

  return (
    <Layout>
      <div className="d-flex align-items-center mb-4">
        <Button className="me-3" color="light" onClick={handleGoBack}>
          <FaArrowLeft />
        </Button>

        <h1 className="m-0 p-0">Photos</h1>
      </div>

      {isLoading ? <Spinner /> : null}

      <Row>
        {photos.map((photo, index) => {
          return (
            <Col md="4" key={index}>
              <CardPhoto imageUrl={photo.url} title={photo.title} />
            </Col>
          );
        })}
      </Row>
    </Layout>
  );
};

export default Photos;
