import { useCallback, useEffect, useState } from "react";
import {
  ApiGetListPosts,
  ApiGetListPostsComments,
  ApiGeDetailPosts,
  ApiAddPost,
  ApiUpdatePosts,
  ApiDeletePosts,
} from "api/posts";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
} from "reactstrap";
import Layout from "layout";
import { Spinner, CardPost } from "components";
import {
  FaPencilAlt,
  FaTrash,
  FaRegWindowClose,
  FaArrowLeft,
} from "react-icons/fa";
import useGoBack from "hooks/useGoBack";

const Posts = () => {
  const { handleGoBack } = useGoBack();

  const params = useParams();
  const location = useLocation();

  // posts
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [posts, setPosts] = useState([]);
  const [postId, setPostId] = useState("");

  // modal comment
  const [modalComment, setModalComment] = useState({
    isOpen: false,
    isLoading: false,
    title: "",
    body: "",
    comments: [],
    valueComments: "",
    indexComments: "",
    isDisabledButton: true,
  });
  const [isUpdateComment, setIsUpdateComment] = useState(false);

  // modal form
  const [modalForm, setModalForm] = useState({
    isOpen: false,
    title: "",
    btnTextRight: "",
    isLoading: false,
    valueTitle: "",
    valueBody: "",
    isDisabledButton: true,
  });

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
    if (!modalForm.valueTitle.length || !modalForm.valueBody.length) {
      setModalForm((oldState) => ({
        ...oldState,
        isDisabledButton: true,
      }));
    } else {
      setModalForm((oldState) => ({
        ...oldState,
        isDisabledButton: false,
      }));
    }
  }, [modalForm.valueTitle, modalForm.valueBody]);

  useEffect(() => {
    ApiGetListPosts({ userId: params.userId }).then((response) => {
      setPosts(response);
      setIsLoadingPosts(false);
    });
  }, [params]);

  // add / update
  const handleOpenModalForm = useCallback(
    ({ postId = "", title = "", btnText = "" }) => {
      if (postId) {
        setModalForm((oldState) => ({
          ...oldState,
          isLoading: true,
        }));
        setPostId(postId);
        ApiGeDetailPosts({ postId }).then((response) => {
          setModalForm((oldState) => ({
            ...oldState,
            isLoading: false,
            valueTitle: response.title,
            valueBody: response.body,
          }));
        });
      }

      setModalForm((oldState) => ({
        ...oldState,
        isOpen: true,
        title,
        btnTextRight: btnText,
      }));
    },
    []
  );

  const handleCloseModalForm = useCallback(() => {
    setModalForm((oldState) => ({
      ...oldState,
      isOpen: false,
      isLoading: false,
      title: "",
      btnTextRight: "",
      valueTitle: "",
      valueBody: "",
    }));
    setPostId("");
  }, []);

  const handleChangeTitle = useCallback((e) => {
    const { value } = e.target;
    setModalForm((oldState) => ({
      ...oldState,
      valueTitle: value,
    }));
  }, []);

  const handleChangeBody = useCallback((e) => {
    const { value } = e.target;
    setModalForm((oldState) => ({
      ...oldState,
      valueBody: value,
    }));
  }, []);

  const handleSubmitModalForm = useCallback(() => {
    const payload = {
      title: modalForm.valueTitle,
      body: modalForm.valueBody,
      userId: params.userId,
    };
    if (modalForm.btnTextRight === "Add") {
      ApiAddPost({ payload }).then((response) => {
        setPosts((oldState) => [...oldState, response]);
        handleCloseModalForm();
      });
    } else {
      payload.id = postId;
      ApiUpdatePosts({ postId, payload }).then((response) => {
        const state = [...posts];
        const index = state.map((d) => d.id).indexOf(postId);
        state[index] = response;
        setPosts(state);
        handleCloseModalForm();
      });
    }
  }, [modalForm, params, handleCloseModalForm, postId, posts]);

  // delete
  const handleOnclickDelete = useCallback(
    ({ postId = "" }) => {
      ApiDeletePosts({ postId }).then((response) => {
        const state = [...posts];
        const index = state.map((d) => d.id).indexOf(postId);
        state.splice(index, 1);
        setPosts(state);
      });
    },
    [posts]
  );

  // comments
  const handleCloseModalComments = useCallback(() => {
    setModalComment((oldState) => ({
      ...oldState,
      isOpen: false,
      title: "",
      body: "",
      comments: [],
      valueComments: "",
      indexComments: "",
      isDisabledButton: true,
    }));
    setIsUpdateComment(false);
  }, []);

  const handleCLickComments = useCallback(
    ({ postId = "", title = "", body = "" }) => {
      setModalComment((oldState) => ({
        ...oldState,
        isOpen: true,
        isLoading: true,
      }));
      ApiGetListPostsComments({ postId }).then((response) => {
        setModalComment((oldState) => ({
          ...oldState,
          isLoading: false,
          title,
          body,
          comments: response,
        }));
      });
    },
    []
  );

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
      {/* <div className="mb-4">
        <h1>Posts</h1>
      </div> */}

      <div className="d-flex align-items-center justify-content-between mt-4 mb-4">
        <div className="d-flex align-items-center">
          <Button className="me-3" color="light" onClick={handleGoBack}>
            <FaArrowLeft />
          </Button>

          <h1 className="m-0 p-0">Posts</h1>
        </div>

        <Button
          color="primary"
          onClick={() =>
            handleOpenModalForm({ title: "Add New Post", btnText: "Add" })
          }
        >
          Add New Post
        </Button>
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
                    onClickUpdate={() =>
                      handleOpenModalForm({
                        title: "Update Post",
                        btnText: "Update",
                        postId: post.id,
                      })
                    }
                    onClickDelete={() =>
                      handleOnclickDelete({ postId: post.id })
                    }
                    onClickComment={() =>
                      handleCLickComments({
                        postId: post.id,
                        title: post.title,
                        body: post.body,
                      })
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
        <ModalHeader toggle={handleCloseModalComments}>Details</ModalHeader>

        {modalComment.isLoading ? <Spinner /> : null}

        {!modalComment.isLoading ? (
          <>
            <ModalBody className="p-0">
              <div className="px-3 my-3">
                <h4>{modalComment.title}</h4>

                <p>{modalComment.body}</p>
              </div>

              <div className="border mb-3 mt-4 px-3 py-2">
                <h5 className="p-0 m-0">Comments</h5>
              </div>

              {modalComment.comments.map((comment, index) => {
                return (
                  <div
                    key={index}
                    className={`px-3 ${
                      modalComment.comments.length - 1 === index
                        ? "mb-3"
                        : "pb-3 mb-3 border-bottom"
                    }`}
                  >
                    <div className="d-flex justify-content-between">
                      <h6>{comment.email}</h6>

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

                    <p className="mb-0 font-weight-lighter">{comment.body}</p>
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

      <Modal isOpen={modalForm.isOpen}>
        <ModalHeader toggle={handleCloseModalForm}>
          {modalForm.title}
        </ModalHeader>

        {modalForm.isLoading ? <Spinner /> : null}

        {!modalForm.isLoading ? (
          <>
            <ModalBody>
              <div className="mb-3">
                <Label>Title</Label>
                <Input
                  value={modalForm.valueTitle}
                  onChange={handleChangeTitle}
                />
              </div>

              <div>
                <Label>Body</Label>
                <Input
                  type="textarea"
                  value={modalForm.valueBody}
                  onChange={handleChangeBody}
                />
              </div>
            </ModalBody>

            <ModalFooter>
              <Button color="secondary" onClick={handleCloseModalForm}>
                Cancel
              </Button>
              <Button
                color="primary"
                onClick={handleSubmitModalForm}
                disabled={modalForm.isDisabledButton}
              >
                {modalForm.btnTextRight}
              </Button>{" "}
            </ModalFooter>
          </>
        ) : null}
      </Modal>
    </Layout>
  );
};

export default Posts;
