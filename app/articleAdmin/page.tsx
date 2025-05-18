"use client"; // Indique que ce composant s'exécute côté client

import { useState, useEffect } from "react"; // Hooks React pour les états et effets
import { useRouter } from "next/navigation"; // Navigation entre pages
import { ArticleCardAdmin } from "../components/ArticlesComponentsAdmin"; // Composant de carte d'article
import AddArticleModal from "../components/AddArticleModal"; // Modal d'ajout d'article
import EditArticleModal from "../components/EditArticleModal"; // Modal d'édition d'article
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"; // Client Supabase
import SidebarAdmin from "../components/SidebarAdmin"; // Barre latérale admin
import ModalConfirm from "../components/ModalConfirm"; // Modal de confirmation
import { useAuth } from "@/app/components/Auth/AuthProvider"; // Contexte d'authentification
import { FaSearch } from "react-icons/fa"; // Icône de recherche

// Structure des articles
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
  const supabase = createClientComponentClient(); // Initialisation du client Supabase
  const { user, role, isLoading } = useAuth(); // Récupération des infos d'authentification
  const router = useRouter(); // Router pour la navigation

  // États pour la gestion des articles
  const [articles, setArticles] = useState<Article[]>([]); // Liste des articles
  const [searchQuery, setSearchQuery] = useState<string>(""); // Terme de recherche
  const [startDate, setStartDate] = useState<string>(""); // Filtre de date début
  const [endDate, setEndDate] = useState<string>(""); // Filtre de date fin

  // États pour les modales
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal d'ajout
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal d'édition
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null); // ID de l'article en cours d'édition
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // Modal de confirmation
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null); // ID de l'article à supprimer

  // Protection de la route - redirection si l'utilisateur n'est pas admin
  useEffect(() => {
    if (!isLoading && (!user || role !== "admin")) {
      router.replace("/connexion");
    }
  }, [user, role, isLoading, router]);

  // Récupération des articles depuis Supabase
  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from("publication")
      .select("id, titre, contenu, image_url, created_at, id_profil");

    if (error) {
      console.error("❌ Erreur lors de la récupération des articles:", error);
      return;
    }

    // Enrichissement des articles avec les données des auteurs
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

  // Chargement des articles au montage du composant
  useEffect(() => {
    if (user && role === "admin") fetchArticles();
  }, [user, role]);

  // Préparation de la suppression d'un article
  const confirmDelete = (id: string) => {
    setArticleToDelete(id);
    setIsConfirmOpen(true);
  };

  // Suppression effective d'un article
  const handleDelete = async () => {
    if (!articleToDelete) return;
    const { error } = await supabase
      .from("publication")
      .delete()
      .eq("id", articleToDelete);
    if (!error)
      setArticles((prev) => prev.filter((a) => a.id !== articleToDelete));
    setIsConfirmOpen(false);
    setArticleToDelete(null);
  };

  // Ouverture de l'éditeur d'article
  const handleEdit = (id: string) => {
    setCurrentArticleId(id);
    setIsEditModalOpen(true);
  };

  // Fermeture des modales
  const handleCloseModal = () => setIsModalOpen(false);
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentArticleId(null);
  };

  // Filtrage des articles selon les critères de recherche
  const filteredArticles = articles.filter((article) => {
    return (
      (!searchQuery ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!startDate || article.date >= startDate) &&
      (!endDate || article.date <= endDate)
    );
  });

  // Affichage vide pendant le chargement ou si non autorisé
  if (isLoading || !user || role !== "admin") return null;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Barre latérale avec bouton d'ajout */}
      <SidebarAdmin onAdd={() => setIsModalOpen(true)} />

      <div className="p-6 py-16 mx-auto flex-1 flex flex-col">
        {/* Barre de recherche responsive */}
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

        {/* Grille d'articles responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full overflow-y-auto p-2">
          {filteredArticles.map((article) => (
            <div key={article.id}>
              <ArticleCardAdmin
                article={article}
                onDelete={() => confirmDelete(article.id)}
                onEdit={handleEdit}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modales de confirmation, ajout et édition */}
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
