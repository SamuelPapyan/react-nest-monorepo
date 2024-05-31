import React, { useEffect, useState } from "react";
import ChatWindow from "../../common/ChatWindow";
import GroupChatService from "../../../services/groupChatService";
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Multiselect from "multiselect-react-dropdown";
import StudentService from "../../../services/studentService";

export default function GroupChatRow(props) {
    const [updated, setUpdated] = useState(false);
    const [visible, setVisible] = useState(false);
    const [show, setShow] = useState(false);
    const [memberList, setMemberList] = useState([]); 
    const handleClose = () => setShow(false);
    let _groupChatName, _members = React.createRef();
    function handleShow(){
        setShow(true);
    }

    useEffect(()=>{
        _groupChatName = document.querySelector('#group-chat-name-field-' + props.data._id)
        if (_groupChatName)
            _groupChatName.value = props.data.chat_name;
        if (!updated) {
            Promise.all(
                props.data.members.map(mem=>new Promise((resolve, reject)=>{
                    StudentService.getStudentById(mem).then(res=>{
                        resolve(res);
                    }).catch(err=>{
                        console.log(err.message)
                    })
                }))
            ).then(reses=>{
                setMemberList(reses.map(res=>{
                    return {
                        'name': res.data.username,
                        'value': res.data._id
                    }
                }))
                setUpdated(true);
            }).catch(err=>{
                console.log(err.message);
            })
        }
    })

    function deleteChat(){
        GroupChatService.deleteGroupChat(props.data._id).then(res=>{
            props.updateFunction(false);
        }).catch(err=>{
            console.log(err.message);
        })
    }

    function editGroupChat(){
        const requestData = {
            owner: props.userData.id,
            chat_name: _groupChatName.value,
            members: _members.current.getSelectedItems().map(mem=>mem.value)
        }
        GroupChatService.updateGroupChat(props.data._id, requestData).then(res=>{
            props.updateFunction(false);
            window.location.reload();
        }).catch(err=>{
            console.log(err.message);
        })
    }

    return (
        <>
            <div className="d-flex justify-content-between mx-5 my-2 p-2 align-items-center rounded bg-primary" style={{
                border: "1px solid azure"
            }}>
                <p className="d-block text-light"><b>{props.data.chat_name}</b></p>
                <div className="d-flex">
                    <button className="btn btn-success" onClick={handleShow}>
                        Edit
                    </button>
                    <button className="btn btn-danger" onClick={deleteChat}>
                        Delete
                    </button>
                    <div>
                        <img className="d-block"
                        alt="Chat Icon"
                        src={"/images/chat_icon.svg"} 
                        onClick={()=>setVisible(!visible)}
                        style={{
                            width:40,
                            height:40,
                            marginLeft: 10,
                            cursor: "pointer",
                        }}/>
                        <ChatWindow
                        setVisible={setVisible}
                        type="group_chat"
                        isStaff={true}
                        styles={{
                            primaryColor: "#033E8A", 
                        }}
                        data={{
                            user: props.userData.username,
                            coach: props.userData.username,
                        }}
                        visible={visible}
                        zIndex={100 + props.zIndex}
                        chatUsername={props.data.chat_name}
                        chatTitle={props.data.chat_name}
                        chatId={props.data._id}
                        />
                    </div>
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Group Chat</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label htmlFor="group-chat-name-field">Group Chat Name</label><br/>
                        <input className="form-control" id={"group-chat-name-field-" + props.data._id} type="text" name="group-chat-name"/>
                    </div>
                    <div className="form-group">
                        <label>Members</label>
                        <Multiselect
                            options={props.students}
                            selectedValues={memberList}
                            displayValue="name"
                            ref={_members}
                        >
                        </Multiselect>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={editGroupChat}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}