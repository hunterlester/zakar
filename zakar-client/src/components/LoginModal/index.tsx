import React, { ReactElement } from 'react';
import './LoginModal.css';

interface Props {
    closeModal: () => void;
}

const LoginModal = (props: Props): ReactElement => {

    return (
        <div className="LoginModalContainer">
            <p>Please login to unlock all features.</p>
            <div className="ModalButtons">
              <a href="/login">
                <button className="ModalButton">Login</button>
              </a>
              <button onClick={props.closeModal} className="ModalButton">Close</button>
            </div>
        </div>
    );
};

export default LoginModal;