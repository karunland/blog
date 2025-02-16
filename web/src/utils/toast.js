import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

// Toastr genel ayarları
toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: true, // En son gelen en üstte görünsün
    progressBar: false,
    positionClass: "toast-top-right",
    preventDuplicates: true, // Aynı mesajların tekrarını engelle
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "3000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
    maxOpened: 1, // Aynı anda maksimum 1 toast göster
    autoDismiss: true // Yeni toast geldiğinde eskisini kapat
};

// Toast fonksiyonları
export const toast = {
    success: (message) => {
        toastr.clear(); // Önceki toastları temizle
        toastr.success(message);
    },
    error: (message) => {
        toastr.clear(); // Önceki toastları temizle
        toastr.error(message);
    },
    warning: (message) => {
        toastr.clear(); // Önceki toastları temizle
        toastr.warning(message);
    },
    info: (message) => {
        toastr.clear(); // Önceki toastları temizle
        toastr.info(message);
    },
    confirm: async (message, title = 'Are you sure?') => {
        return new Promise((resolve) => {
            toastr.options.onclick = () => resolve(true);
            toastr.options.onHidden = () => resolve(false);
            toastr.warning(message + '<br/><small>(Click to confirm)</small>', title);
        });
    }
};

export default toast; 