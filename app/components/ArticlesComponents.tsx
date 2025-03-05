"use client";


interface Article {
    id: string;
    title: string;
    excerpt: string;
    image_url: string;
    date: string;
  }
  
  interface SearchBarProps {
    setSearchQuery: (query: string) => void;
  }
  
  interface DateFilterProps {
    setStartDate: (date: string) => void;
    setEndDate: (date: string) => void;
  }
  
  // Composant pour une carte d'article
  const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
    return (
      <div className="bg-white shadow-lg rounded-2xl p-4 max-w-xs">
        <img src={article.image_url} alt={article.title} className="rounded-xl w-full h-40 object-cover" />
        <h3 className="text-lg font-bold mt-2">{article.title}</h3>
        <p className="text-sm text-gray-600">{article.excerpt}</p>
        <p className="text-xs text-gray-500 mt-2">{new Date(article.date).toLocaleDateString()}</p>
        <a href={`/articles/${article.id}`} className="text-blue-500 text-sm mt-2 flex items-center">Lire plus &rarr;</a>
      </div>
    );
  };
  
  // Barre de recherche
  const SearchBar: React.FC<SearchBarProps> = ({ setSearchQuery }) => {
    return (
      <input
        type="text"
        placeholder="Rechercher un article..."
        className="p-2 border rounded-lg w-full"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    );
  };
  
  // Filtre de date
  const DateFilter: React.FC<DateFilterProps> = ({ setStartDate, setEndDate }) => {
    return (
      <div className="flex space-x-2">
        <input type="date" className="p-2 border rounded-lg" onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" className="p-2 border rounded-lg" onChange={(e) => setEndDate(e.target.value)} />
      </div>
    );
  };
  
  export { ArticleCard, SearchBar, DateFilter };
  