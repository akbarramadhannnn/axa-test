import { useCallback, useEffect, useState } from "react";
import { ApiGetListPosts, ApiGetListPostsComments } from "api/posts";
import { useParams, useLocation } from "react-router-dom";
import {
  Button,
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";
import Layout from "layout";
import { Spinner, CardPost } from "components";
import { FaPencilAlt, FaTrash, FaRegWindowClose } from "react-icons/fa";

const Posts = () => {
  const params = useParams();
  const location = useLocation();

  // posts
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [posts, setPosts] = useState([]);

  // modal comment
  const [modalComment, setModalComment] = useState({
    isOpen: false,
    isLoading: false,
    comments: [],
    valueComments: "",
    indexComments: "",
    isDisabledButton: true,
  });
  const [isUpdateComment, setIsUpdateComment] = useState(false);

  useEffect(() => {
    if (!modalComment.valueComments.length) {
      setModalComment((oldState) => ({
        ...oldState,
        isDisabledButton: true,
      }));
    } else {
      setModalComment((oldState) => ({
        ...oldState,
        isDisabledButton: false,
      }));
    }
  }, [modalComment.valueComments]);

  useEffect(() => {
    ApiGetListPosts({ userId: params.userId }).then((response) => {
      setPosts(response);
      setIsLoadingPosts(false);
    });
  }, [params]);

  // comments
  const handleCloseModalComments = useCallback(() => {
    setModalComment((oldState) => ({
      ...oldState,
      isOpen: false,
      comments: [],
      valueComments: "",
      indexComments: "",
      isDisabledButton: true,
    }));
    setIsUpdateComment(false);
  }, []);

  const handleCLickComments = useCallback(({ postId = "" }) => {
    setModalComment((oldState) => ({
      ...oldState,
      isOpen: true,
      isLoading: true,
    }));
    ApiGetListPostsComments({ postId }).then((response) => {
      setModalComment((oldState) => ({
        ...oldState,
        isLoading: false,
        comments: response,
      }));
    });
  }, []);

  const handleChangeInputComments = useCallback((e) => {
    const { value } = e.target;
    setModalComment((oldState) => ({
      ...oldState,
      valueComments: value,
    }));
  }, []);

  const handleAddOrUpdateComments = useCallback(() => {
    if (modalComment.indexComments) {
      const comments = [...modalComment.comments];
      comments[modalComment.indexComments].body = modalComment.valueComments;
      setModalComment((oldState) => ({
        ...oldState,
        valueComments: "",
        indexComments: "",
      }));
      setIsUpdateComment(false);
    } else {
      const email = location.state.email;
      const payload = {
        isDelete: false,
        isUpdate: false,
        email: email,
        body: modalComment.valueComments,
      };

      setModalComment((oldState) => ({
        ...oldState,
        comments: [...oldState.comments, payload],
        valueComments: "",
      }));
    }
  }, [modalComment, location]);

  const handleDeleteComments = useCallback(
    ({ index }) => {
      const comments = [...modalComment.comments];
      comments.splice(index, 1);
      setModalComment((oldState) => ({
        ...oldState,
        comments,
      }));
    },
    [modalComment]
  );

  const handleUpdateComments = useCallback(({ value, index }) => {
    setIsUpdateComment(true);
    setModalComment((oldState) => ({
      ...oldState,
      valueComments: value,
      indexComments: index,
    }));
  }, []);

  const handleCancelUpdateComments = useCallback(() => {
    setIsUpdateComment(false);
    setModalComment((oldState) => ({
      ...oldState,
      valueComments: "",
      indexComments: "",
    }));
  }, []);

  return (
    <Layout>
      <div className="mb-4">
        <h1>Posts</h1>
      </div>

      {isLoadingPosts ? <Spinner /> : null}

      {!isLoadingPosts ? (
        <Row>
          {posts.length > 0 &&
            posts.map((post, index) => {
              return (
                <Col md="6" className="mb-4" key={index}>
                  <CardPost
                    id={post.id}
                    title={post.title}
                    body={post.body}
                    // onClickUpdate={() =>
                    //   handleOnclickUpdate({ postId: post.id })
                    // }
                    // onClickDelete={() =>
                    //   handleOnclickDelete({ postId: post.id })
                    // }
                    onClickComment={() =>
                      handleCLickComments({ postId: post.id })
                    }
                  />
                </Col>
              );
            })}
        </Row>
      ) : null}

      <Modal
        isOpen={modalComment.isOpen}
        toggle={handleCloseModalComments}
        scrollable
      >
        <ModalHeader toggle={handleCloseModalComments}>Comments</ModalHeader>

        {modalComment.isLoading ? <Spinner /> : null}

        {!modalComment.isLoading ? (
          <>
            <ModalBody>
              {modalComment.comments.map((comment, index) => {
                return (
                  <div
                    key={index}
                    className={`${
                      modalComment.comments.length - 1 === index
                        ? ""
                        : "pb-4 mb-4 border-bottom"
                    }`}
                  >
                    <div className="d-flex justify-content-between mb-1">
                      <h4>{comment.email}</h4>

                      <div>
                        {!isUpdateComment && comment.isUpdate !== undefined ? (
                          <Button
                            size="sm"
                            color="warning"
                            className="me-3"
                            onClick={() =>
                              handleUpdateComments({
                                value: comment.body,
                                index,
                              })
                            }
                          >
                            <FaPencilAlt />
                          </Button>
                        ) : null}

                        {!isUpdateComment && comment.isDelete !== undefined ? (
                          <Button
                            size="sm"
                            color="danger"
                            onClick={() =>
                              handleDeleteComments({
                                index,
                              })
                            }
                          >
                            <FaTrash />
                          </Button>
                        ) : null}
                      </div>
                    </div>

                    <p className="mb-0">{comment.body}</p>
                  </div>
                );
              })}
            </ModalBody>

            <ModalFooter className="border-0 p-0">
              {isUpdateComment ? (
                <div className="w-100 px-2 py-1 d-flex justify-content-between align-items-center border">
                  <p className="m-0">Mengedit pesan</p>

                  <FaRegWindowClose onClick={handleCancelUpdateComments} />
                </div>
              ) : null}

              <div className="d-flex w-100 border p-3">
                <Input
                  className="me-3"
                  value={modalComment.valueComments}
                  onChange={handleChangeInputComments}
                />
                <Button
                  color="primary"
                  disabled={modalComment.isDisabledButton}
                  onClick={handleAddOrUpdateComments}
                >
                  Comment
                </Button>
              </div>
            </ModalFooter>
          </>
        ) : null}
      </Modal>
    </Layout>
  );
};

export default Posts;
