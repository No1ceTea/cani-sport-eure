"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "../../../lib/supabaseClient";

interface Article {
  id: string;
  titre: string;
  contenu: string;
  image_url: string;
  created_at: string;
  id_profil: string;
}

const ArticleDetail = () => {
  const { id } = useParams() as { id: string };
  const [article, setArticle] = useState<Article | null>(null);
  const [author, setAuthor] = useState<{ name: string; avatar: string } | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("publication")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erreur lors du chargement de l'article :", error);
      } else {
        setArticle(data as Article);
        fetchAuthor(data.id_profil);
      }
    };

    const fetchAuthor = async (authorId: string) => {
      const { data, error } = await supabase
        .from("users") // Assure-toi que cette table contient les profils des auteurs
        .select("name, avatar")
        .eq("id", authorId)
        .single();

      if (!error) setAuthor(data);
    };

    fetchArticle();
  }, [id]);

  if (!article) return <p>Chargement...</p>;

  return (
    <div className="min-h-screen px-10 py-6 bg-gray-100">
      {/* Titre principal */}
      <h1 className="primary_title_blue text-4xl font-bold text-black mb-6">Articles</h1>

      {/* Carte contenant l'article */}
      <div className="bg-blue-900 text-white p-10 rounded-3xl shadow-lg flex flex-col md:flex-row items-left gap-6 max-w-6xl mx-auto border-black border-2 max-h-[800px] overflow-hidden">
        
        {/* Partie gauche : Texte avec scroll */}
        <div className="flex-1 flex flex-col max-h-[700px] overflow-y-auto p-4">
          {/* Auteur */}
          <div className="flex gap-3 mb-4">
            {author && <img src={author.avatar} alt={author.name} className="w-10 h-10 rounded-full" />}
            <div>
              <p className="font-bold">{author ? author.name : "Auteur inconnu"}</p>
              <p className="text-sm text-gray-300">Il y a 20 minutes</p>
            </div>
          </div>

          {/* Contenu de l'article (scrollable) */}
          <h2 className="text-xl font-bold">{article.titre}</h2>
          <p className="mt-2 text-gray-200 whitespace-pre-line">{article.contenu}</p>

          {/* Date */}
          <p className="mt-4 text-sm text-gray-300">
            Créé le {new Date(article.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Partie droite : Image fixe */}
        <div className="w-64 h-64 flex-shrink-0">
          <img src={article.image_url} alt={article.titre} className="w-full h-full object-cover rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
