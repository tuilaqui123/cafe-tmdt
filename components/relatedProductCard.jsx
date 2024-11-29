import { useRouter } from "next/navigation"
import Image from "next/image"

const RelatedProductCard = ({ product }) => {
    const router = useRouter()

    const formatNameProduct = (name) => name.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
    const formatNumber = (number) => {
        return new Intl.NumberFormat('de-DE').format(number)
    }

    return (
        <div 
            onClick={() => router.push(`/menu/${product._id}`)}
            className="group flex items-center space-x-4 bg-white/50 backdrop-blur-sm p-3 rounded-xl cursor-pointer hover:bg-white/80 transition-all duration-300"
        >
            <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.discount > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-red-500/80 text-white text-xs text-center py-1">
                        -{product.discount}% OFF
                    </div>
                )}
            </div>
    
            <div className="flex-grow min-w-0">
                <h3 className="text-gray-800 font-medium line-clamp-1 group-hover:text-[#4c2113] transition-colors">
                    {formatNameProduct(product.name)}
                </h3>
            
                <div className="mt-1 space-y-1">
                    <div className="flex items-baseline gap-2">
                        <span className="text-[#4c2113] font-bold">
                            {formatNumber(product.type[0].price - (product.type[0].price * product.discount / 100))}đ
                        </span>
                        {product.discount > 0 && (
                            <span className="text-xs text-gray-500">
                                {formatNumber(product.type[0].price)}đ
                            </span>
                        )}
                    </div>
                    <div className="flex items-baseline gap-2">
                        {/* <span className="text-gray-500">
                            {formatNumber(product.type[0])}đ
                        </span> */}
                        {/* {product.discount > 0 && (
                            <span className="text-xs text-gray-500">
                                {formatNumber(caculatePrice(product.type[0]))}đ
                            </span>
                        )} */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RelatedProductCard