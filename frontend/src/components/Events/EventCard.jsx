import { Link } from 'react-router-dom';

const EventCard = ({ event, who }) => {
  const { id, name, price, date, poster, status } = event;

  return (
    <Link 
      to={`/${who}/event/${id}`}
      className="group block rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-square">
        {/* Image with gradient overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${poster})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        </div>

        {/* Status badge - top right */}
        {status && (
          <div className="absolute top-3 right-3 backdrop-blur-sm bg-white/80 px-3 py-1 rounded-full">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-900">
              {status}
            </span>
          </div>
        )}

        {/* Price badge - bottom left */}
        <div className="absolute bottom-3 left-3 backdrop-blur-sm bg-black/70 px-3 py-1.5 rounded-full">
          <span className="text-sm font-bold text-white">
            {price > 0 ? `R${price.toFixed(2)}` : 'FREE'}
          </span>
        </div>
      </div>

      {/* Card footer */}
      <div className="p-4 bg-white">
        <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">{name}</h3>
        <p className="text-sm text-gray-500">
          {new Date(date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
      </div>
    </Link>
  );
};

export default EventCard;