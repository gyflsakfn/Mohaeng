import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
  modalType: string;
  opacity: number;
}

const initialState: ModalState = {
  isOpen: false,
  modalType: " ",
  opacity: 0.6,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal(state, actions) {
      const { modalType, opacity } = actions.payload;
      state.isOpen = true;
      state.modalType = modalType;
      state.opacity = opacity;
    },
    closeModal(state) {
      state.isOpen = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export const selectModal = (state: { modal: any }) => state.modal;

export default modalSlice.reducer;
