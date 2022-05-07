import starIcon from "../icons/star.svg";
import editIcon from "../icons/edit.svg";
import deleteIcon from "../icons/delete.svg";
import {TextContainer, TextElement, DateElement} from "./styles/Item/TextContainer";
import {ButtonContainer, IconElement} from "./styles/Item/ButtonContainer";
import {ListContainer} from "./styles/Item/ListContainer";
import ItemFunc from "./logic/ItemFunc";


const Item = () => {
    const {active, changeImportant, displayFormNav, editFormNav} = ItemFunc();

    return (<ListContainer>
            <TextContainer onClick={displayFormNav}>
                <TextElement>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</TextElement>
                <TextElement>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</TextElement>
                <DateElement>17.05.22</DateElement>
            </TextContainer>

            <ButtonContainer>
                <IconElement name="star" active={active} onClick={changeImportant} type="image" src={starIcon}
                             alt="Przycisk Ważne"/>
                <IconElement name="edit" type="image" onClick={editFormNav} src={editIcon}
                             alt="Przycisk Edycji"/>
                <IconElement name="delete" type="image" src={deleteIcon} alt="Przycisk Usuwania"/>
            </ButtonContainer>
        </ListContainer>
    )
}


export default Item;