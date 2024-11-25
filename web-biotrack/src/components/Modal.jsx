import { Dialog, DialogBody, DialogFooter, Button } from "@material-tailwind/react";

function Modal({ onClose, children }) {
  return (
    <Dialog open={true} onClose={onClose}>
      <DialogBody className="max-h-[65vh] overflow-y-auto">
        {children}
      </DialogBody>
      <DialogFooter>
        <Button variant="outlined" color="gray" onClick={onClose}>
          Fechar
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default Modal;
