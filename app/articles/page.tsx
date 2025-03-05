"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArticleCard, SearchBar, DateFilter } from "../components/ArticlesComponents";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  image_url: string;
  date: string;
  content?: string;
}

const mockArticles: Article[] = [
  { id: "1", title: "Randonnée en montagne", excerpt: "Une belle aventure en altitude.", image_url: "/images/mountain.jpg", date: "2025-03-01", content: "Description complète de l'article sur la randonnée en montagne..." },
  { id: "2", title: "Course en forêt", excerpt: "Découvrez les sentiers boisés.", image_url: "/images/forest.jpg", date: "2025-03-03", content: "Détails sur la course en forêt et ses bienfaits..." },
  { id: "3", title: "Balade avec les chiens", excerpt: "Une sortie agréable avec nos compagnons.", image_url: "/images/dogs.jpg", date: "2025-02-25", content: "Informations sur les balades organisées avec les chiens..." },
  { id: "4", title: "Marche nordique", excerpt: "Un exercice complet et accessible.", image_url: "/images/nordic.jpg", date: "2025-02-28", content: "Explication détaillée des bienfaits de la marche nordique..." }
];

const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    let filteredArticles = mockArticles;

    if (searchQuery) {
      filteredArticles = filteredArticles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (startDate) {
      filteredArticles = filteredArticles.filter(article => article.date >= startDate);
    }

    if (endDate) {
      filteredArticles = filteredArticles.filter(article => article.date <= endDate);
    }

    setArticles(filteredArticles);
  }, [searchQuery, startDate, endDate]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Articles</h1>
      <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 p-6 rounded-lg shadow mb-6 space-y-4 md:space-y-0 md:space-x-4">
        <SearchBar setSearchQuery={setSearchQuery} />
        <DateFilter setStartDate={setStartDate} setEndDate={setEndDate} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {articles.map((article) => (
          <div key={article.id} onClick={() => router.push(`/articles/${article.id}`)} className="cursor-pointer">
            <ArticleCard article={article} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticlesPage;
