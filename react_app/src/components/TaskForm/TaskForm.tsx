import styles from "./TaskForm.module.scss";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Formik} from "formik";
import {Button, Col, InputGroup, Row, Form, Modal} from "react-bootstrap";
import Axios from "axios";
import {NavLink, useNavigate, useParams} from "react-router-dom";
import dateFormat from "dateformat";
import {formikSchema, toTitle} from "../helpers/helpers";
import {ITask} from "../helpers/Interfaces";
import ErrorLoadingProvider from "../ErrorLoadingProvider/ErrorLoadingProvider";


type TypeArray = { id: number, name: string }[];

const TaskForm: React.FC<{ actionType: string }> = ({actionType}) => {
    const initialState = useMemo(() => ({
        notificationDate: "",
        description: "",
        important: false,
        taskType: "Default",
        title: ""
    }), [])


    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");
    const [errorOccur, setErrorOccur] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editData, setEditData] = useState<ITask>(initialState);
    const [typeArray, setTypeArray] = useState<TypeArray>([]);

    const {id} = useParams();
    const navigate = useNavigate();

    const submitHandler = async (data: ITask) => {
        try {
            if (actionType === "add") {
                await Axios.post("/tasks", data);
            } else if (actionType === "edit") {
                await Axios.put(`/tasks/${id}`, data);
            }
            setSubmitMessage(`${actionType === "add" ? "Dodawanie" : "Edytowanie"} powiodło się.`);

        } catch (err: any) {
            setSubmitMessage(`${actionType === "add" ? "Dodawanie" : "Edytowanie"} nie powiodło się,
             wystąpił błąd: ${err.message}`);
        } finally {
            setShowSubmitModal(true);
        }
    }

    const fetchTypes = useCallback(() => {
        Axios.get('/types').then(({data}) => {
            const convertedDate: TypeArray = data.map(({id, name}: { id: number, name: string }) => {
                return {id: id, name: toTitle(name)};
            })

            setTypeArray(convertedDate);
            setLoading(false);
        }).catch(() => {
            setErrorOccur(true)
        });
    }, [])


    const fetchTasks = useCallback(() => {
        if (actionType === "edit") {
            Axios.get(`/tasks/${id}`).then(({data}) => {
                setEditData({
                    ...data,
                    notificationDate: dateFormat(data.notificationDate, "yyyy-mm-dd'T'HH:MM")
                })
            }).catch(() => setErrorOccur(true));
        } else {
            setEditData(initialState)
        }
    }, [actionType, id, initialState])


    useEffect(() => {
        fetchTypes()
        fetchTasks()
    }, [fetchTypes, fetchTasks])


    return <div className={styles["form-container"]}>
        <h1>{actionType === "add" ? "Dodawanie" : "Edytowanie"} Zadania</h1>

        <ErrorLoadingProvider loading={loading} errorOccur={errorOccur}>
            <Formik onSubmit={submitHandler}
                    initialValues={editData}
                    validationSchema={formikSchema}
                    enableReinitialize={true}>
                {({
                      handleSubmit,
                      handleChange,
                      handleBlur,
                      values,
                      touched,
                      errors,
                  }) =>
                    (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Row className="mb-5 mt-5">
                                <Form.Group as={Col} md="max" controlId="titleForm">
                                    <Form.Label className={styles["form-label"]}>Tytuł</Form.Label>
                                    <InputGroup hasValidation>
                                        <Form.Control
                                            type="text"
                                            name="title"
                                            value={toTitle(values.title)}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.title && !errors.title}
                                            isInvalid={touched.title && !!errors.title}
                                            autoFocus
                                        />
                                        <Form.Control.Feedback type="valid" tooltip> Zgodne </Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid" tooltip>
                                            {errors.title}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                            </Row>

                            <Row className="mb-5">
                                <Form.Group as={Col} md="max" controlId="descriptionForm">
                                    <Form.Label className={styles["form-label"]}>Opis</Form.Label>
                                    <InputGroup hasValidation>
                                        <Form.Control
                                            type="text"
                                            name="description"
                                            value={values.description}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.description && !errors.description}
                                            isInvalid={touched.description && !!errors.description}
                                        />
                                        <Form.Control.Feedback type="valid" tooltip> Zgodne </Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid" tooltip>
                                            {errors.description}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                            </Row>

                            <Row className="mb-5">
                                <Form.Group as={Col} md="max" controlId="dateForm">
                                    <Form.Label className={styles["form-label"]}>Data</Form.Label>
                                    <InputGroup hasValidation>
                                        <Form.Control
                                            type="datetime-local"
                                            name="notificationDate"
                                            defaultValue={values.notificationDate}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.notificationDate && !errors.notificationDate}
                                            isInvalid={touched.notificationDate && !!errors.notificationDate}
                                        />
                                        <Form.Control.Feedback type="valid" tooltip> Zgodne </Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid" tooltip>
                                            {errors.notificationDate}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                            </Row>

                            <Row className="mb-5">
                                <Form.Group as={Col} md="max" controlId="taskTypeForm">
                                    <Form.Label className={styles["form-label"]}>Typ Aktywności</Form.Label>
                                    <InputGroup hasValidation>
                                        <Form.Select
                                            name="taskType"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.taskType}
                                            isValid={touched.taskType && !errors.taskType}
                                            isInvalid={touched.taskType && !!errors.taskType}
                                        >
                                            <option value="Default" key="Default"> Wybierz opcję:</option>
                                            {typeArray.map(({id, name}) => <option value={name}
                                                                                   key={id}> {name} </option>)}
                                        </Form.Select>

                                        <Form.Control.Feedback type="valid" tooltip> Zgodne </Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid" tooltip>
                                            {errors.taskType}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                            </Row>

                            <Row className="mb-2">
                                <Form.Group as={Col} md="max" controlId="importantForm">
                                    <Form.Label className={styles["form-label"]}> Ważne </Form.Label>
                                    <InputGroup hasValidation>
                                        <Form.Check
                                            className={"mt-2"}
                                            type="switch"
                                            id="custom-switch"
                                            name="important"
                                            checked={values.important}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isValid={touched.important && !errors.important}
                                            isInvalid={touched.important && !!errors.important}
                                        />
                                        <Form.Control.Feedback type="valid" tooltip> Zgodne </Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid" tooltip>
                                            {errors.important}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                            </Row>

                            <Modal show={showSubmitModal} onHide={() => {
                                navigate("/active")
                            }}>
                                <Modal.Body>{submitMessage}</Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShowSubmitModal(false)}>
                                        <NavLink to="/active"> Ok </NavLink>
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                            <Button className="btn mt-5"
                                    type="submit"> {actionType === "add" ? "Dodaj" : "Edytuj"} </Button>
                        </Form>
                    )
                }
            </Formik>
        </ErrorLoadingProvider>
    </div>
}


export default TaskForm;