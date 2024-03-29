import Form, {
    Button,
    ButtonContainer,
    Input,
    Label,
    Slider,
    Switch,
    SwitchLabel,
    TaskFormContainer,
    Title
} from "../../components/faskForm/styles/TaskFormContainer";
import TaskFormFunc from "../../components/faskForm/logic/TaskFormFunc";
import SubmitModal from "../../components/submitModal/SubmitModal";


const TaskForm = ({type}: { type: "add" | "edit" | "display" }) => {
    const {
        navAhead,
        handleSubmit,
        errors,
        register,
        submitHandler,
        watch,
        checkValidity,
        showSubmitModal,
        submitMessage
    } = TaskFormFunc(type);

    return (<TaskFormContainer>
        <Title>
            <h1>
                {type === "add" ? "Dodawanie Zadania " : type === "edit" ? "Edytowanie Zadania " : "Twoje Zadanie"}
            </h1>
        </Title>

        <Form onSubmit={handleSubmit(data => submitHandler(data))}>
            <Label htmlFor="title" error={errors.title?.message}>
                Tytuł
                <Input id="title" autoFocus disabled={type === "display"}
                       placeholder={"Podaj tytuł:"} {...register("title")}
                       border={checkValidity("title")}/>
            </Label>

            <Label htmlFor="description" error={errors.description?.message}>
                Opis
                <Input disabled={type === "display"} placeholder={"Podaj opis:"}
                       {...register("description")} border={checkValidity("description")}/>
            </Label>

            <Label htmlFor="date" error={errors.date?.message}>
                Data
                <Input type="datetime-local" disabled={type === "display"}
                       {...register("date")} border={checkValidity("date")}/>
            </Label>

            <SwitchLabel htmlFor="important" error={errors.important?.message!}>
                Ważne
                <Switch type={"checkbox"} {...register("important")}
                        disabled={type === "display"}/>
                <Slider active={watch("important")} disabled={type === "display"}/>
            </SwitchLabel>

            <ButtonContainer>
                {type === "display" && <Button type={"button"} onClick={navAhead}>
                    Przejdź do edycji
                </Button>}

                {type !== "display" && <Button type="submit" disabled={showSubmitModal}>
                    {type === "add" ? "Dodaj" : "Potwierdź"}
                </Button>
                }
            </ButtonContainer>
        </Form>
        {showSubmitModal && <SubmitModal navAhead={navAhead} submitMessage={submitMessage}/>}
    </TaskFormContainer>)
}


export default TaskForm;