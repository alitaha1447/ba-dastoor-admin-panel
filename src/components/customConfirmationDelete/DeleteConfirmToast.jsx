import { toast } from 'react-toastify';

export const confirmToast = ({
    title = 'Are you sure?',
    confirmText = 'Yes, Confirm',
    cancelText = 'Cancel',
    confirmClass = 'bg-red-600',
    onConfirm,
}) => {
    toast.warning(
        ({ closeToast }) => (
            <div>
                <p className="font-medium mb-3">{title}</p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={closeToast}
                        className="px-3 py-1 border rounded-md text-sm"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={() => {
                            closeToast();
                            onConfirm();
                        }}
                        className={`px-3 py-1 text-white rounded-md text-sm ${confirmClass}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        ),
        {
            autoClose: false,
            closeOnClick: false,
        }
    );
};
