"use client";

import { Link, X, Edit } from "lucide-react";

interface Article {
  id: string;
  title: string;
  content: string;
  image_url: string;
  date: string;
  id_profil: string;
}

interface SearchBarProps {
  setSearchQuery: (query: string) => void;
}

interface DateFilterProps {
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
}

// Composant pour une carte d'article
const ArticleCard: React.FC<{ article: Article; onDelete: (id: string) => void; onEdit: (id: string) => void }> = ({ article, onDelete, onEdit }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 max-w-xs relative">
      {/* Icônes en haut à droite */}
      <div className="absolute top-2 right-2 flex space-x-2">
        <button onClick={() => onDelete(article.id)} className="text-red-500">
          <X size={20} />
        </button>
        <button onClick={() => onEdit(article.id)} className="text-blue-500">
          <Edit size={20} />
        </button>
      </div>
      
      <img src={article.image_url} alt={article.title} className="rounded-xl w-full h-40 object-cover" />
      <h3 className="text-lg font-bold mt-2">{article.title}</h3>
      <p className="text-sm text-gray-600">{article.content.slice(0, 100)}...</p>
      <p className="text-xs text-gray-500 mt-2">{new Date(article.date).toLocaleDateString()}</p>
      <Link href={`/article/${article.id}`} className="text-blue-500 text-sm mt-2 flex items-center">Lire plus &rarr;</Link>
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
