const NoteModal = ({ showModal, note, onClose }) => {
    if (!showModal) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Ghi chú</h3>
                <div className="max-h-[200px] overflow-y-auto">
                    {note ? (
                        <p className="text-gray-600 whitespace-pre-wrap break-words">
                            {note}
                        </p>
                    ) : (
                        <p className="text-gray-400 italic">Không có ghi chú</p>
                    )}
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                        onClick={onClose}
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NoteModal