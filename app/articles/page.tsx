"use client";


import { useState, useEffect } from "react";
import { ArticleCard, SearchBar, DateFilter } from "../components/ArticlesComponents";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  image_url: string;
  date: string;
}

const mockArticles: Article[] = [
  { id: "1", title: "Randonnée en montagne", excerpt: "Une belle aventure en altitude.", image_url: "/images/mountain.jpg", date: "2025-03-01" },
  { id: "2", title: "Course en forêt", excerpt: "Découvrez les sentiers boisés.", image_url: "/images/forest.jpg", date: "2025-03-03" },
  { id: "3", title: "Balade avec les chiens", excerpt: "Une sortie agréable avec nos compagnons.", image_url: "/images/dogs.jpg", date: "2025-02-25" },
  { id: "4", title: "Marche nordique", excerpt: "Un exercice complet et accessible.", image_url: "/images/nordic.jpg", date: "2025-02-28" }
];

const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Articles</h1>
      <div className="flex space-x-4 mb-4">
        <SearchBar setSearchQuery={setSearchQuery} />
        <DateFilter setStartDate={setStartDate} setEndDate={setEndDate} />
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default ArticlesPage;
