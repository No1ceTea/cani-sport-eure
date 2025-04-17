"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArticleCardAdmin } from "../components/ArticlesComponentsAdmin";
import AddArticleModal from "../components/AddArticleModal";
import EditArticleModal from "../components/EditArticleModal";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import SidebarAdmin from "../components/SidebarAdmin";
import ModalConfirm from "../components/ModalConfirm";
import { useAuth } from "@/app/components/Auth/AuthProvider";
import { FaSearch } from "react-icons/fa";

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
  const supabase = createClientComponentClient();
  const { user, role, isLoading } = useAuth();
  const router = useRouter();

  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || role !== "admin")) {
      router.replace("/connexion");
    }
  }, [user, role, isLoading, router]);

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
        const { data: profileData } = await supabase
          .from("profils")
          .select("nom, photo_profil")
          .eq("id", article.id_profil)
          .single();

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

  useEffect(() => {
    if (user && role === "admin") fetchArticles();
  }, [user, role]);

  const confirmDelete = (id: string) => {
    setArticleToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!articleToDelete) return;
    const { error } = await supabase.from("publication").delete().eq("id", articleToDelete);
    if (!error) setArticles((prev) => prev.filter((a) => a.id !== articleToDelete));
    setIsConfirmOpen(false);
    setArticleToDelete(null);
  };

  const handleEdit = (id: string) => {
    setCurrentArticleId(id);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);
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

  if (isLoading || !user || role !== "admin") return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarAdmin onAdd={() => setIsModalOpen(true)} />

      <div className="p-6 py-16 mx-auto flex-1 flex flex-col">
        {/* 🔍 Barre de recherche responsive */}
        <div className="relative w-full max-w-2xl mb-6">
          <input
            type="text"
            placeholder="Rechercher un article"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-4 pr-10 text-base sm:text-lg border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-900 shadow-md"
          />
          <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-900 text-base sm:text-lg" />
        </div>

        {/* 📰 Grille d'articles responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full overflow-y-auto p-2">
          {filteredArticles.map((article) => (
            <div key={article.id}>
              <ArticleCardAdmin article={article} onDelete={() => confirmDelete(article.id)} onEdit={handleEdit} />
            </div>
          ))}
        </div>
      </div>

      {/* 🔒 Modales */}
      <ModalConfirm
        isOpen={isConfirmOpen}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />

      <AddArticleModal isOpen={isModalOpen} onClose={handleCloseModal} />

      {isEditModalOpen && currentArticleId && (
        <EditArticleModal
          isOpen={isEditModalOpen}
          articleId={currentArticleId}
          onClose={handleCloseEditModal}
          onUpdate={() => {
            handleCloseEditModal();
            fetchArticles();
          }}
        />
      )}
    </div>
  );
};

export default ArticlesPage;
