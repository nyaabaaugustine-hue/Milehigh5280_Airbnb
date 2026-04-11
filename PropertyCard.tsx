import Link from 'next/link';

export default function PropertyCard({ property }: { property: any }) {
  return (
    <Link href={`/properties/${property.slug || property.id}`} className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-3xl bg-gray-200 aspect-square">
        <img
          src={property.image}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm">
          <p className="text-sm font-bold text-gray-900">{property.price}</p>
        </div>
      </div>

      <div className="mt-5 space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>
        </div>
        <p className="text-gray-500 flex items-center gap-1 text-sm">
          <span className="opacity-70">📍</span> {property.location}
        </p>
        
        <div className="flex items-center gap-4 pt-3 text-xs font-medium text-gray-400 border-t border-gray-100 mt-2">
          <div className="flex items-center gap-1">
            <span className="text-gray-900">{property.beds}</span> Beds
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-900">{property.baths}</span> Baths
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-900">{property.sqft.toLocaleString()}</span> Sqft
          </div>
        </div>
      </div>
    </Link>
  );
}