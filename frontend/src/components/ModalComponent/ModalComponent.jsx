import { Modal } from 'antd'
import React from 'react'

const ModalComponent = ({ title = 'Modal', isOpen = false, children, okButtonProps, ...rests }) => {
  const mergedOkButtonProps = {
    className: ['admin-save-btn', okButtonProps?.className].filter(Boolean).join(' '),
    ...okButtonProps
  }

  return (
     <Modal
        title={title}
        open={isOpen}
        okButtonProps={mergedOkButtonProps}
        {...rests}
      >
        {children}
      </Modal>
  )
}

export default ModalComponent