// src/components/Footer/FooterWidgets.jsx
export default function FooterWidgets() {
    const widgets = [
      {
        title: 'About Us',
        content: 'MyGigGuide connects artists with venues and audiences. We help you discover amazing talent and book performances.',
      },
      {
        title: 'Quick Links',
        links: [
          { text: 'Home', url: '/' },
          { text: 'Artists', url: '/artists' },
          { text: 'Events', url: '/events' },
          { text: 'Venues', url: '/venues' },
        ],
      },
      {
        title: 'Contact Info',
        info: [
          { text: '123 Artist Lane, Creative City' },
          { text: 'hello@mygigguide.com' },
          { text: '+27 792 123-4567' },
        ],
      },
    ];
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {widgets.map((widget, index) => (
          <div key={index} className="footer-widget">
            <h3 className="text-white text-lg font-semibold mb-4">{widget.title}</h3>
            
            {widget.content && <p className="text-gray-400">{widget.content}</p>}
            
            {widget.links && (
              <ul className="space-y-2">
                {widget.links.map((link, i) => (
                  <li key={i}>
                    <a href={link.url} className="text-gray-400 hover:text-white transition-colors">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            
            {widget.info && (
              <ul className="space-y-2">
                {widget.info.map((item, i) => (
                  <li key={i} className="text-gray-400">
                    {item.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  }