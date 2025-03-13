"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArticleCardAdmin, SearchBar, DateFilter } from "../components/ArticlesComponentsAdmin";
import AddArticleModal from "../components/AddArticleModal";
import EditArticleModal from "../components/EditArticleModal";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface Article {
  id: string;
  title: string;
  content: string;
  image_url: string;
  date: string;
  id_profil: string;
  user_name: string;
  user_avatar: string;
}

const ArticlesPage: React.FC = () => {
  const supabase = createClientComponentClient(); // ✅ Correctement défini ici
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("publication").delete().eq("id", id);

    if (error) {
      console.error("Erreur lors de la suppression de l'article:", error);
      alert("Erreur lors de la suppression de l'article.");
    } else {
      setArticles((prevArticles) => prevArticles.filter((article) => article.id !== id));
    }
  };


  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from("publication")
        .select("id, titre, contenu, image_url, created_at, id_profil");

      if (error) {
        console.error("❌ Erreur lors de la récupération des articles:", error);
        return;
      }

      const articlesWithProfiles = await Promise.all(
        data.map(async (article) => {
          const { data: profileData, error: profileError } = await supabase
            .from("profils")
            .select("nom, photo_profil")
            .eq("id", article.id_profil)
            .single();

          if (profileError) {
            console.error(`⚠️ Erreur lors de la récupération du profil pour id_profil=${article.id_profil}`, profileError);
          }

          return {
            id: article.id,
            title: article.titre,
            content: article.contenu,
            image_url: article.image_url,
            date: article.created_at,
            id_profil: article.id_profil,
            user_name: profileData?.nom || "Utilisateur inconnu",
            user_avatar: profileData?.photo_profil || "/default-avatar.png",
          };
        })
      );

      setArticles(articlesWithProfiles);
    };

    fetchArticles();
  }, []);


  const handleEdit = (id: string) => {
    setCurrentArticleId(id);
    setIsEditModalOpen(true);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentArticleId(null);
  };

  const filteredArticles = articles.filter((article) => {
    return (
      (!searchQuery || article.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!startDate || article.date >= startDate) &&
      (!endDate || article.date <= endDate)
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Articles</h1>
      <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 p-6 rounded-lg shadow mb-6 space-y-4 md:space-y-0 md:space-x-4">
        <SearchBar setSearchQuery={setSearchQuery} />
       
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredArticles.map((article) => (
          <div key={article.id} className="cursor-pointer">
            <ArticleCardAdmin article={article} onDelete={handleDelete} onEdit={handleEdit} />
          </div>
        ))}
      </div>
      <div className="p-6">
        <button onClick={handleOpenModal} className="bg-blue-600 text-white px-4 py-2 rounded">
          Ajouter un article
        </button>
        <AddArticleModal isOpen={isModalOpen} onClose={handleCloseModal} />
        {currentArticleId && (
          <EditArticleModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} articleId={currentArticleId} />
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
