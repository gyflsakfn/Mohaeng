import styled from "styled-components";
import { closeModal } from "../../store/reducers/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import LoginModal from "./LoginModal";
import BasicModal from "./BasicModal";
import DeleteMemberModal from "./DeleteMemberModal";
import { useAppSelector } from "@/src/hooks/useReduxHooks";
import HeaderSideMenu from "../Header/HeaderSideMenu";

interface ModalComponent {
  type: string;
  component: JSX.Element;
}

const MODAL_TYPES = {
  LoginModal: "LoginModal",
  BasicModal: "BasicModal",
  DeleteMemberModal: "DeleteMemberModal",
  MenuModal: "HeaderSideMenu",
} as const;

const MODAL_COMPONENTS: ModalComponent[] = [
  {
    type: MODAL_TYPES.LoginModal,
    component: <LoginModal />,
  },
  {
    type: MODAL_TYPES.BasicModal,
    component: <BasicModal />,
  },
  {
    type: MODAL_TYPES.DeleteMemberModal,
    component: <DeleteMemberModal />,
  },
  { type: MODAL_TYPES.MenuModal, component: <HeaderSideMenu /> },
];

export default function GlobalModal() {
  const { modalType, isOpen, opacity } = useAppSelector((state) => state.modal);
  const dispatch = useDispatch();
  if (!isOpen) return null;

  const findModal = MODAL_COMPONENTS.find((modal) => {
    return modal.type === modalType;
  });

  const renderModal = () => {
    return findModal?.component;
  };
  return (
    <Container>
      <Overlay opacity={opacity} onClick={() => dispatch(closeModal())} />
      {renderModal()}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  inset: 0;
  z-index: 3;
`;
const Overlay = styled.div<{ opacity: number }>`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, ${(props) => props.opacity ?? 0.6});
`;
