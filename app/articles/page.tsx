"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArticleCard, SearchBar, DateFilter } from "../components/ArticlesComponents";
import AddArticleModal from "../components/AddArticleModal";
import EditArticleModal from "../components/EditArticleModal";
import supabase from "../../lib/supabaseClient";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";


interface Article {
  id: string;
  title: string;
  content: string;
  image_url: string;
  date: string;
  id_profil: string;
}

const ArticlesPage: React.FC = () => {

const supabase = createClientComponentClient();
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);


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

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("publication").delete().eq("id", id);

    if (error) {
      console.error("Erreur lors de la suppression de l'article:", error);
      alert("Erreur lors de la suppression de l'article.");
    } else {
      setArticles((prevArticles) => prevArticles.filter((article) => article.id !== id));
    }
  };


  const router = useRouter();
  const [userType, setUserType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      // 🔹 Vérifie si l'utilisateur est connecté
      const { data: userSession } = await supabase.auth.getSession();

      if (!userSession.session) {
        console.log("🔴 Utilisateur non connecté, redirection vers /connexion");
        //router.replace("/connexion");
        return;
      }

      // 🔹 Récupère les données utilisateur
      const { data: userData, error } = await supabase.auth.getUser();

      if (error || !userData?.user) {
        console.log("❌ Erreur lors de la récupération de l'utilisateur :", error);
       // router.replace("/connexion");
        return;
      }

      console.log("🔍 Données de l'utilisateur :", userData.user.user_metadata);

      // ✅ Stocke l'UUID de l'utilisateur
      setUserId(userData.user.id);

      const isAdmin = userData.user.user_metadata?.administrateur === true;

      if (isAdmin) {
        console.log("🔴 Admin détecté, redirection vers /dashboard/admin");
       // router.replace("/dashboard/admin");
      } else {
        console.log("✅ Utilisateur adhérent détecté, accès autorisé !");
        setUserType("client");
      }

      console.log(userData.user.id)

      setIsLoading(false);
    };

    checkUser();
  }, [router, supabase.auth]);

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
        <DateFilter setStartDate={setStartDate} setEndDate={setEndDate} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredArticles.map((article) => (
          <div key={article.id} className="cursor-pointer">
            <ArticleCard article={article} onDelete={handleDelete} onEdit={handleEdit} />
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default ArticlesPage;
