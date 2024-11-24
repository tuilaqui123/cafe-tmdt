const StateOrder = ({step, text}) => {
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 bg-[#A0522D] text-white rounded-full font-bold">
                {step}
            </div>
            <span className="text-black">{text}</span>
        </div>
    )
}

export default StateOrder