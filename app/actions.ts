"use server";

import fs from "fs/promises";
import path from "path";

export async function saveOrder(orderData: any) {
  try {
    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "orders.json");

    // Vérifier si le fichier existe, sinon le créer avec un tableau vide
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, "[]", "utf-8");
    }

    // Lire le contenu actuel
    const fileContent = await fs.readFile(filePath, "utf-8");
    const orders = JSON.parse(fileContent || "[]");

    // Ajouter la nouvelle commande
    const newOrder = {
      ...orderData,
      createdAt: new Date().toISOString(),
      status: "PAID", // On suppose que PayPal a validé
    };

    orders.push(newOrder);

    // Écrire le fichier mis à jour
    await fs.writeFile(filePath, JSON.stringify(orders, null, 2), "utf-8");

    return { success: true, message: "Commande enregistrée avec succès" };
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la commande:", error);
    return { success: false, message: "Erreur serveur interne" };
  }
}
