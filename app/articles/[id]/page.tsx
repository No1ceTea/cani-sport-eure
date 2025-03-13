"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Article {
  id: string;
  title: string;
  content: string;
  image_url: string;
  date: string;
}

const mockArticles: Article[] = [
  { id: "1", title: "Randonnée en montagne", content: "Description complète de l'article sur la randonnée en montagne...", image_url: "/images/mountain.jpg", date: "2025-03-01" },
  { id: "2", title: "Course en forêt", content: "Détails sur la course en forêt et ses bienfaits...", image_url: "/images/forest.jpg", date: "2025-03-03" },
  { id: "3", title: "Balade avec les chiens", content: "Informations sur les balades organisées avec les chiens...", image_url: "/images/dogs.jpg", date: "2025-02-25" },
  { id: "4", title: "Marche nordique", content: "Explication détaillée des bienfaits de la marche nordique...", image_url: "/images/nordic.jpg", date: "2025-02-28" }
];

const ArticleDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (id) {
      const foundArticle = mockArticles.find((art) => art.id === id);
      if (foundArticle) setArticle(foundArticle);
    }
  }, [id]);

  if (!article) {
    return <div className="text-center mt-10 text-xl">Article non trouvé</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-blue-900 text-white rounded-xl shadow-lg mt-10">
      <div className="flex items-center space-x-4 mb-6">
        <img src="/images/user-placeholder.jpg" alt="Auteur" className="w-12 h-12 rounded-full" />
        <div>
          <p className="text-lg font-semibold">Nom</p>
          <p className="text-sm text-gray-300">Il y a 20 minutes</p>
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <p className="leading-relaxed">{article.content}</p>
        <img src={article.image_url} alt={article.title} className="rounded-lg shadow-md" />
      </div>
      <p className="mt-6 text-sm text-gray-300">Créé le {new Date(article.date).toLocaleDateString()}</p>
    </div>
  );
};

export default ArticleDetail;
