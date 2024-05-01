import { useEffect, useState } from "react";
import { ApiGetListAlbums } from "api/albums";
import { useParams, Link } from "react-router-dom";
import { Table, Button } from "reactstrap";
import { Spinner } from "components";
import { FaArrowLeft } from "react-icons/fa";
import Layout from "layout";
import useNavigate from "hooks/useNavigate";

const Albums = () => {
  const { handleGoBack } = useNavigate();

  const params = useParams();

  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ApiGetListAlbums({ userId: params.userId }).then((response) => {
      setAlbums(response);
      setIsLoading(false);
    });
  }, [params]);

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
                    <Link
                      to={`/albums/${album.userId}/photos/${album.id}`}
                      className="btn btn-primary"
                    >
                      Read Photos
                    </Link>
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
