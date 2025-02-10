import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

// Configure toastr
toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: true,
    progressBar: true,
    positionClass: "toast-top-right",
    preventDuplicates: false,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "5000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut"
};

export const toast = {
    success: (message, title = '') => toastr.success(message, title),
    error: (message, title = '') => toastr.error(message, title),
    warning: (message, title = '') => toastr.warning(message, title),
    info: (message, title = '') => toastr.info(message, title),
    confirm: async (message, title = 'Are you sure?') => {
        return new Promise((resolve) => {
            toastr.options.onclick = () => resolve(true);
            toastr.options.onHidden = () => resolve(false);
            toastr.warning(message + '<br/><small>(Click to confirm)</small>', title);
        });
    }
}; 