// Importation des types Next.js pour les requêtes et réponses API
import { NextApiRequest, NextApiResponse } from "next";
// Importation d'axios pour effectuer des requêtes HTTP
import axios from "axios";

// Fonction principale de gestion des requêtes API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Vérification que la méthode utilisée est DELETE
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  // Extraction de l'ID de l'événement depuis le corps de la requête
  const { eventId } = req.body;
  // Vérification que l'ID est bien fourni
  if (!eventId) {
    return res.status(400).json({ error: "ID de l'événement requis" });
  }
  // Validation de l'ID de l'événement
  const eventIdPattern = /^[a-zA-Z0-9_-]+$/; // Autorise uniquement les caractères alphanumériques, tirets et underscores
  if (!eventIdPattern.test(eventId)) {
    return res.status(400).json({ error: "ID de l'événement invalide" });
  }

  try {
    // Requête DELETE à l'API Google Calendar pour supprimer l'événement
    await axios.delete(
      `https://www.googleapis.com/calendar/v3/calendars/${process.env.GOOGLE_CALENDAR_ID}/events/${eventId}`,
      {
        headers: {
          // Utilisation du token d'accès pour l'authentification
          Authorization: `Bearer ${process.env.GOOGLE_ACCESS_TOKEN}`,
        },
      }
    );

    // Réponse de succès
    res.status(200).json({ message: "Événement supprimé avec succès" });
  } catch (error) {
    // Journalisation et gestion des erreurs
    console.error("Erreur suppression:", error);
    res.status(500).json({ error: "Erreur lors de la suppression de l'événement" });
  }
}