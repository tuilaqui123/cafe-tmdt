import { useState, useEffect } from "react"

const NoteModal = ({ showModal, note, index, onClose, handleNoteChange }) => {
    const [editedNote, setEditedNote] = useState(note || '')

    useEffect(() => {
        setEditedNote(note || '')
    }, [note])

    const handleSave = () => {
        handleNoteChange(index, editedNote)
        onClose()
    }
    if (!showModal) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Chỉnh sửa ghi chú</h3>
                <textarea
                    className="w-full p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#A0522D]"
                    rows="4"
                    value={editedNote}
                    onChange={(e) => setEditedNote(e.target.value)}
                    placeholder="Nhập ghi chú..."
                    maxLength={200}
                />
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                        onClick={onClose}
                    >
                        Hủy
                    </button>
                    <button
                        className="px-4 py-2 bg-[#A0522D] text-white rounded hover:bg-[#8B4513]"
                        onClick={handleSave}
                    >
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NoteModal