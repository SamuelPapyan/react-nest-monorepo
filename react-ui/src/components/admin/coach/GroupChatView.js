import Multiselect from "multiselect-react-dropdown";
import React, {useState, useEffect} from "react";
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import GroupChatService from "../../../services/groupChatService";
import GroupChatList from "./GroupChatList";
import { useTranslation } from "react-i18next";

export default function GroupChatView(props) {
    const {t} = useTranslation();
    const [data, setData] = useState([])
    const [show, setShow] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [chats, setChats] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    let _groupChatName, _members = React.createRef();

    useEffect(()=>{
        if (!updated && props.data) {
            const updatedData = props.data.map(val=>{
                return {
                    'name': val.username,
                    'value': val.id
                }
            })
            GroupChatService.getGroupChatsByOwner(props.userData.id).then(res=>{
                setChats(res.data);
                setData(updatedData);
                setUpdated(true);
            }).catch(err=>{
                console.log(err.message);
            })
        }
    })

    function createGroupChat(){
        const requestData = {
            owner: props.userData.id,
            chat_name: _groupChatName.value,
            members: _members.current.getSelectedItems().map(mem=>mem.value)
        }
        GroupChatService.addGroupChat(requestData).then(res=>{
            setUpdated(false);
            handleClose();
        }).catch(err=>{
            console.log(err.message);
        })
    }

    return (
        <>
            <h2>{t("textGroupChats")}</h2>
            <GroupChatList data={chats} userData={props.userData} updateFunction={setUpdated} students={data}/>
            <Button variant="primary" onClick={handleShow}>
                {t("textCreateGroupChat")}
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t("textCreateGroupChat")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label htmlFor="group-chat-name-field">{t("labelGroupChatName")}</label><br/>
                        <input className="form-control" id="group-chat-name-field" type="text" name="group-chat-name" ref={(a) => _groupChatName = a}/>
                    </div>
                    <div className="form-group">
                        <label>{t("labelMembers")}</label>
                        <Multiselect
                            options={data}
                            displayValue="name"
                            ref={_members}
                        >
                        </Multiselect>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {t("textCancel")}
                    </Button>
                    <Button variant="primary" onClick={createGroupChat}>
                        {t("textCreate")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}