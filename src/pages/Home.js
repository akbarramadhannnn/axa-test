import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table } from "reactstrap";
import { ApiGetListUsers } from "api/users";
import Layout from "layout";
import { Spinner } from "components";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ApiGetListUsers().then((response) => {
      setUsers(response);
      setIsLoading(false);
    });
  }, []);

  return (
    <Layout>
      <div className="mb-4">
        <h1>Users</h1>
      </div>

      <Table>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>

        {!isLoading &&
          users.map((user, index) => {
            return (
              <tbody key={index}>
                <tr>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <Link
                      to={`/posts/${user.id}`}
                      className="btn btn-primary me-3"
                    >
                      Posts
                    </Link>
                    <Link
                      to={`/albums/${user.id}`}
                      className="btn btn-primary me-3"
                    >
                      Albums
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

export default Home;
