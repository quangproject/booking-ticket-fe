import Swal from "sweetalert2";

class SwalService {
    confirmDialog(callback, message) {
        if (!message) {
            message = "Are you sure?";
        }
        return Swal.fire({
            title: message,
            icon: "question",
            confirmButtonColor: "#dc3545",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.isConfirmed) {
                callback();
            }
        });
    }

    confirmDelete(callback) {
        this.confirmDialog(callback, "Are you sure you want to delete this item?");
    }

    async confirmToHandle(title, icon, callback) {
        const result = await Swal.fire({
            title: title,
            icon: icon,
            showDenyButton: true,
            confirmButtonColor: "#dc3545",
            confirmButtonText: "Yes",
            denyButtonColor: 'gray',
            cancelButtonText: "No",
        });
        if (result.isConfirmed) {
            callback();
        }
        return false
    }

    async showMessageToHandle(title, message, icon, callback) {
        const result = await Swal.fire({
            title: title,
            text: message,
            icon: icon,
        });
        if (result.isConfirmed || result.isDismissed) {
            callback();
            return true;
        }
        return false
    }

    showMessage(title, message, icon) {
        Swal.fire({
            title: title,
            text: message,
            icon: icon,
        });
    }

    showCustomPosition(title, icon, position) {
        Swal.fire({
            position: position,
            icon: icon,
            title: title,
            showConfirmButton: false,
            timer: 1500
        });
    }

    showHtmlMessage(title, message, icon) {
        Swal.fire({
            title: title,
            html: message,
            icon: icon,
        });
    }

    showWithBootstrapButtons(message, callback) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-warning",
                cancelButton: "btn btn-danger me-3"
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons
            .fire({
                title: "Confirm your booking?",
                html: message,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, confirm it!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true
            })
            .then((result) => {
                if (result.isConfirmed) {
                    callback();
                }
            });
    }
}

const swalService = new SwalService();
export default swalService;