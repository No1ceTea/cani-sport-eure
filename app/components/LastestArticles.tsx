"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../lib/supabaseClient";
import Image from "next/image";

interface Article {
  id: string;
  titre: string;
  contenu: string;
  image_url: string;
  created_at: string;
}

const LastestArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from("publication")
        .select("id, titre, contenu, image_url, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Erreur lors de la récupération des articles :", error);
      } else {
        setArticles(data);
      }
    };

    fetchArticles();
  }, []);

  const handleGoToArticles = () => {
    router.push("/articles");
  };

  const handleReadMore = (id: string) => {
    router.push(`/articles/${id}`);
  };

  return (
    <div className="mx-auto px-16 py-16">
      <h2 className="text-3xl font-semibold primary_title_black mb-8">
        Nos derniers articles
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 py-8">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-white shadow-md p-4 rounded-lg max-w-sm"
          >
            <Image
              src={article.image_url}
              alt={article.titre}
              className="w-full h-40 object-cover rounded-md"
              width={800}
              height={800}

            />
            <h3 className="text-lg font-bold mt-4">{article.titre}</h3>
            <p className="text-sm text-gray-600 mt-2">
              {article.contenu.slice(0, 80)}...
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(article.created_at).toLocaleDateString()}
            </p>
            <button
              onClick={() => handleReadMore(article.id)}
              className="mt-4 text-sm font-medium text-blue-700 flex items-center gap-1"
            >
              Lire plus <span>➔</span>
            </button>
          </div>
        ))}

        {/* ✅ Carte bouton "Plus d’articles" */}
        <div className="max-w-sm flex items-center justify-center">
          <button
            onClick={handleGoToArticles}
            className="bg-blue-900 text-white px-6 py-3 rounded-full text-sm flex items-center gap-2 hover:bg-blue-800 add_border"
          >
            Plus d’articles <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LastestArticles;
