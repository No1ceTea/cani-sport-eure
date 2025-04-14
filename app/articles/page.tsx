"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SearchBar, DateFilter } from "../components/ArticlesComponents";
import Sidebar from "../components/sidebars/Sidebar";
import Footer from "../components/sidebars/Footer";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import WhiteBackground from "../components/backgrounds/WhiteBackground";

interface Article {
  id: string;
  title: string;
  content: string;
  image_url: string;
  date: string;
  id_profil: string;
}

const ArticlesPage = () => {
  const supabase = createClientComponentClient();
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from("publication")
        .select("id, titre, contenu, image_url, created_at, id_profil")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur lors de la récupération des articles:", error);
      } else {
        setArticles(
          data.map((article) => ({
            id: article.id,
            title: article.titre,
            content: article.contenu,
            image_url: article.image_url,
            date: article.created_at,
            id_profil: article.id_profil,
          }))
        );
      }
    };
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter((article) => {
    return (
      (!searchQuery || article.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!startDate || article.date >= startDate) &&
      (!endDate || article.date <= endDate)
    );
  });

  const router = useRouter();

  const handleClick = (id :string) => {
    router.push(`/articles/${id}`);
  };

  return (
    <div>
      <Sidebar /> 
      <WhiteBackground>
    <div className="min-h-screen px-10 py-6">
      {/* Titre principal */}
      <div className="text-left">
      <h1 className="primary_title_blue text-4xl font-bold text-black mb-6">Articles</h1>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8 px-4">
        <div className="w-full md:w-1/2">
          <SearchBar setSearchQuery={setSearchQuery}/>
        </div>
        <div className="flex gap-4">
          <DateFilter setStartDate={setStartDate} setEndDate={setEndDate} />
        </div>
      </div>

      {/* Liste des articles */}
      <div className="max-w-6xl mx-auto max-h-[700px] overflow-y-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div key={article.id} className="bg-white shadow-lg rounded-2xl p-4 max-w-xs relative">
              <img src={article.image_url} alt={article.title} className="rounded-xl w-full h-40 object-cover" />
              <h3 className="text-lg font-bold mt-2">{article.title}</h3>
              <p className="text-sm text-gray-600">{article.content.slice(0, 100)}...</p>
              <p className="text-xs text-gray-500 mt-2">{new Date(article.date).toLocaleDateString()}</p>
              <button onClick={() => handleClick(article.id)} className="text-blue-500">
                Lire plus →
              </button>
            </div>
          ))}
        </div>
      </div>


    </div>
    </WhiteBackground> <Footer/> </div>
  );
};

export default ArticlesPage;
