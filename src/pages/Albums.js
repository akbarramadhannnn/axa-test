import { useCallback, useEffect, useState } from "react";
import { ApiGetListAlbums } from "api/albums";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button } from "reactstrap";
import { Spinner } from "components";
import { FaArrowLeft } from "react-icons/fa";
import Layout from "layout";

const Albums = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ApiGetListAlbums({ userId: params.userId }).then((response) => {
      setAlbums(response);
      setIsLoading(false);
    });
  }, [params]);

  const handleGoToPhotos = useCallback(
    ({ userId = "", albumId = "" }) => {
      navigate(`/albums/${userId}/photos/${albumId}`);
    },
    [navigate]
  );

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <Layout>
      <div className="d-flex align-items-center mb-4">
        <Button className="me-3" color="light" onClick={handleGoBack}>
          <FaArrowLeft />
        </Button>

        <h1 className="m-0 p-0">Albums</h1>
      </div>

      <Table>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Actions</th>
          </tr>
        </thead>

        {!isLoading &&
          albums.map((album, index) => {
            return (
              <tbody key={index}>
                <tr>
                  <td>{album.title}</td>
                  <td>
                    <Button
                      className="me-3"
                      color="primary"
                      onClick={() =>
                        handleGoToPhotos({
                          albumId: album.id,
                          userId: album.userId,
                        })
                      }
                    >
                      Read Photos
                    </Button>
                  </td>
                </tr>
              </tbody>
            );
          })}
      </Table>

      {isLoading ? <Spinner /> : null}
    </Layout>
  );
};

export default Albums;
